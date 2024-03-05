import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeZoom = (zoom: number): number => {
  // Adjust the calculation as necessary to fit the desired size
  return Math.max(1 / zoom, 0.5); // Ensure it never goes below 0.5, for instance
};
