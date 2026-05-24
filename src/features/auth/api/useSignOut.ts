import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import { useAuthStore } from '../store';

async function signOut(): Promise<void> {
  try {
    await api.post('/auth/sign-out');
  } catch {
    // Sign-out is idempotent — even if it 401s, clear locally.
  }
}

export function useSignOut() {
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      clear();
      queryClient.clear();
    },
  });
}
