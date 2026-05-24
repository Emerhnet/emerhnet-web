import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { ForgotPasswordInput } from '../schemas/forgotPasswordSchema';

async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  await api.post('/auth/forgot-password', input);
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}
