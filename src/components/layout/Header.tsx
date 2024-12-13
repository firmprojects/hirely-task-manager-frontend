import { Button } from "@/components/ui/button";
import { PlusIcon, ListTodoIcon } from "lucide-react";

interface HeaderProps {
  onAddTask: () => void;
}

export function Header({ onAddTask }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-2">
        <ListTodoIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Task Manager</h1>
      </div>
      <Button onClick={onAddTask}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
}