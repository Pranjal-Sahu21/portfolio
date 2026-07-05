import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const RESUME_LINK = "https://drive.google.com/file/d/1KoRaa5fomII4PT_rbtrF0-rI61lmYu5p/view?usp=drive_link";
