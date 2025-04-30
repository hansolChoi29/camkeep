import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;

  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [1000, "second"],
    [1000 * 60, "minute"],
    [1000 * 60 * 60, "hour"],
    [1000 * 60 * 60 * 24, "day"],
    [1000 * 60 * 60 * 24 * 7, "week"],
    [1000 * 60 * 60 * 24 * 30, "month"],
    [1000 * 60 * 60 * 24 * 365, "year"],
  ];

  for (let i = units.length - 1; i >= 0; i--) {
    const [ms, unit] = units[i];
    if (diff >= ms) {
      const val = Math.floor(diff / ms);
      return new Intl.RelativeTimeFormat("ko", { numeric: "auto" }).format(
        -val,
        unit
      );
    }
  }

  return "방금 전";
}
