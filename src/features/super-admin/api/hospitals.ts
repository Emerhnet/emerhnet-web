import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";
import { hospitalKeys } from "./queryKeys";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiHospitalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type ApiHospital = {
  id: string;
  trackingId: string;
  hospitalName: string;
  nin: string;
  ceaLicenceNumber: string;
  category: "Government" | "Private" | "Trust";
  cghsEmpanelment: boolean;
  ayushmanEmpanelment: boolean;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  contact: { email: string; phone: string };
  adminContact: { name: string; email: string; phone: string };
  documents: Array<{
    slotKey: string;
    fileName: string;
    sizeBytes: number;
    s3Key: string;
  }>;
  status: ApiHospitalStatus;
  reviewNotes: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  suspendedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HospitalListFilters = {
  status?: ApiHospitalStatus;
  category?: "Government" | "Private" | "Trust";
  state?: string;
  cghs?: boolean;
  ayushman?: boolean;
  from?: string;
  to?: string;
  search?: string;
  pageSize?: number;
};

type HospitalListResponse = {
  items: ApiHospital[];
  total: number;
  page: number;
  pageSize: number;
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useHospitals(filters: HospitalListFilters = {}) {
  return useQuery({
    queryKey: hospitalKeys.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.category) params.set("category", filters.category);
      if (filters.state) params.set("state", filters.state);
      if (filters.cghs) params.set("cghs", "true");
      if (filters.ayushman) params.set("ayushman", "true");
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      if (filters.search) params.set("search", filters.search);
      if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
      const { data } = await api.get<HospitalListResponse>(
        `/hospitals?${params}`,
      );
      return data;
    },
  });
}

export function useHospital(id: string) {
  return useQuery({
    queryKey: hospitalKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiHospital>(`/hospitals/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

export type ApproveHospitalResponse = {
  hospital: ApiHospital;
  admin: {
    email: string;
    tempPassword: string;
    mustChangePassword: boolean;
    emailSent: boolean;
  };
};

export function useApproveHospital() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { data } = await api.patch<ApproveHospitalResponse>(
        `/hospitals/${id}/approve`,
        { notes },
      );
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hospitalKeys.lists() });
      qc.invalidateQueries({ queryKey: hospitalKeys.detail(id) });
    },
  });
}

export function useRejectHospital() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { data } = await api.patch<ApiHospital>(`/hospitals/${id}/reject`, {
        notes,
      });
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hospitalKeys.lists() });
      qc.invalidateQueries({ queryKey: hospitalKeys.detail(id) });
    },
  });
}

export function useSuspendHospital() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { data } = await api.patch<ApiHospital>(
        `/hospitals/${id}/suspend`,
        { notes },
      );
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hospitalKeys.lists() });
      qc.invalidateQueries({ queryKey: hospitalKeys.detail(id) });
    },
  });
}

export function useHospitalDocumentUrl(
  hospitalId: string,
  slotKey: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [...hospitalKeys.detail(hospitalId), "doc-url", slotKey],
    queryFn: async () => {
      const { data } = await api.get<{ url: string }>(
        `/hospitals/${hospitalId}/documents/${slotKey}/url`,
      );
      return data.url;
    },
    enabled: Boolean(hospitalId) && Boolean(slotKey) && enabled,
    staleTime: 240_000, // 4 min — URL expires in 5 min
  });
}

export function useReactivateHospital() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<ApiHospital>(
        `/hospitals/${id}/reactivate`,
      );
      return data;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: hospitalKeys.lists() });
      qc.invalidateQueries({ queryKey: hospitalKeys.detail(id) });
    },
  });
}
