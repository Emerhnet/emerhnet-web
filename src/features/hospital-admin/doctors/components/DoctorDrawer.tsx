import { useEffect, useState } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LockIcon from "@mui/icons-material/Lock";
import { QUALIFICATION_SUGGESTIONS, COUNCILS } from "../data";
import { useDepartments, type ApiDepartment } from "../../api/departments";
import type { ApiDoctor, CreateDoctorInput } from "../../api/doctors";

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
}: {
  open: boolean;
  mode: "add" | "edit";
  doctor?: ApiDoctor | null;
  isPending?: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateDoctorInput) => void;
}) {
  const { data: departments } = useDepartments({ active: true });
  const activeDepts: ApiDepartment[] = departments ?? [];

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
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: { width: 640, display: "flex", flexDirection: "column" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
          {mode === "edit" ? "Edit doctor" : "Add a doctor"}
        </Typography>
        <IconButton
          size="small"
          onClick={onCancel}
          aria-label="Close"
          disabled={isPending}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, pb: 3 }}>
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
          {(["Male", "Female", "Other", "Prefer not to say"] as const).map(
            (g) => (
              <FormControlLabel
                key={g}
                value={g}
                control={<Radio size="small" />}
                label={<Typography variant="body2">{g}</Typography>}
              />
            ),
          )}
        </RadioGroup>
        <TextField
          label="Date of birth"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 220 }}
        />

        <SectionHeader Icon={AlternateEmailIcon} title="Contact" />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Phone"
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <SectionHeader Icon={SchoolIcon} title="Professional" />
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
                <Chip
                  key={`${option}-${idx}`}
                  size="small"
                  label={option}
                  {...tagProps}
                />
              );
            })
          }
          renderInput={(p) => (
            <TextField {...p} label="Qualifications" required />
          )}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Specialisation"
          fullWidth
          value={specialisation}
          onChange={(e) => setSpecialisation(e.target.value)}
          sx={{ mb: 2 }}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Medical council reg number"
            required
            value={councilReg}
            onChange={(e) => setCouncilReg(e.target.value)}
            disabled={mode === "edit"}
            helperText={
              mode === "edit"
                ? "Reg number cannot be edited. Create a new record if a correction is needed."
                : "Must be unique across this hospital."
            }
            InputProps={
              mode === "edit"
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <LockIcon
                          fontSize="small"
                          sx={{ color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                    sx: { bgcolor: "#F2EEE6" },
                  }
                : undefined
            }
          />
          <TextField
            select
            label="Registering medical council"
            required
            value={council}
            onChange={(e) => setCouncil(e.target.value)}
          >
            {COUNCILS.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <SectionHeader Icon={AssignmentIndIcon} title="Assignment" />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            select
            label="Department"
            required
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
          <TextField
            label="Joining date"
            type="date"
            required
            value={joinedAt}
            onChange={(e) => setJoinedAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
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
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!valid || isPending}
        >
          {isPending
            ? "Saving…"
            : mode === "edit"
              ? "Save changes"
              : "Add doctor"}
        </Button>
      </Box>
    </Drawer>
  );
}
