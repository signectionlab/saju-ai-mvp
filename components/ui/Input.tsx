import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? label.replace(/\s/g, "-");

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-[13px] font-semibold text-text-primary">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-[15px] text-text-primary placeholder:text-text-secondary/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs leading-relaxed text-text-secondary">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
