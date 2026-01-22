import { http } from "../../lib/http";

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

function unwrap<T>(payload: any): T {
  return (payload?.data ?? payload) as T;
}

export interface AuthRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  token: string;
  tokenType?: string;
  expiresIn?: number;
}

export async function login(req: AuthRequest): Promise<AuthResponse> {
  const res = await http.post<ApiResponse<AuthResponse>>("/auth/login", req);
  return unwrap<AuthResponse>(res.data);
}
export async function register(req: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  // Backend expects RequestParams: POST /api/auth/register?name=...&email=...&password=...
  await http.post("/auth/register", null, { params: req });
}

export async function me<TProfile = unknown>(): Promise<TProfile> {
  const res = await http.get<ApiResponse<TProfile>>("/auth/me");
  return unwrap<TProfile>(res.data);
}
export async function listInvoices<T = unknown>(): Promise<T> {
  const res = await http.get<ApiResponse<T>>("/invoices");
  return unwrap<T>(res.data);
}

export async function uploadInvoice(
  file: File,
  opts?: { password?: string; dueDate?: string },
): Promise<unknown> {
  const form = new FormData();
  form.append("file", file);
  if (opts?.password) form.append("password", opts.password);
  if (opts?.dueDate) form.append("dueDate", opts.dueDate);

  const res = await http.post<ApiResponse<unknown>>("/invoices/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res.data);
}

export async function getScore<T = unknown>(personId: string): Promise<T> {
  const res = await http.get<T>(`/scores/${personId}`);
  return unwrap(res.data);
}
export async function getBudget<T = unknown>(personId: string): Promise<T> {
  const res = await http.get<T>(`/budget/${personId}`);
  return unwrap(res.data);
}

export async function createGoal<T = unknown>(payload: unknown): Promise<T> {
  const res = await http.post<ApiResponse<T>>("/goals", payload);
  return unwrap<T>(res.data);
}
export async function listInvestments<T = unknown>(personId: string): Promise<T> {
  const res = await http.get<T>(`/investments/person/${personId}`);
  return unwrap(res.data);
}
