import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, User, Shield, ShieldAlert } from 'lucide-react';
import { Task } from '@/hooks/useTasks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskListProps {
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onUnblockTask: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  isAdmin: boolean;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

const statusLabels = {
  todo: 'A Fazer',
  in_progress: 'Em Progresso',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const statusColors = {
  todo: 'bg-slate-100 text-slate-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function TaskList({ 
  tasks, 
  onTaskEdit, 
  onTaskDelete, 
  onUnblockTask, 
  onTaskUpdate,
  isAdmin 
}: TaskListProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id}
              className={task.is_blocked ? 'bg-red-50 border-red-200' : ''}
            >
              <TableCell>
                <div>
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {task.description}
                    </div>
                  )}
                  <div className="flex gap-1 mt-1">
                    {task.is_recurring && (
                      <Badge variant="outline" className="text-xs">
                        Recorrente
                      </Badge>
                    )}
                    {task.is_blocked && (
                      <Badge variant="destructive" className="text-xs">
                        <ShieldAlert className="w-3 h-3 mr-1" />
                        Bloqueada
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`${statusColors[task.status]}`}
                >
                  {statusLabels[task.status]}
                </Badge>
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`${priorityColors[task.priority]}`}
                >
                  {priorityLabels[task.priority]}
                </Badge>
              </TableCell>
              
              <TableCell>
                {task.client ? (
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span className="text-sm">{task.client.nome}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              
              <TableCell>
                {task.assigned_user ? (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="text-sm">{task.assigned_user.nome}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              
              <TableCell>
                {task.due_date ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-sm">
                      {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onTaskEdit(task)}>
                      Editar
                    </DropdownMenuItem>
                    {task.status !== 'completed' && (
                      <DropdownMenuItem 
                        onClick={() => onTaskUpdate(task.id, { status: 'completed' })}
                      >
                        Marcar como Concluída
                      </DropdownMenuItem>
                    )}
                    {task.is_blocked && isAdmin && (
                      <DropdownMenuItem onClick={() => onUnblockTask(task.id)}>
                        Desbloquear
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onTaskDelete(task.id)} 
                      className="text-red-600"
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhuma tarefa encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}