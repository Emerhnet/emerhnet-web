import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';

export type VerifyInvitationResult = {
  hospitalName: string;
  recipientEmail: string;
  recipientRole: string;
  expiresAt: string;
};

export function useVerifyInvitation(token: string | null) {
  return useQuery({
    queryKey: ['invitation', 'verify', token],
    queryFn: async () => {
      const { data } = await api.get<VerifyInvitationResult>(
        `/invitations/verify/${token}`,
      );
      return data;
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
  });
}
