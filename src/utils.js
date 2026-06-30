import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const RESUME_LINK = "https://drive.google.com/file/d/130Gftarztl3oH0aNBQeSbpm1UHMA4jgo/view?usp=drive_link";
