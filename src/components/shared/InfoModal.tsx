import { Info } from "lucide-react";
import { useId } from "react";

interface Props {
  open: boolean;
  title?: string;
  message: string;
  closeText?: string;
  onClose: () => void;
}

export function InfoModal({
  open,
  title = "Aviso",
  message,
  closeText = "Entendi",
  onClose,
}: Props) {
  const titleId = useId();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-ella-card w-full max-w-md rounded-2xl p-6 shadow-xl"
      >
        <div className="mb-3 flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <Info className="text-blue-600" size={20} />
          </div>
          <div className="flex-1">
            <h4 id={titleId} className="text-ella-navy text-lg font-semibold">
              {title}
            </h4>
            <p className="text-ella-subtile mt-1 text-sm whitespace-pre-line">{message}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            className="bg-ella-brand hover:bg-ella-brand/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
            onClick={onClose}
          >
            {closeText}
          </button>
        </div>
      </div>

      <button type="button" aria-label="Fechar" className="sr-only" onClick={onClose} />
    </div>
  );
}
