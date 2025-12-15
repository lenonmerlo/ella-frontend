import { useEffect, useMemo, useState } from "react";
import { getConsentHistory, registerConsent, ConsentHistoryDTO } from "@/services/api/privacyService";

export function usePrivacyController() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ConsentHistoryDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasConsent = useMemo(() => history.length > 0, [history]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getConsentHistory();
      setHistory(data);
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

  return { loading, history, hasConsent, error, reload: load, accept };
}
