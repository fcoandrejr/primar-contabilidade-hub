import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_by: string;
  assigned_to?: string;
  client_id?: string;
  is_recurring: boolean;
  recurrence_type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrence_interval?: number;
  parent_task_id?: string;
  is_blocked: boolean;
  blocked_reason?: string;
  can_admin_override: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    nome: string;
    email: string;
  };
  assigned_user?: {
    nome: string;
    email: string;
  };
  client?: {
    nome: string;
    email: string;
  };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks((data as any) || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tarefas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const insertData = {
        title: taskData.title!,
        description: taskData.description,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        due_date: taskData.due_date,
        assigned_to: taskData.assigned_to,
        client_id: taskData.client_id,
        is_recurring: taskData.is_recurring || false,
        recurrence_type: taskData.recurrence_type,
        recurrence_interval: taskData.recurrence_interval,
        is_blocked: taskData.is_blocked || false,
        blocked_reason: taskData.blocked_reason,
        can_admin_override: taskData.can_admin_override !== false,
        created_by: user?.id!,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso",
      });

      fetchTasks();
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tarefa",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso",
      });

      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tarefa",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso",
      });

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir tarefa",
        variant: "destructive",
      });
      throw error;
    }
  };

  const unblockTask = async (taskId: string) => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Apenas administradores podem desbloquear tarefas",
        variant: "destructive",
      });
      return;
    }

    await updateTask(taskId, { is_blocked: false, blocked_reason: null });
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    unblockTask,
    refetch: fetchTasks
  };
}