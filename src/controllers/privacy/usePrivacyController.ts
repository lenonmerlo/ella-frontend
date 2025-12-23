import {
  ConsentHistoryDTO,
  ConsentStatusDTO,
  getConsentHistory,
  getConsentStatus,
  registerConsent,
} from "@/services/api/privacyService";
import { useEffect, useMemo, useState } from "react";

export function usePrivacyController() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ConsentHistoryDTO[]>([]);
  const [status, setStatus] = useState<ConsentStatusDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasConsent = useMemo(() => status?.hasConsent ?? history.length > 0, [status, history]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const statusRes = await getConsentStatus();
      setStatus(statusRes);

      // Só busca histórico se já houve consentimento
      if (statusRes.hasConsent) {
        const data = await getConsentHistory();
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar consentimento");
    } finally {
      setLoading(false);
    }
  }

  async function accept(contractVersion?: string) {
    setError(null);
    try {
      await registerConsent(contractVersion);
      await load();
      return true;
    } catch (e: any) {
      setError(e?.message ?? "Falha ao registrar consentimento");
      return false;
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { loading, history, status, hasConsent, error, reload: load, accept };
}
