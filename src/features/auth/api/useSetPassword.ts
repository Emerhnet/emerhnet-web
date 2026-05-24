import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { SetPasswordInput } from '../schemas/setPasswordSchema';

type SetPasswordPayload = SetPasswordInput & { token: string };

async function setPassword(payload: SetPasswordPayload): Promise<void> {
  await api.post('/auth/reset-password', {
    token: payload.token,
    newPassword: payload.newPassword,
  });
}

export function useSetPassword() {
  return useMutation({ mutationFn: setPassword });
}
