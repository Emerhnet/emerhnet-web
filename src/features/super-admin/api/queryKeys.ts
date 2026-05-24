export const hospitalKeys = {
  all: ["hospitals"] as const,
  lists: () => [...hospitalKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...hospitalKeys.lists(), filters] as const,
  details: () => [...hospitalKeys.all, "detail"] as const,
  detail: (id: string) => [...hospitalKeys.details(), id] as const,
};
