// src/components/dashboard/DashboardHeader.tsx
import { LogOut, Sparkles, Upload } from "lucide-react";
import { Logo } from "../Logo";

interface Props {
  userName: string;
  userEmail: string | null;
  onLogout: () => void;
  showInlineUpload?: boolean;
  onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DashboardHeader({
  userName,
  userEmail,
  onLogout,
  showInlineUpload = false,
  onFileUpload,
}: Props) {
  const firstLetter = userName?.charAt(0).toUpperCase() || "U";

  return (
    <header className="border-ella-muted border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "#0E1A2B" }}
          >
            <Sparkles size={24} style={{ color: "#C9A43B" }} />
          </div>
          <Logo variant="horizontal" size="small" />
        </div>

        <div className="flex items-center gap-4">
          {showInlineUpload && onFileUpload && (
            <label className="cursor-pointer">
              <input type="file" accept=".pdf,.csv" onChange={onFileUpload} className="hidden" />
              <div className="border-ella-gold text-ella-gold hover:bg-ella-gold flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:text-white">
                <Upload size={18} />
                <span>Novo upload</span>
              </div>
            </label>
          )}

          <div className="bg-ella-background flex items-center gap-3 rounded-lg px-4 py-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: "#C9A43B" }}
            >
              {firstLetter}
            </div>
            <div className="text-sm">
              <p className="text-ella-navy font-medium">{userName}</p>
              {userEmail && <p className="text-ella-subtile text-xs">{userEmail}</p>}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="hover:bg-ella-background rounded-lg p-2 transition-colors"
            title="Sair"
          >
            <LogOut size={20} className="text-ella-subtile" />
          </button>
        </div>
      </div>
    </header>
  );
}
