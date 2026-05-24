import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import DescriptionIcon from "@mui/icons-material/Description";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ShieldIcon from "@mui/icons-material/Shield";
import VerifiedIcon from "@mui/icons-material/Verified";
import BadgeIcon from "@mui/icons-material/Badge";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSnackbar } from "notistack";
import {
  useRegistrationStore,
  type DocumentSlotKey,
  type DocumentSlotState,
} from "../store";
import { useUploadDocument } from "../api/useUploadDocument";
import { getApiErrorMessage } from "@/shared/lib/apiError";

type Requirement = "Mandatory" | "Optional" | "Conditional";

type SlotDef = {
  key: DocumentSlotKey;
  name: string;
  requirement: Requirement;
  description: string;
  icon: typeof DescriptionIcon;
};

const SLOTS: SlotDef[] = [
  {
    key: "hospitalRegistrationCertificate",
    name: "Hospital Registration Certificate",
    requirement: "Mandatory",
    description:
      "Primary registration document issued by the relevant authority",
    icon: DescriptionIcon,
  },
  {
    key: "ceaLicence",
    name: "Clinical Establishments Act Licence",
    requirement: "Conditional",
    description: "Mandatory in states where the Act is in force",
    icon: UploadFileIcon,
  },
  {
    key: "authorisationLetter",
    name: "Authorisation Letter for Admin",
    requirement: "Mandatory",
    description: "Required for designated administrative personnel",
    icon: NoteAddIcon,
  },
  {
    key: "governmentOrder",
    name: "Government Order",
    requirement: "Conditional",
    description: "Mandatory for Government category hospitals",
    icon: ShieldIcon,
  },
  {
    key: "nabhAccreditation",
    name: "NABH/NABL Accreditation",
    requirement: "Optional",
    description: "Accreditation certificate, if applicable",
    icon: VerifiedIcon,
  },
  {
    key: "panOfEntity",
    name: "PAN of Hospital Entity",
    requirement: "Optional",
    description: "PAN card of the hospital entity",
    icon: BadgeIcon,
  },
];

function formatSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
}

function RequirementBadge({ value }: { value: Requirement }) {
  return (
    <Chip
      label={value.toUpperCase()}
      size="small"
      sx={{
        bgcolor: "#E8EEF5",
        color: "primary.main",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        height: 22,
        borderRadius: 1,
      }}
    />
  );
}

function SlotIcon({ Icon }: { Icon: typeof DescriptionIcon }) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 1,
        bgcolor: "#F2EEE6",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ color: "primary.main", fontSize: 22 }} />
    </Box>
  );
}

function DocumentRow({
  slot,
  state,
  onPickFile,
  onRemove,
}: {
  slot: SlotDef;
  state: DocumentSlotState | undefined;
  onPickFile: () => void;
  onRemove: () => void;
}) {
  const Icon = slot.icon;
  const isClean = state?.scanStatus === "clean" && state.s3Key;
  const isScanning = state?.scanStatus === "scanning";
  const isError = state?.scanStatus === "error";

  if (isClean || isScanning || isError) {
    return (
      <Box
        sx={{
          position: "relative",
          border: "1px solid",
          borderColor: isError
            ? "error.light"
            : isClean
              ? "divider"
              : "primary.light",
          bgcolor: isError ? "#FFF5F5" : isClean ? "#F7F4EE" : "#E8EEF5",
          borderRadius: 1,
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          overflow: "hidden",
        }}
      >
        <SlotIcon Icon={Icon} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2 flex-wrap">
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              {slot.name}
            </Typography>
            <RequirementBadge value={slot.requirement} />
          </div>
          <Typography
            variant="body2"
            sx={{ color: isError ? "error.main" : "text.secondary", mt: 0.25 }}
          >
            {isScanning
              ? "Uploading…"
              : isError
                ? "Upload failed — click to retry"
                : `${state?.fileName} (${formatSize(state?.sizeBytes ?? 0)})`}
          </Typography>
        </Box>
        {isClean && (
          <>
            <IconButton size="small" aria-label="Preview" disabled>
              <VisibilityIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
            </IconButton>
            <IconButton size="small" onClick={onRemove} aria-label="Remove">
              <DeleteOutlineIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
            </IconButton>
          </>
        )}
        {isScanning && (
          <AutorenewIcon
            sx={{
              color: "primary.main",
              animation: "spin 1.4s linear infinite",
            }}
          />
        )}
        {isError && (
          <IconButton
            size="small"
            onClick={onPickFile}
            aria-label="Retry upload"
          >
            <ErrorOutlineIcon fontSize="small" sx={{ color: "error.main" }} />
          </IconButton>
        )}
      </Box>
    );
  }

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onPickFile}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPickFile();
        }
      }}
      sx={{
        cursor: "pointer",
        border: "1.5px dashed",
        borderColor: "divider",
        borderRadius: 1,
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        minHeight: 100,
        transition: "border-color 120ms, background 120ms",
        "&:hover": { borderColor: "primary.main", bgcolor: "#FAFAFA" },
      }}
    >
      <SlotIcon Icon={Icon} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center gap-2 flex-wrap">
          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
            {slot.name}
          </Typography>
          <RequirementBadge value={slot.requirement} />
        </div>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
          {slot.description}
        </Typography>
      </Box>
    </Box>
  );
}

export function DocumentsStep() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const documents = useRegistrationStore((s) => s.documents);
  const setDocument = useRegistrationStore((s) => s.setDocument);
  const uploadMutation = useUploadDocument();

  const inputRefs = useRef<Record<DocumentSlotKey, HTMLInputElement | null>>({
    hospitalRegistrationCertificate: null,
    ceaLicence: null,
    authorisationLetter: null,
    governmentOrder: null,
    nabhAccreditation: null,
    panOfEntity: null,
  });

  const handleFile = async (key: DocumentSlotKey, file: File) => {
    setDocument(key, {
      fileName: file.name,
      sizeBytes: file.size,
      scanStatus: "scanning",
    });
    try {
      const result = await uploadMutation.mutateAsync(file);
      setDocument(key, {
        fileName: result.fileName,
        sizeBytes: result.sizeBytes,
        s3Key: result.key,
        scanStatus: "clean",
      });
    } catch (err) {
      setDocument(key, {
        fileName: file.name,
        sizeBytes: file.size,
        scanStatus: "error",
      });
      enqueueSnackbar(
        getApiErrorMessage(err, "Upload failed. Please try again."),
        { variant: "error" },
      );
    }
  };

  const mandatoryUploaded = SLOTS.filter(
    (s) => s.requirement === "Mandatory",
  ).every(
    (s) => documents[s.key]?.scanStatus === "clean" && documents[s.key]?.s3Key,
  );

  const anyUploading = Object.values(documents).some(
    (d) => d?.scanStatus === "scanning",
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h1"
          sx={{ fontSize: 28, fontWeight: 600, color: "primary.main", mb: 0.5 }}
        >
          Hospital Registration
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Upload supporting documents. PDFs and images are accepted, up to 10 MB
          each.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {SLOTS.map((slot) => (
          <div key={slot.key}>
            <input
              ref={(el) => {
                inputRefs.current[slot.key] = el;
              }}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(slot.key, f);
                e.target.value = "";
              }}
            />
            <DocumentRow
              slot={slot}
              state={documents[slot.key]}
              onPickFile={() => inputRefs.current[slot.key]?.click()}
              onRemove={() => setDocument(slot.key, undefined)}
            />
          </div>
        ))}
      </Box>

      {Object.values(documents).some((d) => d?.scanStatus === "error") && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Some files failed to upload. Retry by clicking the error icon.
        </Alert>
      )}

      <Box
        sx={{
          mt: 4,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          type="button"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/register-hospital/admin")}
          sx={{ height: 44, px: 3, fontWeight: 600 }}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          disabled={!mandatoryUploaded || anyUploading}
          onClick={() => navigate("/register-hospital/review")}
          sx={{ height: 44, px: 3, fontWeight: 600 }}
        >
          Review
        </Button>
      </Box>
    </Box>
  );
}
