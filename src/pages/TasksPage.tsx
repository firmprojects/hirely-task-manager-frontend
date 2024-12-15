import { useState, useEffect, useCallback } from "react";
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
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { ListX } from 'lucide-react';
import { Search } from 'lucide-react';
import { useAuthStore } from "@/stores/authStore";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { fetchWithAuth } = useApi();
  const { user } = useAuthStore();

  const loadTasks = useCallback(async () => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Current user:', user.email);
      console.log('Attempting to fetch tasks...');
      const fetchedTasks = await fetchWithAuth('/tasks');
      console.log('Tasks fetched successfully:', fetchedTasks);
      setTasks(fetchedTasks);
    } catch (error: any) {
      console.error('Failed to fetch tasks:', error);
      setError(error.message || 'Failed to fetch tasks. Please try again.');
      toast({
        title: "Error fetching tasks",
        description: error.message || "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, fetchWithAuth, navigate, toast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const { searchQuery, setSearchQuery, filteredTasks } = useTaskSearch(tasks);
  
  const { handleCreateTask, handleUpdateTask, handleDeleteTask } = useTaskActions({
    tasks,
    setTasks,
    setIsFormOpen,
    setSelectedTask,
    setIsEditOpen,
    setIsDeleteDialogOpen,
    selectedTask,
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

  if (!user) {
    return null; // or a loading spinner
  }

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

      <div className="rounded-md border">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Loading tasks...</h3>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-destructive">Failed to fetch tasks</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <ListX className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No tasks yet</h3>
            <p className="text-muted-foreground">Create your first task to get started!</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
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
      </div>

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateTask}
        onCancel={handleFormCancel}
      />

      {selectedTask && (
        <>
          <EditTaskDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            task={selectedTask}
            onSubmit={handleUpdateTask}
            onCancel={handleEditCancel}
          />

          <TaskDetailsDialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            task={selectedTask}
          />

          <DeleteTaskDialog
            task={selectedTask}
            open={isDeleteDialogOpen}
            onConfirm={handleDeleteTask}
            onCancel={() => setIsDeleteDialogOpen(false)}
          />
        </>
      )}
    </MainLayout>
  );
}