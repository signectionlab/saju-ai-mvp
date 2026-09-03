import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-canvas hover:bg-brand-deep disabled:bg-border disabled:text-text-secondary shadow-[0_0_20px_rgba(154,136,104,0.12)]",
  secondary:
    "border border-brand/40 bg-surface text-text-primary hover:border-brand hover:bg-brand/5",
  tertiary: "bg-transparent text-text-secondary hover:bg-subtle hover:text-text-primary",
  destructive:
    "bg-danger text-white hover:opacity-90 disabled:opacity-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-[15px]",
  lg: "min-h-12 w-full px-6 text-base font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "처리 중..." : children}
    </button>
  ),
);

Button.displayName = "Button";
