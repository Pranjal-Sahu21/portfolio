import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const RESUME_LINK = "https://drive.google.com/file/d/12_BBA4B9U2zcu1qdhVMTOR7uCijyLSyO/view?usp=drive_link";
