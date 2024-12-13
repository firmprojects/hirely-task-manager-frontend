import { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

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

  const handleCreateTask = (data: Task) => {
    const newTask = { ...data, id: crypto.randomUUID() };
    setTasks([...tasks, newTask]);
    setIsFormOpen(false);
    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    });
  };

  const handleUpdateTask = (data: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === data.id ? { ...data } : task
    );
    setTasks(updatedTasks);
    setIsFormOpen(false);
    setSelectedTask(null);
    setIsEditing(false);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;
    
    setTasks((prevTasks) => 
      prevTasks.filter((task) => task.id !== selectedTask.id)
    );
    setSelectedTask(null);
    setIsDeleteDialogOpen?.(false);
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully.",
    });
  };

  return {
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  };
}