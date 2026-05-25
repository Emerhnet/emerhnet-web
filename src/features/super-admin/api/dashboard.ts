import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";

export type SuperAdminDashboard = {
  kpis: {
    pendingRegistrations: number;
    approvedHospitals: number;
    totalDoctors: number;
    totalAmbulances: number;
  };
  statusBreakdown: {
    approved: number;
    pending: number;
    suspended: number;
    rejected: number;
  };
  pendingQueue: Array<{
    id: string;
    hospitalName: string;
    city: string;
    createdAt: string;
    source: "Self" | "Invited";
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    actorName: string;
    actorRole: string;
    createdAt: string;
    hospitalName: string | null;
    entityType: string | null;
  }>;
  rejectionsLast30d: Array<{ week: string; count: number }>;
};

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: ["dashboard", "super-admin"] as const,
    queryFn: async () => {
      const { data } = await api.get<SuperAdminDashboard>(
        "/dashboard/super-admin",
      );
      return data;
    },
  });
}
