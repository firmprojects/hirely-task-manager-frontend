import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task, taskSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface EditTaskFormProps {
  task: Task;
  onSubmit: (data: Task) => Promise<void>;
  onCancel: () => void;
  onClose: () => void;
  onRefresh: () => void;
  isSubmitting: boolean;
}

export function EditTaskForm({
  task,
  onSubmit,
  onCancel,
  onClose,
  onRefresh,
  isSubmitting,
}: EditTaskFormProps) {
  const { toast } = useToast();
  const form = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
    },
  });

  const [status, setStatus] = useState('idle'); // Status state

  const handleUpdateTask = async (data: Task) => {
    setStatus('loading'); // Set status to loading
    try {
      await onSubmit(data);
      await onRefresh();
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      setStatus('success'); // Set status to success
      form.reset();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setStatus('error'); // Set status to error
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Failed to update task:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle'); // Reset status after 3 seconds
      }, 3000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [status]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateTask)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter task description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), 'MMMM d, yyyy')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (!date) {
                        field.onChange(null);
                        return;
                      }
                      const formattedDate = format(date, 'yyyy-MM-dd');
                      field.onChange(formattedDate);
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Task
          </Button>
        </div>
      </form>
    </Form>
  );
}
