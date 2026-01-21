import { AlertTriangle } from "lucide-react";
import { useId } from "react";

interface Props {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title = "Confirmar ação",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();

  if (!open) return null;

  const confirmClassName =
    confirmVariant === "primary"
      ? "bg-ella-navy hover:bg-ella-navy/90"
      : "bg-red-600 hover:bg-red-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-3 flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="text-red-600" size={20} />
          </div>
          <div className="flex-1">
            <h4 id={titleId} className="text-ella-navy text-lg font-semibold">
              {title}
            </h4>
            <p className="text-ella-subtile mt-1 text-sm">{message}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            className="text-ella-subtile rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium disabled:opacity-60"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            className={`${confirmClassName} rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60`}
            onClick={onConfirm}
          >
            {loading ? "Aguarde..." : confirmText}
          </button>
        </div>
      </div>

      <button type="button" aria-label="Fechar" className="sr-only" onClick={onCancel} />
    </div>
  );
}
