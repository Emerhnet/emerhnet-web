import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';

export type AmbulanceType = 'BLS' | 'ALS' | 'ICU' | 'Neonatal' | 'Patient Transport';
export type AmbulanceStatus = 'Available' | 'On Duty' | 'Under Maintenance' | 'Out of Service';

export type ApiAmbulance = {
  id: string;
  vehicleNumber: string;
  type: AmbulanceType;
  driverName: string;
  driverPhone: string;
  equipment: string[];
  status: AmbulanceStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateAmbulanceInput = {
  vehicleNumber: string;
  type: AmbulanceType;
  driverName: string;
  driverPhone: string;
  equipment?: string[];
  status?: AmbulanceStatus;
};

export type UpdateAmbulanceInput = Partial<CreateAmbulanceInput>;

const key = ['ambulances'] as const;

export function useAmbulances(filters: { search?: string; type?: string; status?: string } = {}) {
  return useQuery({
    queryKey: [...key, filters] as const,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      const { data } = await api.get<{ items: ApiAmbulance[]; total: number }>(
        `/ambulances?${params}`,
      );
      return data;
    },
  });
}

export function useCreateAmbulance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAmbulanceInput) => {
      const { data } = await api.post<ApiAmbulance>('/ambulances', input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateAmbulance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateAmbulanceInput }) => {
      const { data } = await api.patch<ApiAmbulance>(`/ambulances/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteAmbulance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ambulances/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
