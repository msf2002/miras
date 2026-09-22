"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-card bg-white p-6 shadow-xl animate-fade-in mx-4",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-lg font-bold text-brand-black">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-beige transition-colors"
            aria-label="بستن"
          >
            <X className="h-5 w-5 text-warm-gray" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
