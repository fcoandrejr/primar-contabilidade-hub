import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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

      const clientUserIds = clientRoles?.map(role => role.user_id) || [];
      const clientProfiles = data?.filter(profile => 
        clientUserIds.includes(profile.user_id)
      ) || [];

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

      const roleUserIds = roles?.map(role => role.user_id) || [];
      const roleProfiles = data?.filter(profile => 
        roleUserIds.includes(profile.user_id)
      ) || [];

      setFuncionarios(roleProfiles);
    } catch (error) {
      console.error('Error fetching funcionarios:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      due_date: dueDate?.toISOString(),
    };

    onSubmit(taskData);
  };

  const canBlockTasks = isAdmin || isFuncionario;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
          <DialogDescription>
            {task 
              ? 'Atualize as informações da tarefa existente'
              : 'Preencha os dados para criar uma nova tarefa no sistema'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Informações Básicas</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Título da Tarefa *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva os detalhes da tarefa"
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={formData.priority || 'medium'}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
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

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status || 'todo'}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">A Fazer</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
          </div>

          {/* Atribuições */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Atribuições</h3>
            
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={formData.client_id || 'none'}
                onValueChange={(value) => setFormData({ ...formData, client_id: value === 'none' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum cliente</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select
                value={formData.assigned_to || 'none'}
                onValueChange={(value) => setFormData({ ...formData, assigned_to: value === 'none' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum responsável</SelectItem>
                  {funcionarios.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.user_id}>
                      {funcionario.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recorrência */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Configurações Avançadas</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.is_recurring || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
              />
              <Label htmlFor="recurring">Tarefa Recorrente</Label>
            </div>

            {formData.is_recurring && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipo de Recorrência</Label>
                  <Select
                    value={formData.recurrence_type || 'weekly'}
                    onValueChange={(value) => setFormData({ ...formData, recurrence_type: value as any })}
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

                <div className="space-y-2">
                  <Label>Intervalo</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.recurrence_interval || 1}
                    onChange={(e) => setFormData({ ...formData, recurrence_interval: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
            )}

            {canBlockTasks && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="blocked"
                    checked={formData.is_blocked || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_blocked: checked })}
                  />
                  <Label htmlFor="blocked">Tarefa Bloqueada</Label>
                </div>

                {formData.is_blocked && (
                  <div className="space-y-2">
                    <Label htmlFor="blocked_reason">Motivo do Bloqueio</Label>
                    <Textarea
                      id="blocked_reason"
                      value={formData.blocked_reason || ''}
                      onChange={(e) => setFormData({ ...formData, blocked_reason: e.target.value })}
                      placeholder="Descreva o motivo do bloqueio"
                      rows={2}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="gradient-primary" disabled={loading}>
              {loading ? "Salvando..." : task ? 'Atualizar' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}