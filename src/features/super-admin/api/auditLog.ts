import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";

export type ApiAuditEntry = {
  id: string;
  action: string;
  actorUserId: string | null;
  actorRole: string;
  actorName: string;
  actorEmail: string;
  hospitalId: string | null;
  hospitalName: string | null;
  entityType: string | null;
  entityId: string | null;
  before: unknown;
  after: unknown;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
};

export type AuditListFilters = {
  search?: string;
  actions?: string[];
  actorUserId?: string;
  hospitalId?: string;
  entityType?: string;
  from?: string;
  to?: string;
  ip?: string;
  page?: number;
  pageSize?: number;
};

type AuditListResponse = {
  items: ApiAuditEntry[];
  total: number;
  page: number;
  pageSize: number;
};

export function useAuditLog(filters: AuditListFilters = {}) {
  return useQuery({
    queryKey: ["audit-log", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.actions && filters.actions.length > 0)
        params.set("actions", filters.actions.join(","));
      if (filters.actorUserId) params.set("actorUserId", filters.actorUserId);
      if (filters.hospitalId) params.set("hospitalId", filters.hospitalId);
      if (filters.entityType) params.set("entityType", filters.entityType);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      if (filters.ip) params.set("ip", filters.ip);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
      const { data } = await api.get<AuditListResponse>(`/audit-log?${params}`);
      return data;
    },
  });
}

export function downloadCsv(path: string, filename: string): Promise<void> {
  return api.get<Blob>(path, { responseType: "blob" }).then(({ data }) => {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}
