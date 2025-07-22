import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from './TaskCard';
import { DroppableColumn } from './DroppableColumn';
import { Task } from '@/hooks/useTasks';

interface TaskKanbanProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onUnblockTask: (taskId: string) => void;
  isAdmin: boolean;
}

const statusConfig = {
  todo: { title: 'A Fazer', color: 'bg-slate-100' },
  in_progress: { title: 'Em Progresso', color: 'bg-blue-100' },
  completed: { title: 'Concluído', color: 'bg-green-100' },
  cancelled: { title: 'Cancelado', color: 'bg-red-100' },
};

export function TaskKanban({ 
  tasks, 
  onTaskUpdate, 
  onTaskEdit, 
  onTaskDelete, 
  onUnblockTask,
  isAdmin 
}: TaskKanbanProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];
    
    if (newStatus !== activeTask?.status) {
      onTaskUpdate(taskId, { status: newStatus });
    }
    
    setActiveTask(null);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const statusTasks = getTasksByStatus(status as Task['status']);
          
          return (
            <DroppableColumn key={status} id={status}>
              <Card className={`${config.color} min-h-[500px]`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {config.title}
                    <Badge variant="secondary">{statusTasks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    items={statusTasks.map(task => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {statusTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={() => onTaskEdit(task)}
                          onDelete={() => onTaskDelete(task.id)}
                          onUnblock={() => onUnblockTask(task.id)}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            </DroppableColumn>
          );
        })}
      </div>
      
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={() => {}}
            onDelete={() => {}}
            onUnblock={() => {}}
            isAdmin={isAdmin}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}