import { api } from '@/shared/lib/api';
import type { AuthUser } from '../store';

type MeResponse = { user: AuthUser };

export async function fetchMe(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<MeResponse>('/auth/me');
    return data.user;
  } catch {
    return null;
  }
}
