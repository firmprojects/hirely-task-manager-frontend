import { Button } from "@/components/ui/button";
import { LogOutIcon, PlusIcon, ListTodoIcon } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  onAddTask: () => void;
}

export function AppHeader({ onAddTask }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div className="flex items-center gap-2">
        <ListTodoIcon className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={onAddTask}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Task
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          <LogOutIcon className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}