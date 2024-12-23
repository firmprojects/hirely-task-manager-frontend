import { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import { useAuthStore } from "@/stores/authStore";

interface UseTaskActionsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: Task | null;
}

export function useTaskActions({
  tasks,
  setTasks,
  setIsFormOpen,
  setSelectedTask,
  setIsEditOpen,
  setIsDeleteDialogOpen,
  selectedTask,
}: UseTaskActionsProps) {
  const { toast } = useToast();
  const { fetchWithAuth } = useApi();
  const user = useAuthStore((state) => state.user);

  const handleCreateTask = async (data: Task) => {
    try {
      console.log('Creating task with data:', data);
      if (data.dueDate && !(typeof data.dueDate === 'string')) {
        throw new Error('Due date must be a string in YYYY-MM-DD format');
      }

      const taskData = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: data.status,
        userId: user?.uid
      };
      
      const newTask = await fetchWithAuth('/api/tasks', {
        method: 'POST',
        data: taskData,
      });
      
      console.log('New task response:', newTask);
      setTasks(prevTasks => [...prevTasks, newTask.task]);
      setIsFormOpen(false);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    } catch (error: any) {
      console.error('Failed to create task:', error);
      toast({
        title: "Error creating task",
        description: error.message || "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (data: Task) => {
    try {
      if (!selectedTask) return;

      if (data.dueDate && !(typeof data.dueDate === 'string')) {
        throw new Error('Due date must be a string in YYYY-MM-DD format');
      }

      const taskData = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: data.status
      };

      console.log('Updating task with data:', {
        taskId: selectedTask.id,
        taskData
      });

      const updatedTask = await fetchWithAuth(`/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        data: taskData,
      });

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === selectedTask.id ? updatedTask.task : task
        )
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
        description: error.message || "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async () => {
    try {
      if (!selectedTask) return;

      await fetchWithAuth(`/api/tasks/${selectedTask.id}`, {
        method: 'DELETE',
      });

      setTasks(prevTasks =>
        prevTasks.filter(task => task.id !== selectedTask.id)
      );
      
      if (setIsDeleteDialogOpen) {
        setIsDeleteDialogOpen(false);
      }
      setSelectedTask(null);
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      toast({
        title: "Error deleting task",
        description: error.message || "Failed to delete task. Please try again.",
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