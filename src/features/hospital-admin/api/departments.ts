import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";

export type ApiDepartment = {
  id: string;
  name: string;
  headDoctorId: string | null;
  headDoctorName: string | null;
  doctorCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateDepartmentInput = {
  name: string;
  headDoctorId?: string | null;
};

export type UpdateDepartmentInput = Partial<CreateDepartmentInput> & {
  active?: boolean;
};

const key = ["departments"] as const;

export function useDepartments(
  filters: { search?: string; active?: boolean } = {},
) {
  return useQuery({
    queryKey: [...key, filters] as const,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.active !== undefined)
        params.set("active", String(filters.active));
      const { data } = await api.get<{ items: ApiDepartment[] }>(
        `/departments?${params}`,
      );
      return data.items;
    },
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDepartmentInput) => {
      const { data } = await api.post<ApiDepartment>("/departments", input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateDepartmentInput;
    }) => {
      const { data } = await api.patch<ApiDepartment>(
        `/departments/${id}`,
        input,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/departments/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
