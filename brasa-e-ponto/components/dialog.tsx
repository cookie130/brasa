"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export function Dialog({
  open,
  onClose,
  title,
  children,
  drawer = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={drawer ? "dialog drawer" : "dialog product-dialog"}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="icon-button dialog-close"
        onClick={onClose}
        aria-label="Fechar janela"
      >
        <X size={21} />
      </button>
      {open && children}
    </dialog>
  );
}
export function Quantity({
  value,
  onChange,
  label = "Quantidade",
}: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  return (
    <div className="quantity" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Diminuir ${label.toLowerCase()}`}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= 99}
        aria-label={`Aumentar ${label.toLowerCase()}`}
      >
        +
      </button>
    </div>
  );
}
