import { Task } from "@/lib/types";
import { format } from "date-fns";
import { Edit2Icon, Trash2Icon, EyeIcon, CalendarIcon, CheckCircleIcon, ClockIcon, CircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return {
        color: 'bg-green-100 text-green-800 hover:bg-green-200',
        icon: CheckCircleIcon,
        label: 'Completed'
      };
    case 'IN_PROGRESS':
      return {
        color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        icon: ClockIcon,
        label: 'In Progress'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        icon: CircleIcon,
        label: 'To Do'
      };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function TaskList({ tasks, onEdit, onDelete, onView }: TaskListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => {
        const statusConfig = getStatusConfig(task.status);
        const StatusIcon = statusConfig.icon;
        const statusColor = getStatusColor(task.status);

        return (
          <Card key={task.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg line-clamp-1 flex-1 mr-4">{task.title}</h3>
                {/* <Badge className={statusColor}>
                  {statusConfig.label}
                </Badge> */}
              </div>
              <p className="text-muted-foreground line-clamp-2 mb-4 min-h-[3rem]">
                {task.description}
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>
                  {task.dueDate instanceof Date && !isNaN(task.dueDate.getTime())
                    ? format(task.dueDate, 'PPP')
                    : 'No due date'}
                </span>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className={cn(
                  "h-4 w-4",
                  task.status === 'COMPLETED' && "text-green-600",
                  task.status === 'IN_PROGRESS' && "text-blue-600",
                  task.status === 'PENDING' && "text-gray-600"
                )} />
                <span className="text-sm font-medium text-muted-foreground">
                  {statusConfig.label}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onView(task)}>
                  <EyeIcon className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                  <Edit2Icon className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(task)}>
                  <Trash2Icon className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}