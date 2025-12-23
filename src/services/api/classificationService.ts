import { http } from "../../lib/http";

export interface ClassificationSuggestRequest {
  description: string;
  amount: number;
  type?: string;
}

export interface ClassificationSuggestResponse {
  category: string;
  type: string;
  confidence: number;
  reason: string;
}

export async function suggestClassification(payload: ClassificationSuggestRequest) {
  const res = await http.post<{ data: ClassificationSuggestResponse }>("/classification/suggest", {
    ...payload,
    amount: Number(payload.amount ?? 0),
  });
  return res.data.data;
}

export interface ClassificationFeedbackRequest {
  transactionId: string;
  suggestedCategory?: string;
  chosenCategory: string;
  confidence: number;
}

export async function sendClassificationFeedback(payload: ClassificationFeedbackRequest) {
  await http.post("/classification/feedback", payload);
}
