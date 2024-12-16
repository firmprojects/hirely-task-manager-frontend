import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditTaskForm } from "@/components/EditTaskForm";
import { Task } from "@/lib/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSubmit: (data: Task) => Promise<void>;
  onCancel: () => void;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  onCancel,
}: EditTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!task) return null;

  const handleSubmit = async (formData: Task) => {
    if (!task.id) {
      toast({
        title: "Error updating task",
        description: "Task ID is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        id: task.id
      });
      toast({
        title: 'Task updated successfully',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: 'Error updating task',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <EditTaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          onClose={handleClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
