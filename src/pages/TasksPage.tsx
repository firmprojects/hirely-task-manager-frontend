import { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { TaskList } from "@/components/TaskList";
import { SearchBar } from "@/components/SearchBar";
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog";
import { TaskFormDialog } from "@/components/dialogs/TaskFormDialog";
import { EditTaskDialog } from "@/components/dialogs/EditTaskDialog";
import { TaskDetailsDialog } from "@/components/dialogs/TaskDetailsDialog";
import { AppHeader } from "@/components/layout/AppHeader";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTaskActions } from "@/lib/hooks/useTaskActions";
import { useTaskSearch } from "@/lib/hooks/useTaskSearch";
import { ListXIcon } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      // Redirect to login if no user ID
      navigate('/login');
      return;
    }
    
    const fetchTasks = async () => {
      try {
        const response = await api.get<Task[]>('api/tasks');
        setTasks(response.data);
      } catch (error: any) {
        console.error('Failed to fetch tasks:', error);
        toast({
          title: "Error fetching tasks",
          description: error.response?.data?.message || "Failed to fetch tasks. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchTasks();
  }, [userId, toast]);
  
  const { searchQuery, setSearchQuery, filteredTasks } = useTaskSearch(tasks);
  
  const { handleCreateTask, handleUpdateTask, handleDeleteTask } = useTaskActions({
    tasks,
    setTasks,
    setIsFormOpen,
    setSelectedTask,
    setIsEditOpen,
    setIsDeleteDialogOpen,
    selectedTask,
    userId: userId as string,
  });

  const openEditForm = (task: Task) => {
    setSelectedTask(task);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const handleEditCancel = () => {
    setIsEditOpen(false);
    setSelectedTask(null);
  };

  return (
    <MainLayout>
      <AppHeader onAddTask={() => setIsFormOpen(true)} />

      <div className="mb-6 max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tasks by title or description..."
        />
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <ListXIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No tasks yet</h3>
          <p className="text-muted-foreground">Create your first task to get started!</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-1">No matching tasks</h3>
          <p className="text-muted-foreground">Try adjusting your search query</p>
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onView={viewTaskDetails}
        />
      )}

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateTask}
        onCancel={handleFormCancel}
      />

      {selectedTask && (
        <EditTaskDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          task={selectedTask}
          onSubmit={handleUpdateTask}
          onCancel={handleEditCancel}
        />
      )}

      <TaskDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        task={selectedTask}
      />

      {selectedTask && (
        <DeleteTaskDialog
          task={selectedTask}
          open={isDeleteDialogOpen}
          onConfirm={handleDeleteTask}
          onCancel={() => {
            setIsDeleteDialogOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </MainLayout>
  );
}