import { http } from "../../lib/http";
import type {
  AssetRequest,
  AssetResponse,
  AssetTotalValueResponse,
} from "../../types/asset";

function unwrap<T>(data: any): T {
  return (data?.data ?? data) as T;
}

export async function fetchAssets(personId: string): Promise<AssetResponse[]> {
  const res = await http.get<any>(`/assets/person/${personId}`);
  return unwrap<AssetResponse[]>(res.data);
}

export async function createAsset(personId: string, payload: AssetRequest): Promise<AssetResponse> {
  const res = await http.post<any>(`/assets`, payload, { params: { personId } });
  return unwrap<AssetResponse>(res.data);
}

export async function updateAsset(assetId: string, payload: AssetRequest): Promise<AssetResponse> {
  const res = await http.put<any>(`/assets/${assetId}`, payload);
  return unwrap<AssetResponse>(res.data);
}

export async function deleteAsset(assetId: string): Promise<void> {
  await http.delete(`/assets/${assetId}`);
}

export async function fetchTotalAssetsValue(personId: string): Promise<AssetTotalValueResponse> {
  const res = await http.get<any>(`/assets/total-value`, { params: { personId } });
  return unwrap<AssetTotalValueResponse>(res.data);
}
