// src/components/ui/input.tsx
import React from "react";
import { cn } from "@/lib/utils"; // assuming you have a utility for classNames

interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
}

export function Input({ className, type = "text", value, ...props }: InputProps) {
  // Ensure the value is never NaN, null, or undefined
  const safeValue =
    value === undefined || value === null || (typeof value === "number" && isNaN(value))
      ? ""
      : value;

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      value={safeValue}
      {...props}
    />
  );
}

export default Input;
