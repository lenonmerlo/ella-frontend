import type { ApiResponse, ReportListItem, ReportResponse, ReportType } from "../types/reports";
import { http } from "./http";

export async function generateReport(personId: string, type: ReportType, date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const res = await http.post<ApiResponse<ReportResponse>>(`/reports/${personId}/generate`, {
    type,
    year,
    month,
  });

  return res.data.data;
}

export async function listReports(personId: string, page = 0, size = 20) {
  const res = await http.get<ApiResponse<{ content: ReportListItem[] }>>(`/reports/${personId}`, {
    params: { page, size },
  });
  return res.data.data.content;
}

export async function getReport(personId: string, reportId: string) {
  const res = await http.get<ApiResponse<ReportResponse>>(`/reports/${personId}/${reportId}`);
  return res.data.data;
}

export async function downloadReportPdf(personId: string, reportId: string) {
  const res = await http.get(`/reports/${personId}/${reportId}/pdf`, {
    responseType: "blob",
  });

  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio-${reportId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
