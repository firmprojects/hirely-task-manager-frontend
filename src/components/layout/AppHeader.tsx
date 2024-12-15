import React from 'react';
import { Button } from '@/components/ui/button';
import { ListTodoIcon, LogOutIcon, PlusIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface AppHeaderProps {
  onAddTask: () => void;
}

export function AppHeader({ onAddTask }: AppHeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitials = user?.displayName ? getInitials(user.displayName) : '??';

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div className="flex items-center gap-2">
        <ListTodoIcon className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <p className="text-sm text-muted-foreground">Welcome, {user?.displayName}</p>
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
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}