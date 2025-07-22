-- Create enum for task status
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'completed', 'cancelled');

-- Create enum for task priority
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create enum for recurrence type
CREATE TYPE public.recurrence_type AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_type recurrence_type,
  recurrence_interval INTEGER DEFAULT 1,
  next_occurrence TIMESTAMP WITH TIME ZONE,
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  blocked_reason TEXT,
  can_admin_override BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task comments table
CREATE TABLE public.task_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task attachments table
CREATE TABLE public.task_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user can access task
CREATE OR REPLACE FUNCTION public.can_access_task(_user_id UUID, _task_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tasks t
    LEFT JOIN public.profiles p ON t.client_id = p.id
    WHERE t.id = _task_id
      AND (
        -- Task creator can always access
        t.created_by = _user_id
        -- Assigned user can access
        OR t.assigned_to = _user_id
        -- Admins can access all tasks
        OR public.has_role(_user_id, 'admin')
        -- Funcionarios can access tasks of their clients
        OR (public.has_role(_user_id, 'funcionario') AND public.has_role(p.user_id, 'cliente'))
        -- Clients can access their own tasks
        OR (public.has_role(_user_id, 'cliente') AND p.user_id = _user_id)
      )
  )
$$;

-- RLS Policies for tasks
CREATE POLICY "Users can view accessible tasks"
  ON public.tasks
  FOR SELECT
  USING (public.can_access_task(auth.uid(), id));

CREATE POLICY "Users can create tasks for accessible clients"
  ON public.tasks
  FOR INSERT
  WITH CHECK (
    -- Admins can create tasks for anyone
    public.has_role(auth.uid(), 'admin')
    -- Funcionarios can create tasks for their clients
    OR (
      public.has_role(auth.uid(), 'funcionario') 
      AND (
        client_id IS NULL 
        OR EXISTS (
          SELECT 1 FROM public.profiles p 
          WHERE p.id = client_id 
          AND public.has_role(p.user_id, 'cliente')
        )
      )
    )
    -- Clients can create tasks for themselves
    OR (
      public.has_role(auth.uid(), 'cliente') 
      AND EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = client_id 
        AND p.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update accessible tasks"
  ON public.tasks
  FOR UPDATE
  USING (public.can_access_task(auth.uid(), id));

CREATE POLICY "Task creators and admins can delete tasks"
  ON public.tasks
  FOR DELETE
  USING (
    created_by = auth.uid() 
    OR public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for task_comments
CREATE POLICY "Users can view comments of accessible tasks"
  ON public.task_comments
  FOR SELECT
  USING (public.can_access_task(auth.uid(), task_id));

CREATE POLICY "Users can create comments on accessible tasks"
  ON public.task_comments
  FOR INSERT
  WITH CHECK (public.can_access_task(auth.uid(), task_id));

CREATE POLICY "Comment creators can update their comments"
  ON public.task_comments
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Comment creators and admins can delete comments"
  ON public.task_comments
  FOR DELETE
  USING (
    user_id = auth.uid() 
    OR public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for task_attachments
CREATE POLICY "Users can view attachments of accessible tasks"
  ON public.task_attachments
  FOR SELECT
  USING (public.can_access_task(auth.uid(), task_id));

CREATE POLICY "Users can upload attachments to accessible tasks"
  ON public.task_attachments
  FOR INSERT
  WITH CHECK (public.can_access_task(auth.uid(), task_id));

CREATE POLICY "Uploaders and admins can delete attachments"
  ON public.task_attachments
  FOR DELETE
  USING (
    uploaded_by = auth.uid() 
    OR public.has_role(auth.uid(), 'admin')
  );

-- Function to create recurring tasks
CREATE OR REPLACE FUNCTION public.create_recurring_task()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If this is a recurring task and it's marked as completed
  IF NEW.is_recurring AND NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Create next occurrence
    INSERT INTO public.tasks (
      title,
      description,
      status,
      priority,
      due_date,
      created_by,
      assigned_to,
      client_id,
      is_recurring,
      recurrence_type,
      recurrence_interval,
      parent_task_id,
      is_blocked,
      can_admin_override
    ) VALUES (
      NEW.title,
      NEW.description,
      'todo',
      NEW.priority,
      CASE 
        WHEN NEW.recurrence_type = 'daily' THEN NEW.due_date + (NEW.recurrence_interval || ' days')::interval
        WHEN NEW.recurrence_type = 'weekly' THEN NEW.due_date + (NEW.recurrence_interval || ' weeks')::interval
        WHEN NEW.recurrence_type = 'monthly' THEN NEW.due_date + (NEW.recurrence_interval || ' months')::interval
        WHEN NEW.recurrence_type = 'yearly' THEN NEW.due_date + (NEW.recurrence_interval || ' years')::interval
      END,
      NEW.created_by,
      NEW.assigned_to,
      NEW.client_id,
      NEW.is_recurring,
      NEW.recurrence_type,
      NEW.recurrence_interval,
      NEW.parent_task_id,
      NEW.is_blocked,
      NEW.can_admin_override
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for recurring tasks
CREATE TRIGGER create_recurring_task_trigger
  AFTER UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.create_recurring_task();

-- Function to update timestamps
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_tasks_client_id ON public.tasks(client_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON public.tasks(created_by);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_task_comments_task_id ON public.task_comments(task_id);
CREATE INDEX idx_task_attachments_task_id ON public.task_attachments(task_id);