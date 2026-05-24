import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import { useSnackbar } from "notistack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import {
  StatusChip,
  CATEGORY_TONE,
  type StatusTone,
} from "@/shared/components/StatusChip";
import { SectionCard } from "@/shared/components/SectionCard";
import { formatIst } from "@/shared/lib/datetime";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import {
  useHospital,
  useApproveHospital,
  useRejectHospital,
  useHospitalDocumentUrl,
} from "../api/hospitals";
import { ApproveDialog } from "./components/ApproveDialog";
import { RejectDialog } from "./components/RejectDialog";
import { ApprovedCredentialsDialog } from "./components/ApprovedCredentialsDialog";

type ChecklistItem = { code: string; text: string };

const CHECKLIST: ChecklistItem[] = [
  {
    code: "B1",
    text: "Hospital identity exists in the public NIN registry or state list",
  },
  {
    code: "B2",
    text: "Documents are authentic on inspection (signatures, stamps, dates consistent)",
  },
  { code: "B3", text: "Authorisation letter is valid and admin is reachable" },
  {
    code: "B4",
    text: "Phone callback completed to the hospital's published number",
  },
  { code: "B5", text: "No conflicting registration in the system" },
];

const SCAN_TONE: Record<string, StatusTone> = {
  Clean: "success",
  Scanning: "warning",
  Quarantined: "danger",
};
const REQ_TONE: Record<string, StatusTone> = {
  hospitalRegistrationCertificate: "primary",
  authorisationLetter: "primary",
  ceaLicence: "warning",
  governmentOrder: "warning",
  nabhAccreditation: "muted",
  panOfEntity: "muted",
};
const SLOT_LABELS: Record<string, string> = {
  hospitalRegistrationCertificate: "Hospital Registration Certificate",
  ceaLicence: "Clinical Establishments Act Licence",
  authorisationLetter: "Authorisation Letter for Admin",
  governmentOrder: "Government Order",
  nabhAccreditation: "NABH/NABL Accreditation",
  panOfEntity: "PAN of Hospital Entity",
};

function ReadRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontWeight: 500,
          display: "block",
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {value || "—"}
      </Typography>
    </div>
  );
}

function formatBytes(b: number): string {
  if (b >= 1_000_000) return `${(b / 1_000_000).toFixed(1)} MB`;
  if (b >= 1_000) return `${Math.round(b / 1_000)} KB`;
  return `${b} B`;
}

function DocumentActions({
  hospitalId,
  slotKey,
}: {
  hospitalId: string;
  slotKey: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [pendingMode, setPendingMode] = useState<"preview" | "download" | null>(
    null,
  );
  const { data: url, isFetching } = useHospitalDocumentUrl(
    hospitalId,
    slotKey,
    enabled,
  );

  useEffect(() => {
    if (!url || !pendingMode) return;
    window.open(url, "_blank", "noopener");
    setPendingMode(null);
  }, [url, pendingMode]);

  const handleClick = (mode: "preview" | "download") => {
    if (url) {
      window.open(url, "_blank", "noopener");
    } else {
      setPendingMode(mode);
      setEnabled(true);
    }
  };

  return (
    <>
      <Tooltip title="Preview">
        <span>
          <IconButton
            size="small"
            aria-label="Preview"
            onClick={() => handleClick("preview")}
            disabled={isFetching}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Download">
        <span>
          <IconButton
            size="small"
            aria-label="Download"
            onClick={() => handleClick("download")}
            disabled={isFetching}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}

export function ReviewPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: hospital, isLoading, isError } = useHospital(id);
  const approveMutation = useApproveHospital();
  const rejectMutation = useRejectHospital();

  const [tab, setTab] = useState(0);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    tempPassword: string;
    emailSent: boolean;
  } | null>(null);

  const initialChecks = useMemo(
    () =>
      Object.fromEntries(
        CHECKLIST.map((c) => [c.code, { checked: false, notes: "" }]),
      ),
    [],
  );
  const [checks, setChecks] = useState(initialChecks);

  const applicableCount = CHECKLIST.length;
  const completedCount = CHECKLIST.filter(
    (c) => checks[c.code]?.checked,
  ).length;
  const allDone =
    completedCount === applicableCount &&
    CHECKLIST.every((c) => checks[c.code]?.notes.trim());

  const handleApprove = async (notes: string) => {
    try {
      const result = await approveMutation.mutateAsync({ id, notes });
      setApproveOpen(false);
      enqueueSnackbar(`${hospital?.hospitalName ?? "Hospital"} approved.`, {
        variant: "success",
      });
      setCredentials({
        email: result.admin.email,
        tempPassword: result.admin.tempPassword,
        emailSent: result.admin.emailSent,
      });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleCloseCredentials = () => {
    setCredentials(null);
    navigate("/admin/pending");
  };

  const handleReject = async (notes: string) => {
    try {
      await rejectMutation.mutateAsync({ id, notes });
      setRejectOpen(false);
      enqueueSnackbar(`${hospital?.hospitalName ?? "Hospital"} rejected.`, {
        variant: "success",
      });
      navigate("/admin/pending");
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  if (isLoading) {
    return (
      <>
        <Breadcrumbs
          items={[
            { label: "Home", to: "/admin/dashboard" },
            { label: "Pending Registrations", to: "/admin/pending" },
            { label: "…" },
          ]}
        />
        <Skeleton height={40} sx={{ mt: 2, maxWidth: 400 }} />
        <Skeleton height={300} sx={{ mt: 2 }} />
      </>
    );
  }

  if (isError || !hospital) {
    return (
      <>
        <Breadcrumbs
          items={[
            { label: "Home", to: "/admin/dashboard" },
            { label: "Pending Registrations", to: "/admin/pending" },
            { label: "Error" },
          ]}
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load registration details.
        </Alert>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/admin/dashboard" },
          { label: "Pending Registrations", to: "/admin/pending" },
          { label: hospital.hospitalName },
        ]}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{ fontSize: 28, fontWeight: 600, mb: 1 }}
          >
            {hospital.hospitalName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              NIN: {hospital.nin}
            </Typography>
            <StatusChip
              label={hospital.category}
              tone={CATEGORY_TONE[hospital.category]}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => setRejectOpen(true)}
            sx={{ height: 40, fontWeight: 600 }}
          >
            Reject
          </Button>
          <Tooltip
            title={
              allDone ? "" : "Complete the verification checklist to enable."
            }
          >
            <span>
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                disabled={!allDone}
                onClick={() => setApproveOpen(true)}
                sx={{ height: 40, fontWeight: 600 }}
              >
                Approve
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <div className="grid grid-cols-5 gap-4 mb-4">
        <Box sx={{ gridColumn: "span 3" }}>
          <Card>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{ px: 2, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Tab
                label="Details"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                label="Address"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                label="Admin Contact"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {tab === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <ReadRow
                    label="Hospital Name"
                    value={hospital.hospitalName}
                  />
                  <ReadRow label="NIN" value={hospital.nin} />
                  <ReadRow
                    label="Clinical Establishments Act Licence"
                    value={hospital.ceaLicenceNumber || "—"}
                  />
                  <ReadRow label="Category" value={hospital.category} />
                  <ReadRow
                    label="CGHS Empanelment"
                    value={hospital.cghsEmpanelment ? "Yes" : "No"}
                  />
                  <ReadRow
                    label="Ayushman Bharat Empanelment"
                    value={hospital.ayushmanEmpanelment ? "Yes" : "No"}
                  />
                  <ReadRow
                    label="Submitted"
                    value={formatIst(hospital.createdAt)}
                  />
                  <div>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        fontWeight: 500,
                        display: "block",
                      }}
                    >
                      Tracking ID
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, monospace",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {hospital.trackingId}
                    </Typography>
                  </div>
                </div>
              )}
              {tab === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <ReadRow
                    label="Address line 1"
                    value={hospital.address.line1}
                  />
                  <ReadRow
                    label="Address line 2"
                    value={hospital.address.line2 || "—"}
                  />
                  <ReadRow label="City" value={hospital.address.city} />
                  <ReadRow label="State" value={hospital.address.state} />
                  <ReadRow label="Pincode" value={hospital.address.pincode} />
                  <ReadRow
                    label="Coordinates"
                    value={`${hospital.address.latitude}, ${hospital.address.longitude}`}
                  />
                </div>
              )}
              {tab === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <ReadRow
                    label="Hospital email"
                    value={hospital.contact.email}
                  />
                  <ReadRow
                    label="Hospital phone"
                    value={hospital.contact.phone}
                  />
                  <ReadRow
                    label="Admin name"
                    value={hospital.adminContact.name}
                  />
                  <ReadRow
                    label="Admin email"
                    value={hospital.adminContact.email}
                  />
                  <ReadRow
                    label="Admin phone"
                    value={hospital.adminContact.phone}
                  />
                </div>
              )}
            </Box>
          </Card>
        </Box>

        <Box sx={{ gridColumn: "span 2" }}>
          <SectionCard title="Documents" bodyPadding={0}>
            <Box>
              {hospital.documents.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{ p: 3, color: "text.secondary" }}
                >
                  No documents uploaded.
                </Typography>
              ) : (
                hospital.documents.map((d, i) => (
                  <Box key={d.slotKey}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 2.5,
                        py: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: "#F2EEE6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <DescriptionIcon
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            {SLOT_LABELS[d.slotKey] ?? d.slotKey}
                          </Typography>
                          <StatusChip
                            label="Mandatory"
                            tone={REQ_TONE[d.slotKey] ?? "muted"}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "text.secondary",
                            mt: 0.25,
                          }}
                        >
                          {d.fileName} · {formatBytes(d.sizeBytes)}
                        </Typography>
                        <Box sx={{ mt: 0.75 }}>
                          <StatusChip
                            label="Scan: Clean"
                            tone={SCAN_TONE["Clean"]}
                          />
                        </Box>
                      </Box>
                      <DocumentActions hospitalId={id} slotKey={d.slotKey} />
                    </Box>
                    {i < hospital.documents.length - 1 && <Divider />}
                  </Box>
                ))
              )}
            </Box>
          </SectionCard>
        </Box>
      </div>

      <SectionCard
        title="Verification Checklist"
        action={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 220,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {completedCount} / {applicableCount} Completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(completedCount / applicableCount) * 100}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                bgcolor: "#E5E7EB",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "primary.main",
                  borderRadius: 999,
                },
              }}
            />
          </Box>
        }
        bodyPadding={0}
      >
        <Box>
          {CHECKLIST.map((c, i) => {
            const item = checks[c.code];
            return (
              <Box key={c.code}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr 32px 1fr",
                    alignItems: "center",
                    gap: 2,
                    px: 3,
                    py: 1.75,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    {c.code}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }}>{c.text}</Typography>
                  <Checkbox
                    checked={item?.checked ?? false}
                    onChange={(e) =>
                      setChecks((s) => ({
                        ...s,
                        [c.code]: { ...s[c.code], checked: e.target.checked },
                      }))
                    }
                  />
                  <TextField
                    size="small"
                    placeholder="Notes"
                    value={item?.notes ?? ""}
                    onChange={(e) =>
                      setChecks((s) => ({
                        ...s,
                        [c.code]: { ...s[c.code], notes: e.target.value },
                      }))
                    }
                    error={item?.checked && !item.notes.trim()}
                    helperText={
                      item?.checked && !item.notes.trim()
                        ? "Notes required"
                        : ""
                    }
                  />
                </Box>
                {i < CHECKLIST.length - 1 && <Divider />}
              </Box>
            );
          })}
        </Box>
      </SectionCard>

      <ApproveDialog
        open={approveOpen}
        hospitalName={hospital.hospitalName}
        adminEmail={hospital.adminContact.email}
        isPending={approveMutation.isPending}
        onCancel={() => setApproveOpen(false)}
        onConfirm={handleApprove}
      />
      <RejectDialog
        open={rejectOpen}
        hospitalName={hospital.hospitalName}
        isPending={rejectMutation.isPending}
        onCancel={() => setRejectOpen(false)}
        onConfirm={handleReject}
      />
      <ApprovedCredentialsDialog
        open={Boolean(credentials)}
        hospitalName={hospital.hospitalName}
        email={credentials?.email ?? ""}
        tempPassword={credentials?.tempPassword ?? ""}
        emailSent={credentials?.emailSent ?? false}
        onClose={handleCloseCredentials}
      />
    </>
  );
}
