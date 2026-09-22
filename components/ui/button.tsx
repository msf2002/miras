import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-brand-green text-white hover:bg-brand-green/90 focus:ring-brand-green/30",
      secondary:
        "bg-gold text-brand-black hover:bg-gold/90 focus:ring-gold/30",
      outline:
        "border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white focus:ring-brand-green/30",
      ghost:
        "text-warm-gray hover:bg-beige hover:text-brand-black focus:ring-warm-gray/30",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/30",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-card font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
