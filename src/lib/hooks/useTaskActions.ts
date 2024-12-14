import { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface UseTaskActionsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: Task | null;
  userId: string; // Add userId to props
}

export function useTaskActions({
  tasks,
  setTasks,
  setIsFormOpen,
  setSelectedTask,
  setIsEditOpen,
  setIsDeleteDialogOpen,
  selectedTask,
  userId, // Add userId to destructured props
}: UseTaskActionsProps) {
  const { toast } = useToast();

  const handleCreateTask = async (data: Task) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate.toISOString(),
        status: data.status,
        userId: userId, // Add userId here
      };
      
      console.log('Creating task with userId:', userId); // Log userId
      const response = await api.post<Task>('api/tasks', taskData);
      const newTask = response.data;
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setIsFormOpen(false);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    } catch (error: any) {
      console.error('Failed to create task:', error);
      toast({
        title: "Error creating task",
        description: error.response?.data?.message || "Failed to create task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateTask = async (data: Task) => {
    try {
      if (!data.id) {
        throw new Error("Task ID is required for update");
      }

      const taskData = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate.toISOString(),
        status: data.status
      };
      
      const response = await api.put<Task>(`api/tasks/${data.id}`, taskData);
      const updatedTask = response.data;
      
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
      setIsEditOpen(false);
      setSelectedTask(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Failed to update task:', error);
      toast({
        title: "Error updating task",
        description: error.response?.data?.message || "Failed to update task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask?.id) return;
    
    try {
      await api.delete(`api/tasks/${selectedTask.id}`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== selectedTask.id));
      setSelectedTask(null);
      if (setIsDeleteDialogOpen) {
        setIsDeleteDialogOpen(false);
      }
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      toast({
        title: "Error deleting task",
        description: error.response?.data?.message || "Failed to delete task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  };
}