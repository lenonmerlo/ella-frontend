import { apiFetch } from "../../lib/api";

// Se o backend retornar envelope { success, data, ... }, usamos; caso venha DTO puro,
// também funciona porque assumimos sucesso=true e data=res.
type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp?: string;
};

export type ConsentHistoryDTO = {
  contractVersion: string;
  acceptedAt: string;
  ip: string;
};

export type ConsentResponseDTO = {
  contractVersion: string;
  acceptedAt: string;
};

export type ConsentStatusDTO = {
  hasConsent: boolean;
  currentContractVersion: string;
};

function unwrap<T>(res: ApiEnvelope<T> | T): T {
  // DTO direto
  if (
    res &&
    (res as ApiEnvelope<T>).data === undefined &&
    (res as ApiEnvelope<T>).success === undefined
  ) {
    return res as T;
  }

  const env = res as ApiEnvelope<T>;
  if (env.success === false) {
    const msg = env.errors?.[0] ?? env.message ?? "Erro ao comunicar com o servidor";
    throw new Error(msg);
  }
  return (env.data as T) ?? (res as T);
}

export async function getConsentHistory(): Promise<ConsentHistoryDTO[]> {
  const res = await apiFetch<ApiEnvelope<ConsentHistoryDTO[]>>("/privacy/consents");
  return unwrap(res);
}

export async function getConsentStatus(): Promise<ConsentStatusDTO> {
  const res = await apiFetch<ApiEnvelope<ConsentStatusDTO>>("/privacy/status");
  return unwrap(res);
}

export async function registerConsent(contractVersion?: string): Promise<ConsentResponseDTO> {
  const res = await apiFetch<ApiEnvelope<ConsentResponseDTO>>("/privacy/consents", {
    method: "POST",
    json: { contractVersion: contractVersion ?? "" },
  });
  return unwrap(res);
}
