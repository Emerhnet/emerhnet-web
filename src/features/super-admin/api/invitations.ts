import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";

export type ApiInvitationStatus =
  | "sent"
  | "opened"
  | "submitted"
  | "approved"
  | "expired"
  | "cancelled";

export type ApiInvitation = {
  id: string;
  recipientEmail: string;
  hospitalName: string;
  recipientRole: string;
  internalNotes: string;
  verificationNotes: string;
  status: ApiInvitationStatus;
  expiresAt: string;
  sentByUserId: string;
  openedAt: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  cancelledAt: string | null;
  hospitalId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InvitationListFilters = {
  status?: ApiInvitationStatus;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

type InvitationListResponse = {
  items: ApiInvitation[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateInvitationInput = {
  hospitalName: string;
  recipientEmail: string;
  recipientRole?: string;
  internalNotes?: string;
  verificationNotes: string;
};

type MutateInvitationResponse = {
  invitation: ApiInvitation;
  emailSent: boolean;
};

export const invitationKeys = {
  all: ["invitations"] as const,
  lists: () => [...invitationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...invitationKeys.lists(), filters] as const,
};

export function useInvitations(filters: InvitationListFilters = {}) {
  return useQuery({
    queryKey: invitationKeys.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
      const { data } = await api.get<InvitationListResponse>(
        `/invitations?${params}`,
      );
      return data;
    },
  });
}

export function useSendInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateInvitationInput) => {
      const { data } = await api.post<MutateInvitationResponse>(
        "/invitations",
        input,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.lists() });
    },
  });
}

export function useReissueInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<MutateInvitationResponse>(
        `/invitations/${id}/reissue`,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.lists() });
    },
  });
}

export function useCancelInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiInvitation>(
        `/invitations/${id}/cancel`,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.lists() });
    },
  });
}
