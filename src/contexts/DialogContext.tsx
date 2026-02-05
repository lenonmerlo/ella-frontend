import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type DialogVariant = "default" | "danger";

type DialogBaseOptions = {
  title?: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
};

type ConfirmDialogOptions = DialogBaseOptions;
type AlertDialogOptions = Omit<DialogBaseOptions, "cancelText">;

type ConfirmDialogState = {
  type: "confirm";
  title: string;
  message: ReactNode;
  confirmText: string;
  cancelText: string;
  variant: DialogVariant;
  resolve: (value: boolean) => void;
};

type AlertDialogState = {
  type: "alert";
  title: string;
  message: ReactNode;
  confirmText: string;
  variant: DialogVariant;
  resolve: () => void;
};

type DialogState = ConfirmDialogState | AlertDialogState;

type DialogContextValue = {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  alert: (options: AlertDialogOptions) => Promise<void>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setDialog(null), []);

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        type: "confirm",
        title: options.title ?? "Confirmar",
        message: options.message,
        confirmText: options.confirmText ?? "OK",
        cancelText: options.cancelText ?? "Cancelar",
        variant: options.variant ?? "default",
        resolve,
      });
    });
  }, []);

  const alert = useCallback((options: AlertDialogOptions) => {
    return new Promise<void>((resolve) => {
      setDialog({
        type: "alert",
        title: options.title ?? "Aviso",
        message: options.message,
        confirmText: options.confirmText ?? "OK",
        variant: options.variant ?? "default",
        resolve,
      });
    });
  }, []);

  const onCancel = useCallback(() => {
    if (!dialog) return;
    if (dialog.type === "confirm") {
      dialog.resolve(false);
    } else {
      dialog.resolve();
    }
    close();
  }, [close, dialog]);

  const onConfirm = useCallback(() => {
    if (!dialog) return;
    if (dialog.type === "confirm") {
      dialog.resolve(true);
    } else {
      dialog.resolve();
    }
    close();
  }, [close, dialog]);

  useEffect(() => {
    if (!dialog) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialog, onCancel]);

  useEffect(() => {
    if (!dialog) return;

    // For destructive actions, default focus is Cancel.
    if (dialog.type === "confirm") {
      cancelButtonRef.current?.focus();
      return;
    }

    confirmButtonRef.current?.focus();
  }, [dialog]);

  const value = useMemo<DialogContextValue>(() => ({ confirm, alert }), [alert, confirm]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialog ? (
        <DialogModal
          dialog={dialog}
          onCancel={onCancel}
          onConfirm={onConfirm}
          cancelButtonRef={cancelButtonRef}
          confirmButtonRef={confirmButtonRef}
        />
      ) : null}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (ctx) return ctx;

  // Fallback for safety (e.g. provider missing in story/tests)
  return {
    confirm: async (options: ConfirmDialogOptions) =>
      window.confirm(
        [options.title, typeof options.message === "string" ? options.message : ""]
          .filter(Boolean)
          .join("\n\n"),
      ),
    alert: async (options: AlertDialogOptions) => {
      window.alert(
        [options.title, typeof options.message === "string" ? options.message : ""]
          .filter(Boolean)
          .join("\n\n"),
      );
    },
  } satisfies DialogContextValue;
}

function DialogModal({
  dialog,
  onCancel,
  onConfirm,
  cancelButtonRef,
  confirmButtonRef,
}: {
  dialog: DialogState;
  onCancel: () => void;
  onConfirm: () => void;
  cancelButtonRef: React.RefObject<HTMLButtonElement | null>;
  confirmButtonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const confirmIsDanger = dialog.variant === "danger";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={dialog.title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/90 p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">{dialog.title}</h3>
            <div className="mt-2 text-sm text-white/80">{dialog.message}</div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-2 py-1 text-sm text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          {dialog.type === "confirm" ? (
            <button
              type="button"
              ref={cancelButtonRef}
              onClick={onCancel}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              {dialog.cancelText}
            </button>
          ) : null}

          <button
            type="button"
            ref={confirmButtonRef}
            onClick={onConfirm}
            className={
              confirmIsDanger
                ? "rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                : "bg-ella-brand hover:bg-ella-brand/90 rounded-xl px-4 py-2 text-sm font-semibold text-white"
            }
          >
            {dialog.confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
