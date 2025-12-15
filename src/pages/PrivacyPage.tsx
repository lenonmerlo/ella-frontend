import { PrivacyView } from "@/components/privacy/PrivacyView";
import { usePrivacyController } from "@/controllers/privacy/usePrivacyController";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();
  const { loading, history, hasConsent, error, accept } = usePrivacyController();

  useEffect(() => {
    if (hasConsent) {
      navigate("/dashboard", { replace: true });
    }
  }, [hasConsent, navigate]);

  async function onAccept() {
    const ok = await accept();
    if (ok) {
      navigate("/dashboard", { replace: true });
    }
  }

  return <PrivacyView loading={loading} error={error} history={history} onAccept={onAccept} />;
}
