import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-brand-black"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-card border border-warm-gray/30 bg-white px-4 py-2.5 text-brand-black placeholder:text-warm-gray/60 transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30 resize-y min-h-[100px]",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
