import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";

export type ApiDoctor = {
  id: string;
  hospitalId: string;
  fullName: string;
  councilReg: string;
  council: string;
  departmentId: string;
  specialisation: string;
  qualifications: string[];
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  dob: string | null;
  joinedAt: string;
  deactivatedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DoctorListFilters = {
  search?: string;
  departmentId?: string;
  status?: "active" | "deactivated";
  page?: number;
  pageSize?: number;
};

type DoctorListResponse = {
  items: ApiDoctor[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateDoctorInput = {
  fullName: string;
  councilReg: string;
  council: string;
  departmentId: string;
  specialisation?: string;
  qualifications?: string[];
  email: string;
  phone: string;
  gender: ApiDoctor["gender"];
  dob?: string;
  joinedAt: string;
};

export type UpdateDoctorInput = Partial<CreateDoctorInput>;

const key = ["doctors"] as const;

export function useDoctors(filters: DoctorListFilters = {}) {
  return useQuery({
    queryKey: [...key, filters] as const,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.departmentId)
        params.set("departmentId", filters.departmentId);
      if (filters.status) params.set("status", filters.status);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
      const { data } = await api.get<DoctorListResponse>(`/doctors?${params}`);
      return data;
    },
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: [...key, "detail", id] as const,
    queryFn: async () => {
      const { data } = await api.get<ApiDoctor>(`/doctors/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDoctorInput) => {
      const { data } = await api.post<ApiDoctor>("/doctors", input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateDoctorInput;
    }) => {
      const { data } = await api.patch<ApiDoctor>(`/doctors/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDeactivateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiDoctor>(`/doctors/${id}/deactivate`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useReactivateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiDoctor>(`/doctors/${id}/reactivate`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
