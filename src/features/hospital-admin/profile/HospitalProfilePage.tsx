import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSnackbar } from "notistack";
import { PageHeader } from "@/shared/components/PageHeader";
import { SectionCard } from "@/shared/components/SectionCard";
import { StatusChip, type StatusTone } from "@/shared/components/StatusChip";
import { formatIst, formatRelative } from "@/shared/lib/datetime";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { useUploadDocument } from "@/features/registration/api/useUploadDocument";
import {
  useMyHospital,
  useUpdateMyHospital,
  useAddPhoto,
  useDeletePhoto,
  type MyHospital,
} from "../api/hospital";

const MAX_DESC = 2000;
const MAX_PHOTOS = 10;

const STATUS_LABELS: Record<MyHospital["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  suspended: "Suspended",
  rejected: "Rejected",
};
const STATUS_TONE: Record<MyHospital["status"], StatusTone> = {
  pending: "warning",
  approved: "success",
  suspended: "danger",
  rejected: "danger",
};

function ReadRow({
  label,
  value,
  locked,
}: {
  label: string;
  value: string;
  locked?: boolean;
}) {
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
        {locked && (
          <Tooltip title="Changes require Galas re-approval">
            <LockIcon sx={{ fontSize: 12, color: "text.secondary" }} />
          </Tooltip>
        )}
      </Box>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {value || "—"}
      </Typography>
    </div>
  );
}

function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  const d = 0.01;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <Box
      sx={{
        height: 280,
        mt: 2,
        borderRadius: 1,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <iframe
        key={`${lat},${lng}`}
        title="Hospital location"
        src={src}
        style={{ border: 0, width: "100%", height: "100%" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Box>
  );
}

type EditForm = {
  hospitalEmail: string;
  hospitalPhone: string;
  visitingHours: string;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
  description: string;
};

function blankForm(h: MyHospital): EditForm {
  return {
    hospitalEmail: h.contact.email,
    hospitalPhone: h.contact.phone,
    visitingHours: h.visitingHours,
    line1: h.address.line1,
    line2: h.address.line2,
    city: h.address.city,
    pincode: h.address.pincode,
    description: h.description,
  };
}

function PhotoGallery({ hospital }: { hospital: MyHospital }) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const uploadMutation = useUploadDocument();
  const addPhoto = useAddPhoto();
  const deletePhoto = useDeletePhoto();

  const atLimit = hospital.photos.length >= MAX_PHOTOS;
  const busy = uploadMutation.isPending || addPhoto.isPending;

  const handlePick = () => fileInput.current?.click();

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    const remaining = MAX_PHOTOS - hospital.photos.length;
    const toUpload = files.slice(0, remaining);
    for (const file of toUpload) {
      try {
        const result = await uploadMutation.mutateAsync(file);
        await addPhoto.mutateAsync({
          s3Key: result.key,
          fileName: result.fileName,
          sizeBytes: result.sizeBytes,
        });
      } catch (err) {
        enqueueSnackbar(
          getApiErrorMessage(err, `Failed to upload ${file.name}.`),
          { variant: "error" },
        );
      }
    }
    if (files.length > remaining) {
      enqueueSnackbar(`Limit is ${MAX_PHOTOS} photos. Extra files skipped.`, {
        variant: "warning",
      });
    }
  };

  const handleDelete = async (s3Key: string) => {
    try {
      await deletePhoto.mutateAsync(s3Key);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Failed to remove photo."), {
        variant: "error",
      });
    }
  };

  return (
    <SectionCard
      title={`Hospital photos (${hospital.photos.length}/${MAX_PHOTOS})`}
      action={
        <Button
          variant="text"
          size="small"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={handlePick}
          disabled={atLimit || busy}
          sx={{ fontWeight: 600 }}
        >
          {busy ? "Uploading…" : "Add photos"}
        </Button>
      }
    >
      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={handleFiles}
      />
      {hospital.photos.length === 0 ? (
        <Box
          sx={{
            aspectRatio: "16 / 9",
            bgcolor: "#F2EEE6",
            borderRadius: 1,
            border: "1px dashed",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          No photos yet. Add up to {MAX_PHOTOS} JPG/PNG/WEBP images.
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
          }}
        >
          {hospital.photos.map((p) => (
            <Box
              key={p.s3Key}
              sx={{
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "#F2EEE6",
                "&:hover .photo-actions": { opacity: 1 },
              }}
            >
              <Box
                component="img"
                src={p.url}
                alt={p.fileName}
                loading="lazy"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Box
                className="photo-actions"
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.35)",
                  opacity: 0,
                  transition: "opacity 120ms",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  p: 0.5,
                }}
              >
                <Tooltip title="Remove">
                  <IconButton
                    size="small"
                    onClick={() => void handleDelete(p.s3Key)}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.92)",
                      "&:hover": { bgcolor: "#FFFFFF" },
                    }}
                    aria-label="Remove photo"
                  >
                    <DeleteOutlineIcon
                      fontSize="small"
                      sx={{ color: "#B91C1C" }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </SectionCard>
  );
}

export function HospitalProfilePage() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: hospital, isLoading, isError, refetch } = useMyHospital();
  const updateMutation = useUpdateMyHospital();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditForm | null>(null);

  useEffect(() => {
    if (hospital && form === null) setForm(blankForm(hospital));
  }, [hospital, form]);

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Hospital Profile"
          subtitle="Your hospital's details on EMERHNET."
        />
        <Skeleton height={120} sx={{ mb: 2 }} />
        <Skeleton height={320} />
      </>
    );
  }

  if (isError || !hospital || !form) {
    return (
      <>
        <PageHeader title="Hospital Profile" />
        <Alert
          severity="error"
          action={
            <Button size="small" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        >
          Failed to load profile.
        </Alert>
      </>
    );
  }

  const pincodeValid = /^\d{6}$/.test(form.pincode);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.hospitalEmail);
  const canSave =
    pincodeValid && emailValid && form.description.length <= MAX_DESC;

  const onCancel = () => {
    setForm(blankForm(hospital));
    setEditing(false);
  };

  const onSave = async () => {
    try {
      await updateMutation.mutateAsync({
        contact: { email: form.hospitalEmail, phone: form.hospitalPhone },
        visitingHours: form.visitingHours,
        address: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          pincode: form.pincode,
        },
        description: form.description,
      });
      enqueueSnackbar("Profile updated.", { variant: "success" });
      setEditing(false);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Failed to update profile."), {
        variant: "error",
      });
    }
  };

  const initials = hospital.adminContact.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      <PageHeader
        title="Hospital Profile"
        subtitle="Your hospital's details on EMERHNET."
        action={
          editing ? (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={updateMutation.isPending}
                sx={{ height: 40, fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => void onSave()}
                disabled={!canSave || updateMutation.isPending}
                sx={{ height: 40, fontWeight: 600 }}
              >
                {updateMutation.isPending ? "Saving…" : "Save changes"}
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditing(true)}
              sx={{ height: 40, fontWeight: 600 }}
            >
              Edit Profile
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Box
          sx={{
            gridColumn: { xs: "auto", lg: "span 3" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {editing && (
            <Alert severity="warning" icon={<InfoOutlinedIcon />}>
              Hospital name, NIN, category, geo-coordinates, state, and
              empanelment are locked. Contact Galas for a re-approval request to
              change them.
            </Alert>
          )}

          <SectionCard title="Identity">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReadRow
                label="Hospital Name"
                value={hospital.hospitalName}
                locked
              />
              <ReadRow label="NIN" value={hospital.nin} locked />
              <ReadRow label="Category" value={hospital.category} locked />
              <ReadRow
                label="CEA Licence"
                value={hospital.ceaLicenceNumber || "—"}
                locked
              />
            </div>
          </SectionCard>

          <SectionCard title="Contact">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editing ? (
                <>
                  <TextField
                    label="Hospital Email"
                    value={form.hospitalEmail}
                    onChange={(e) =>
                      setForm({ ...form, hospitalEmail: e.target.value })
                    }
                    error={!emailValid}
                    helperText={!emailValid ? "Enter a valid email." : ""}
                  />
                  <TextField
                    label="Hospital Phone"
                    value={form.hospitalPhone}
                    onChange={(e) =>
                      setForm({ ...form, hospitalPhone: e.target.value })
                    }
                  />
                  <TextField
                    label="Visiting Hours"
                    value={form.visitingHours}
                    onChange={(e) =>
                      setForm({ ...form, visitingHours: e.target.value })
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                </>
              ) : (
                <>
                  <ReadRow
                    label="Hospital Email"
                    value={hospital.contact.email}
                  />
                  <ReadRow
                    label="Hospital Phone"
                    value={hospital.contact.phone}
                  />
                  <ReadRow
                    label="Visiting Hours"
                    value={hospital.visitingHours}
                  />
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Address">
            {editing ? (
              <>
                <TextField
                  label="Address line 1"
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Address line 2"
                  value={form.line2}
                  onChange={(e) => setForm({ ...form, line2: e.target.value })}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-2">
                  <TextField
                    label="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  <TextField
                    label="State"
                    value={hospital.address.state}
                    disabled
                  />
                  <TextField
                    label="Pincode"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm({ ...form, pincode: e.target.value.slice(0, 6) })
                    }
                    error={!pincodeValid}
                    helperText={
                      !pincodeValid ? "Pincode must be 6 digits." : ""
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ReadRow
                    label="Latitude"
                    value={String(hospital.address.latitude)}
                    locked
                  />
                  <ReadRow
                    label="Longitude"
                    value={String(hospital.address.longitude)}
                    locked
                  />
                </div>
              </>
            ) : (
              <>
                <ReadRow
                  label="Address"
                  value={`${hospital.address.line1}${hospital.address.line2 ? ", " + hospital.address.line2 : ""}`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  <ReadRow label="City" value={hospital.address.city} />
                  <ReadRow label="State" value={hospital.address.state} />
                  <ReadRow label="Pincode" value={hospital.address.pincode} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <ReadRow
                    label="Latitude"
                    value={String(hospital.address.latitude)}
                    locked
                  />
                  <ReadRow
                    label="Longitude"
                    value={String(hospital.address.longitude)}
                    locked
                  />
                </div>
              </>
            )}
            <MapEmbed
              lat={hospital.address.latitude}
              lng={hospital.address.longitude}
            />
          </SectionCard>

          <SectionCard title="Empanelment">
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {[
                { label: "CGHS", value: hospital.cghsEmpanelment },
                {
                  label: "Ayushman Bharat",
                  value: hospital.ayushmanEmpanelment,
                },
              ].map(({ label, value }) => (
                <Box
                  key={label}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CheckCircleIcon
                    sx={{ color: value ? "success.main" : "text.disabled" }}
                  />
                  <Box>
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
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {value ? "Yes" : "No"}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>

          <SectionCard title="Description">
            {editing ? (
              <>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        form.description.length > MAX_DESC
                          ? "error.main"
                          : "text.secondary",
                    }}
                  >
                    {form.description.length} / {MAX_DESC}
                  </Typography>
                </Box>
                <TextField
                  multiline
                  rows={8}
                  fullWidth
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value.slice(0, MAX_DESC),
                    })
                  }
                />
              </>
            ) : (
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
              >
                {hospital.description || "No description provided."}
              </Typography>
            )}
          </SectionCard>
        </Box>

        <Box
          sx={{
            gridColumn: "span 2",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <PhotoGallery hospital={hospital} />

          <SectionCard title="Metadata">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <ReadRow
                label="Registered"
                value={formatIst(hospital.createdAt)}
              />
              {hospital.approvedAt && (
                <ReadRow
                  label="Approved"
                  value={formatIst(hospital.approvedAt)}
                />
              )}
              <ReadRow
                label="Last updated"
                value={formatRelative(hospital.updatedAt)}
              />
              <ReadRow label="Tracking ID" value={hospital.trackingId} />
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontWeight: 500,
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Status
                </Typography>
                <StatusChip
                  label={STATUS_LABELS[hospital.status]}
                  tone={STATUS_TONE[hospital.status]}
                />
              </Box>
            </Box>
          </SectionCard>

          <SectionCard title="Hospital Administrator">
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "primary.main",
                  fontSize: 16,
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {hospital.adminContact.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  Hospital Administrator
                </Typography>
                <Typography sx={{ fontSize: 13, mt: 0.5 }}>
                  {hospital.adminContact.email}
                </Typography>
                <Typography sx={{ fontSize: 13 }}>
                  {hospital.adminContact.phone}
                </Typography>
              </Box>
            </Box>
          </SectionCard>
        </Box>
      </div>
    </>
  );
}
