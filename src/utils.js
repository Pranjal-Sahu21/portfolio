import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const RESUME_LINK = "https://drive.google.com/file/d/1IFK8P5Ji5bmCZbeAhJolV4xVcKTf9t4m/view?usp=drive_link";
