import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, User, Shield, ShieldAlert } from 'lucide-react';
import { Task } from '@/hooks/useTasks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onUnblock: () => void;
  isAdmin: boolean;
  isDragging?: boolean;
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

export function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onUnblock, 
  isAdmin, 
  isDragging = false 
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing ${
        task.is_blocked ? 'border-red-300 bg-red-50' : 'hover:shadow-md'
      } transition-shadow`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                Editar
              </DropdownMenuItem>
              {task.is_blocked && isAdmin && (
                <DropdownMenuItem onClick={onUnblock}>
                  Desbloquear
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge 
            variant="outline" 
            className={`text-xs ${priorityColors[task.priority]}`}
          >
            {priorityLabels[task.priority]}
          </Badge>
          
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

        <div className="space-y-2 text-xs text-muted-foreground">
          {task.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          )}

          {task.assigned_user && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{task.assigned_user.nome}</span>
            </div>
          )}

          {task.client && (
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>{task.client.nome}</span>
            </div>
          )}
        </div>

        {task.is_blocked && task.blocked_reason && (
          <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
            <strong>Motivo do bloqueio:</strong> {task.blocked_reason}
          </div>
        )}
      </CardContent>
    </Card>
  );
}