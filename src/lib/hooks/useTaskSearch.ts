import { useState, useMemo } from "react";
import { Task } from "@/lib/types";

export function useTaskSearch(tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredTasks,
  };
}