import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DomainIcon from "@mui/icons-material/Domain";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HistoryIcon from "@mui/icons-material/History";
import DownloadIcon from "@mui/icons-material/Download";
import { PageHeader } from "@/shared/components/PageHeader";
import { downloadCsv } from "@/features/super-admin/api/auditLog";
import { getApiErrorMessage } from "@/shared/lib/apiError";

type DatasetCard = {
  key: string;
  title: string;
  description: string;
  path: string;
  filename: string;
  icon: typeof DomainIcon;
};

const DATASETS: DatasetCard[] = [
  {
    key: "doctors",
    title: "Doctors",
    description: "All doctors registered at your hospital.",
    path: "/exports/doctors.csv",
    filename: "doctors",
    icon: MedicalServicesIcon,
  },
  {
    key: "departments",
    title: "Departments",
    description: "Your hospital's clinical departments.",
    path: "/exports/departments.csv",
    filename: "departments",
    icon: DomainIcon,
  },
  {
    key: "beds",
    title: "Beds",
    description: "Bed types with current occupancy.",
    path: "/exports/beds.csv",
    filename: "beds",
    icon: HotelIcon,
  },
  {
    key: "ambulances",
    title: "Ambulances",
    description: "Your hospital ambulance fleet.",
    path: "/exports/ambulances.csv",
    filename: "ambulances",
    icon: LocalShippingIcon,
  },
  {
    key: "audit-log",
    title: "Audit Log",
    description: "Activity within your hospital.",
    path: "/exports/audit-log.csv",
    filename: "audit-log",
    icon: HistoryIcon,
  },
];

export function ExportsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState<string | null>(null);

  const exportNow = async (d: DatasetCard) => {
    setBusy(d.key);
    try {
      await downloadCsv(
        d.path,
        `${d.filename}-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      enqueueSnackbar(`${d.title} exported.`, { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Export failed."), {
        variant: "error",
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Exports"
        subtitle="Download your hospital's data as CSV files."
      />

      <div className="grid grid-cols-3 gap-4">
        {DATASETS.map((d) => {
          const Icon = d.icon;
          const isBusy = busy === d.key;
          return (
            <Card
              key={d.key}
              sx={{
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                  {d.title}
                </Typography>
                <Icon sx={{ color: "primary.main", fontSize: 22 }} />
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", flex: 1 }}
              >
                {d.description}
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => void exportNow(d)}
                disabled={isBusy}
                sx={{
                  height: 40,
                  fontWeight: 600,
                  alignSelf: "flex-start",
                  mt: 0.5,
                }}
              >
                {isBusy ? "Exporting…" : "Export now"}
              </Button>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default ExportsPage;
