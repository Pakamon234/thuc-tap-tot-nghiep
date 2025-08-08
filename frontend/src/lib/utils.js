import { clsx } from "clsx";  // Loại bỏ 'type ClassValue'
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {  // Loại bỏ kiểu TypeScript cho 'inputs'
  return twMerge(clsx(inputs));
}
