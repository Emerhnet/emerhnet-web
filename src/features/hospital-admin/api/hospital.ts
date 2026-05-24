import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';

export type MyHospitalPhoto = {
  s3Key: string;
  fileName: string;
  sizeBytes: number;
  uploadedAt: string;
  url: string;
};

export type MyHospital = {
  id: string;
  trackingId: string;
  hospitalName: string;
  nin: string;
  ceaLicenceNumber: string;
  category: 'Government' | 'Private' | 'Trust';
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
  photos: MyHospitalPhoto[];
  visitingHours: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateMyHospitalInput = {
  contact?: Partial<{ email: string; phone: string }>;
  visitingHours?: string;
  description?: string;
  address?: Partial<{ line1: string; line2: string; city: string; pincode: string }>;
};

export type AddPhotoInput = {
  s3Key: string;
  fileName: string;
  sizeBytes: number;
};

const myHospitalKey = ['hospital', 'me'] as const;

export function useMyHospital() {
  return useQuery({
    queryKey: myHospitalKey,
    queryFn: async () => {
      const { data } = await api.get<MyHospital>('/hospitals/me');
      return data;
    },
  });
}

export function useUpdateMyHospital() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateMyHospitalInput) => {
      const { data } = await api.patch<MyHospital>('/hospitals/me', input);
      return data;
    },
    onSuccess: (data) => qc.setQueryData(myHospitalKey, data),
  });
}

export function useAddPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddPhotoInput) => {
      const { data } = await api.post<MyHospital>('/hospitals/me/photos', input);
      return data;
    },
    onSuccess: (data) => qc.setQueryData(myHospitalKey, data),
  });
}

export function useDeletePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s3Key: string) => {
      const { data } = await api.delete<MyHospital>(
        `/hospitals/me/photos?key=${encodeURIComponent(s3Key)}`,
      );
      return data;
    },
    onSuccess: (data) => qc.setQueryData(myHospitalKey, data),
  });
}
