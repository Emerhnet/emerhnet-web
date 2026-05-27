import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export type ApiBloodStock = {
  id: string;
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  criticalThreshold: number;
  lastUpdatedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBloodStockInput = {
  bloodGroup: BloodGroup;
  unitsAvailable?: number;
  criticalThreshold?: number;
};
export type UpdateBloodStockInput = {
  unitsAvailable?: number;
  criticalThreshold?: number;
};

const key = ["bloodbank"] as const;

export function useBloodBank() {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<{
        items: ApiBloodStock[];
        totals: { totalUnits: number; criticalCount: number; emptyCount: number };
      }>("/bloodbank");
      return data;
    },
  });
}

export function useCreateBloodStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBloodStockInput) => {
      const { data } = await api.post<ApiBloodStock>("/bloodbank", input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateBloodStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateBloodStockInput;
    }) => {
      const { data } = await api.patch<ApiBloodStock>(`/bloodbank/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteBloodStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/bloodbank/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
