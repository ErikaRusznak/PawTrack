import { Task } from "@/src/Task";

export const formatTaskTime = (task: Task) => {
  if (!task.taskDate) return '';
  const date =
    task.taskDate && typeof (task.taskDate as any).toDate === 'function'
      ? (task.taskDate as any).toDate()
      : new Date(task.taskDate);

  if (isNaN(date.getTime())) return 'Invalid Date';

  const timeStr = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${timeStr}`;
}

export const formatTaskDate = (task: Task) => {
  if (!task.taskDate) return '';
  const date =
    typeof (task.taskDate as any).toDate === 'function'
      ? (task.taskDate as any).toDate()
      : new Date(task.taskDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};