import React, { useState } from 'react';
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Kanban, List, Calendar as CalendarIcon } from "lucide-react";
import { TaskKanban } from "@/components/Tasks/TaskKanban";
import { TaskList } from "@/components/Tasks/TaskList";
import { TaskCalendar } from "@/components/Tasks/TaskCalendar";
import { TaskForm } from "@/components/Tasks/TaskForm";
import { useTasks, Task } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function Tarefas() {
  const { tasks, loading, createTask, updateTask, deleteTask, unblockTask } = useTasks();
  const { isAdmin } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('kanban');

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask(taskData);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleUnblockTask = async (taskId: string) => {
    try {
      await unblockTask(taskId);
    } catch (error) {
      console.error('Error unblocking task:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando tarefas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tarefas</h1>
            <p className="text-muted-foreground">Gerenciamento completo de tarefas e atividades</p>
          </div>
          <Button 
            onClick={() => {
              console.log('Opening task form...');
              setEditingTask(null);
              setShowTaskForm(true);
              console.log('showTaskForm set to:', true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Kanban className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Lista
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendário
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            <TaskKanban
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
              onUnblockTask={handleUnblockTask}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <TaskList
              tasks={tasks}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
              onUnblockTask={handleUnblockTask}
              onTaskUpdate={handleTaskUpdate}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <TaskCalendar
              tasks={tasks}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
              onUnblockTask={handleUnblockTask}
              isAdmin={isAdmin}
            />
          </TabsContent>
        </Tabs>

        <TaskForm
          task={editingTask}
          open={showTaskForm}
          onOpenChange={setShowTaskForm}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        />
      </div>
    </Layout>
  );
}