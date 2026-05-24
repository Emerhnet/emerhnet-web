import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { SignInInput } from '../schemas/signInSchema';
import type { AuthUser } from '../store';

type SignInResponse = { user: AuthUser };

async function signIn(input: SignInInput): Promise<AuthUser> {
  const { data } = await api.post<SignInResponse>('/auth/sign-in', input);
  return data.user;
}

export function useSignIn() {
  return useMutation({ mutationFn: signIn });
}
