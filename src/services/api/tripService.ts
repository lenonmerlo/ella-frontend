import { http } from "../../lib/http";

export async function applyTrip(tripId: string, transactionIds: string[]) {
  const payload = {
    tripId,
    transactionIds,
  };

  const res = await http.post<any>("/trips/apply", payload);
  return res.data?.data ?? res.data;
}
