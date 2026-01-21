import { http } from "../../lib/http";
import type { Score } from "../../types/score";

function unwrap<T>(data: any): T {
  return (data?.data ?? data) as T;
}

export async function getScore(personId: string): Promise<Score> {
  if (!personId) throw new Error("PersonId inválido");

  try {
    // O backend expõe GET /api/scores/{personId}. Como o baseURL do http normalmente já aponta para /api,
    // aqui usamos apenas "/scores/{personId}" para manter consistência com os outros services.
    const res = await http.get<any>(`/scores/${personId}`);
    return unwrap<Score>(res.data);
  } catch (error) {
    console.error("Erro ao buscar score:", error);
    throw error;
  }
}
