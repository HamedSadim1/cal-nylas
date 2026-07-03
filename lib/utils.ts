import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Safely extract a string value from FormData, throwing if missing or not a string. */
export function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string") {
    throw new Error(`Form field "${key}" is required`);
  }
  return value;
}
