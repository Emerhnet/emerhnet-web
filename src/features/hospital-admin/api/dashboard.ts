import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";

export type AmbulanceStatusCounts = {
  Available: number;
  "On Duty": number;
  "Under Maintenance": number;
  "Out of Service": number;
};

export type HospitalAdminDashboard = {
  hospital: { name: string; nin: string; status: string; updatedAt: string };
  kpis: {
    activeDoctors: number;
    departmentCount: number;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    totalAmbulances: number;
    availableAmbulances: number;
    onDutyAmbulances: number;
  };
  ambulanceStatus: AmbulanceStatusCounts;
  doctorsByDepartment: Array<{ name: string; count: number }>;
  bedTypes: Array<{ type: string; total: number; occupied: number }>;
};

export function useHospitalDashboard() {
  return useQuery({
    queryKey: ["dashboard", "hospital"] as const,
    queryFn: async () => {
      const { data } = await api.get<HospitalAdminDashboard>(
        "/dashboard/hospital",
      );
      return data;
    },
  });
}
