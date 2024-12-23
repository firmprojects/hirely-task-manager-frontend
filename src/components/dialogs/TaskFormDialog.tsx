import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";
import { Task } from "@/lib/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Task) => Promise<void>;
  onCancel: () => void;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: TaskFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: Task) => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error: any) {
      console.error('Failed to create task:', error);
      toast({
        title: "Error creating task",
        description: error.response?.data?.message || "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}