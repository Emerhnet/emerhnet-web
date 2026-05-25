import { useEffect, useRef, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockIcon from "@mui/icons-material/Lock";
import VerifiedIcon from "@mui/icons-material/Verified";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BlockIcon from "@mui/icons-material/Block";
import { QUALIFICATION_SUGGESTIONS, COUNCILS } from "../data";
import { useDepartments, type ApiDepartment } from "../../api/departments";
import {
  type ApiDoctor,
  type CreateDoctorInput,
  type ConsultationSchedule,
  type DayKey,
  DAYS,
  emptySchedule,
} from "../../api/doctors";
import { useUploadDocument } from "@/features/registration/api/useUploadDocument";
import { useSnackbar } from "notistack";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { formatIst, formatRelative } from "@/shared/lib/datetime";

type Gender = ApiDoctor["gender"];

function SectionHeader({
  Icon,
  title,
}: {
  Icon: typeof PersonIcon;
  title: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3, mb: 2 }}>
      <Icon sx={{ color: "primary.main", fontSize: 20 }} />
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export function DoctorDrawer({
  open,
  mode,
  doctor,
  isPending = false,
  onCancel,
  onSubmit,
  onDeactivate,
}: {
  open: boolean;
  mode: "add" | "edit";
  doctor?: ApiDoctor | null;
  isPending?: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateDoctorInput) => void;
  onDeactivate?: () => void;
}) {
  const { data: departments } = useDepartments({ active: true });
  const activeDepts: ApiDepartment[] = departments ?? [];
  const { enqueueSnackbar } = useSnackbar();
  const uploadMutation = useUploadDocument();
  const fileInput = useRef<HTMLInputElement | null>(null);

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<Gender>("Female");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [specialisation, setSpecialisation] = useState("");
  const [councilReg, setCouncilReg] = useState("");
  const [council, setCouncil] = useState<string>("MCI");
  const [departmentId, setDepartmentId] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [opdRoom, setOpdRoom] = useState("");
  const [photoS3Key, setPhotoS3Key] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ConsultationSchedule>(emptySchedule());

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && doctor) {
      setFullName(doctor.fullName);
      setGender(doctor.gender);
      setDob(doctor.dob ? doctor.dob.slice(0, 10) : "");
      setEmail(doctor.email);
      setPhone(doctor.phone);
      setQualifications(doctor.qualifications);
      setSpecialisation(doctor.specialisation);
      setCouncilReg(doctor.councilReg);
      setCouncil(doctor.council);
      setDepartmentId(doctor.departmentId);
      setJoinedAt(doctor.joinedAt.slice(0, 10));
      setOpdRoom(doctor.opdRoom);
      setPhotoS3Key(doctor.photoS3Key);
      setPhotoUrl(doctor.photoUrl);
      setSchedule(doctor.consultationSchedule ?? emptySchedule());
    } else {
      setFullName("");
      setGender("Female");
      setDob("");
      setEmail("");
      setPhone("");
      setQualifications([]);
      setSpecialisation("");
      setCouncilReg("");
      setCouncil("MCI");
      setDepartmentId("");
      setJoinedAt("");
      setOpdRoom("");
      setPhotoS3Key(null);
      setPhotoUrl(null);
      setSchedule(emptySchedule());
    }
  }, [open, mode, doctor]);

  const valid =
    fullName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    phone.trim().length > 7 &&
    qualifications.length > 0 &&
    councilReg.trim().length > 0 &&
    council.trim().length > 0 &&
    departmentId &&
    joinedAt;

  const handlePhotoPick = () => fileInput.current?.click();
  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const result = await uploadMutation.mutateAsync(file);
      setPhotoS3Key(result.key);
      setPhotoUrl(URL.createObjectURL(file));
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Photo upload failed."), {
        variant: "error",
      });
    }
  };

  const updateDay = (day: DayKey, patch: Partial<{ off: boolean }>) =>
    setSchedule((s) => ({ ...s, [day]: { ...s[day], ...patch } }));
  const updateSlot = (
    day: DayKey,
    idx: number,
    patch: Partial<{ from: string; to: string }>,
  ) =>
    setSchedule((s) => {
      const slots = [...s[day].slots];
      slots[idx] = { ...slots[idx]!, ...patch };
      return { ...s, [day]: { ...s[day], slots } };
    });
  const addSlot = (day: DayKey) =>
    setSchedule((s) => ({
      ...s,
      [day]: { ...s[day], slots: [...s[day].slots, { from: "14:00", to: "17:00" }] },
    }));

  const handleSave = () => {
    onSubmit({
      fullName,
      gender,
      dob: dob || undefined,
      email,
      phone,
      qualifications,
      specialisation,
      councilReg,
      council,
      departmentId,
      joinedAt,
      opdRoom,
      photoS3Key,
      consultationSchedule: schedule,
    });
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 640 },
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {mode === "edit" ? "Edit Doctor Profile" : "Add a doctor"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {mode === "edit"
              ? "Update professional credentials and status"
              : "Register a medical practitioner at your hospital"}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onCancel} aria-label="Close" disabled={isPending}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, pb: 3 }}>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handlePhotoFile}
        />

        <Card
          sx={{
            p: 2,
            mt: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "#FAF8F3",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={photoUrl ?? undefined}
              sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: 24 }}
            >
              {initials || "?"}
            </Avatar>
            <IconButton
              size="small"
              onClick={handlePhotoPick}
              disabled={uploadMutation.isPending}
              sx={{
                position: "absolute",
                right: -6,
                bottom: -6,
                bgcolor: "primary.main",
                color: "#FFFFFF",
                "&:hover": { bgcolor: "primary.dark" },
              }}
              aria-label="Upload photo"
            >
              <PhotoCameraIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              {fullName || "Doctor name"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {specialisation || "Specialisation"}
            </Typography>
            {mode === "edit" && doctor && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor:
                      doctor.dutyStatus === "active"
                        ? "#0F5132"
                        : doctor.dutyStatus === "on_leave"
                          ? "#8B5A00"
                          : "#842029",
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {doctor.dutyStatus === "active"
                    ? "Active service"
                    : doctor.dutyStatus === "on_leave"
                      ? "On leave"
                      : "Off duty"}
                </Typography>
              </Box>
            )}
          </Box>
        </Card>

        <SectionHeader Icon={PersonIcon} title="Personal details" />
        <TextField
          label="Full name"
          required
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
          Gender <span style={{ color: "#842029" }}>*</span>
        </Typography>
        <RadioGroup
          row
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          sx={{ mb: 2 }}
        >
          {(["Male", "Female", "Other", "Prefer not to say"] as const).map((g) => (
            <FormControlLabel
              key={g}
              value={g}
              control={<Radio size="small" />}
              label={<Typography variant="body2">{g}</Typography>}
            />
          ))}
        </RadioGroup>
        <TextField
          label="Date of birth"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: { xs: "100%", sm: 220 } }}
        />

        <SectionHeader Icon={SchoolIcon} title="Professional" />
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
          Medical Council Reg Number
        </Typography>
        <TextField
          required
          fullWidth
          value={councilReg}
          onChange={(e) => setCouncilReg(e.target.value)}
          disabled={mode === "edit"}
          placeholder="MC-XXXXX-IND"
          helperText={
            mode === "edit"
              ? "Verified via National Medical Register. Cannot be edited manually."
              : "Must be unique across this hospital."
          }
          InputProps={
            mode === "edit"
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <LockIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  sx: { bgcolor: "#F5F2EC", fontStyle: "italic" },
                }
              : undefined
          }
          sx={{ mb: 2 }}
        />

        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
          Primary Specialization
        </Typography>
        <TextField
          fullWidth
          value={specialisation}
          onChange={(e) => setSpecialisation(e.target.value)}
          placeholder="e.g. Cardiology"
          sx={{ mb: 2 }}
        />

        <Autocomplete
          multiple
          freeSolo
          options={QUALIFICATION_SUGGESTIONS}
          value={qualifications}
          onChange={(_, v) => setQualifications(v)}
          renderTags={(value, getTagProps) =>
            value.map((option, idx) => {
              const { key: _k, ...tagProps } = getTagProps({ index: idx });
              return (
                <Chip key={`${option}-${idx}`} size="small" label={option} {...tagProps} />
              );
            })
          }
          renderInput={(p) => <TextField {...p} label="Qualifications" required />}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          label="Registering medical council"
          required
          fullWidth
          value={council}
          onChange={(e) => setCouncil(e.target.value)}
        >
          {COUNCILS.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <SectionHeader Icon={AssignmentIndIcon} title="Assignment" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
              Department
            </Typography>
            <TextField
              select
              required
              fullWidth
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              {activeDepts.length === 0 && (
                <MenuItem value="" disabled>
                  No active departments — add one first
                </MenuItem>
              )}
              {activeDepts.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
              OPD Room
            </Typography>
            <TextField
              fullWidth
              value={opdRoom}
              onChange={(e) => setOpdRoom(e.target.value)}
              placeholder="Room 402, Block B"
            />
          </Box>
        </div>
        <TextField
          label="Joining date"
          type="date"
          required
          value={joinedAt}
          onChange={(e) => setJoinedAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 2, width: { xs: "100%", sm: 220 } }}
        />

        <SectionHeader Icon={AlternateEmailIcon} title="Contact" />
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
          Mobile Number
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            value="+91"
            disabled
            sx={{ width: 72, "& .MuiInputBase-input": { textAlign: "center" } }}
          />
          <TextField
            required
            type="tel"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98765 43210"
          />
        </Box>
        <TextField
          label="Email"
          required
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <SectionHeader Icon={AccessTimeIcon} title="Consultation timings" />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {DAYS.map((day) => {
            const d = schedule[day];
            return (
              <Box
                key={day}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "60px 80px 1fr",
                  alignItems: "flex-start",
                  gap: 1.5,
                  py: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 500, pt: 1 }}>{day}</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={d.off}
                      onChange={(e) => updateDay(day, { off: e.target.checked })}
                    />
                  }
                  label={<Typography sx={{ fontSize: 12 }}>Off</Typography>}
                  sx={{ m: 0, pt: 0.5 }}
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {d.slots.map((slot, idx) => (
                    <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TextField
                        type="time"
                        size="small"
                        disabled={d.off}
                        value={slot.from}
                        onChange={(e) => updateSlot(day, idx, { from: e.target.value })}
                        sx={{ width: 110 }}
                      />
                      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>to</Typography>
                      <TextField
                        type="time"
                        size="small"
                        disabled={d.off}
                        value={slot.to}
                        onChange={(e) => updateSlot(day, idx, { to: e.target.value })}
                        sx={{ width: 110 }}
                      />
                    </Box>
                  ))}
                  {!d.off && (
                    <Link
                      component="button"
                      type="button"
                      onClick={() => addSlot(day)}
                      underline="hover"
                      sx={{ fontSize: 12, fontWeight: 500, alignSelf: "flex-start" }}
                    >
                      + Add slot
                    </Link>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

        {mode === "edit" && doctor && (
          <>
            <Divider sx={{ my: 3 }} />
            <Card sx={{ p: 2.5, bgcolor: "#FAF8F3" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Status & history</Typography>
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                  label="VERIFIED"
                  size="small"
                  sx={{
                    bgcolor: "#D1E7DD",
                    color: "#0F5132",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: "0.04em",
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                </Box>
                <Box>
                  <Typography variant="body2">Last updated {formatRelative(doctor.updatedAt)}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {formatIst(doctor.updatedAt)}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 1 }}>Staff control actions</Typography>
              <Button
                variant="text"
                size="small"
                startIcon={<BlockIcon />}
                color="error"
                onClick={onDeactivate}
                disabled={!onDeactivate || Boolean(doctor.deactivatedAt)}
                sx={{ fontWeight: 600 }}
              >
                {doctor.deactivatedAt ? "Already deactivated" : "Deactivate doctor profile"}
              </Button>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
                Once deactivated, the doctor will no longer be visible in OPD lists.
              </Typography>
            </Card>
          </>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button variant="outlined" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!valid || isPending}>
          {isPending ? "Saving…" : mode === "edit" ? "Save changes" : "Add doctor"}
        </Button>
      </Box>
    </Drawer>
  );
}
