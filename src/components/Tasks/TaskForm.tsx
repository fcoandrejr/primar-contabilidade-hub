import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/hooks/useTasks';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TaskFormProps {
  task?: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (taskData: Partial<Task>) => void;
}

interface Profile {
  id: string;
  nome: string;
  email: string;
  user_id: string;
}

export function TaskForm({ task, open, onOpenChange, onSubmit }: TaskFormProps) {
  const { user, isAdmin, isFuncionario } = useAuth();
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    is_recurring: false,
    recurrence_type: 'weekly',
    recurrence_interval: 1,
    is_blocked: false,
  });
  const [dueDate, setDueDate] = useState<Date>();
  const [clients, setClients] = useState<Profile[]>([]);
  const [funcionarios, setFuncionarios] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assigned_to: task.assigned_to,
        client_id: task.client_id,
        is_recurring: task.is_recurring,
        recurrence_type: task.recurrence_type,
        recurrence_interval: task.recurrence_interval,
        is_blocked: task.is_blocked,
        blocked_reason: task.blocked_reason,
      });
      if (task.due_date) {
        setDueDate(new Date(task.due_date));
      }
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        is_recurring: false,
        recurrence_type: 'weekly',
        recurrence_interval: 1,
        is_blocked: false,
      });
      setDueDate(undefined);
    }
  }, [task]);

  useEffect(() => {
    if (open) {
      fetchClients();
      fetchFuncionarios();
    }
  }, [open]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email, user_id')
        .eq('ativo', true);

      if (error) throw error;

      // Filter only clients based on user_roles
      const { data: clientRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'cliente');

      if (rolesError) throw rolesError;

      const clientUserIds = clientRoles.map(role => role.user_id);
      const clientProfiles = data.filter(profile => 
        clientUserIds.includes(profile.user_id)
      );

      setClients(clientProfiles);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email, user_id')
        .eq('ativo', true);

      if (error) throw error;

      // Filter funcionarios and admins
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['funcionario', 'admin']);

      if (rolesError) throw rolesError;

      const funcionarioUserIds = roles.map(role => role.user_id);
      const funcionarioProfiles = data.filter(profile => 
        funcionarioUserIds.includes(profile.user_id)
      );

      setFuncionarios(funcionarioProfiles);
    } catch (error) {
      console.error('Error fetching funcionarios:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        due_date: dueDate?.toISOString(),
      };

      await onSubmit(submitData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const canBlockTasks = isAdmin || isFuncionario;

  console.log('TaskForm render - open:', open, 'task:', task);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Task['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Cliente</Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) => setFormData({ ...formData, client_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum cliente</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nome} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Responsável</Label>
            <Select
              value={formData.assigned_to}
              onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum responsável</SelectItem>
                {funcionarios.map(func => (
                  <SelectItem key={func.user_id} value={func.user_id}>
                    {func.nome} ({func.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={formData.is_recurring}
              onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
            />
            <Label htmlFor="recurring">Tarefa Recorrente</Label>
          </div>

          {formData.is_recurring && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Recorrência</Label>
                <Select
                  value={formData.recurrence_type}
                  onValueChange={(value) => setFormData({ ...formData, recurrence_type: value as Task['recurrence_type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Intervalo</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.recurrence_interval}
                  onChange={(e) => setFormData({ ...formData, recurrence_interval: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}

          {canBlockTasks && (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id="blocked"
                  checked={formData.is_blocked}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_blocked: checked })}
                />
                <Label htmlFor="blocked">Tarefa Bloqueada</Label>
              </div>

              {formData.is_blocked && (
                <div>
                  <Label htmlFor="blocked_reason">Motivo do Bloqueio</Label>
                  <Textarea
                    id="blocked_reason"
                    value={formData.blocked_reason}
                    onChange={(e) => setFormData({ ...formData, blocked_reason: e.target.value })}
                    rows={2}
                  />
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : task ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}