import { Task } from "@/lib/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskDetailsProps {
  task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Description</h3>
          <p className="mt-1">{task.description}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Due Date</h3>
          <p className="mt-1">{format(task.dueDate, 'PPP')}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
          <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold
            ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
              task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
              'bg-gray-100 text-gray-800'}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}