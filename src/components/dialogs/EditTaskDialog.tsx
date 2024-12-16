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
  onClose: () => void;
  onRefresh: () => Promise<void>;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  onCancel,
  onClose,
  onRefresh,
}: EditTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!task) return null;

  const handleSubmit = async (formData: Task) => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      await onRefresh();
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      onClose();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      toast({
        title: "Error updating task",
        description: error.message || "Failed to update task. Please try again.",
        variant: "destructive",
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
          onRefresh={onRefresh}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
