import { formatDistanceToNow, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const IST = 'Asia/Kolkata';

export function formatIst(date: Date | string, fmt = 'dd MMM yyyy, HH:mm'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${format(toZonedTime(d, IST), fmt)} IST`;
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}
