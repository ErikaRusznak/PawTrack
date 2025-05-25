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

export const removeDiacritics = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const formatDate = (date: Date) => {
  if (!date) return 'Invalid date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date: Date) => {
  if (!date) return 'Invalid date';
  const timeStr = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${timeStr}`;
}