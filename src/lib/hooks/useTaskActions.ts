import { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface UseTaskActionsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: Task | null;
}

export function useTaskActions({
  tasks,
  setTasks,
  setIsFormOpen,
  setSelectedTask,
  setIsEditing,
  setIsDeleteDialogOpen,
  selectedTask,
}: UseTaskActionsProps) {
  const { toast } = useToast();

  const handleCreateTask = async (data: Task) => {
    try {
      const response = await api.post<Task>('/tasks', data);
      const newTask = response.data;
      setTasks([...tasks, newTask]);
      setIsFormOpen(false);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (data: Task) => {
    try {
      const response = await api.put<Task>(`/tasks/${data.id}`, data);
      const updatedTask = response.data;
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
      setIsFormOpen(false);
      setSelectedTask(null);
      setIsEditing(false);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    try {
      await api.delete(`/tasks/${selectedTask.id}`);
      const updatedTasks = tasks.filter((task) => task.id !== selectedTask.id);
      setTasks(updatedTasks);
      setSelectedTask(null);
      if (setIsDeleteDialogOpen) {
        setIsDeleteDialogOpen(false);
      }
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  };
}