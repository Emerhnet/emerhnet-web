import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';

export type ApiBed = {
  id: string;
  type: string;
  total: number;
  occupied: number;
  lastUpdatedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBedInput = { type: string; total: number; occupied?: number };
export type UpdateBedInput = Partial<CreateBedInput>;

const key = ['beds'] as const;

export function useBeds() {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<{
        items: ApiBed[];
        totals: { total: number; occupied: number };
      }>('/beds');
      return data;
    },
  });
}

export function useCreateBed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBedInput) => {
      const { data } = await api.post<ApiBed>('/beds', input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateBed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateBedInput }) => {
      const { data } = await api.patch<ApiBed>(`/beds/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteBed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/beds/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
