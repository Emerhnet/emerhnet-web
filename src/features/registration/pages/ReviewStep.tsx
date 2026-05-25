import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRegistrationStore } from "../store";
import { useSubmitRegistration } from "../api/useSubmitRegistration";
import type { SubmitRegistrationPayload } from "../api/useSubmitRegistration";

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

export function ReviewStep() {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { hospitalDetails, addressLocation, adminContact, documents, invite } =
    useRegistrationStore();
  const mutation = useSubmitRegistration();

  const documentNames = Object.values(documents)
    .map((d) => d?.fileName)
    .filter(Boolean) as string[];

  const onSubmit = async () => {
    try {
      const result = await mutation.mutateAsync({
        hospitalDetails,
        addressLocation,
        adminContact,
        documents,
        inviteToken: invite?.token,
      } as SubmitRegistrationPayload);
      navigate("/register-hospital/submitted", {
        state: {
          trackingId: result.trackingId,
          adminEmail: adminContact.adminEmail,
        },
      });
    } catch (err) {
      enqueueSnackbar(
        getApiErrorMessage(err, "Submission failed. Try again."),
        { variant: "error" },
      );
    }
  };

  return (
    <Box>
      <Typography
        variant="h1"
        sx={{ fontSize: 28, fontWeight: 600, color: "primary.main", mb: 3 }}
      >
        Review your application
      </Typography>

      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          mb: 1.5,
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ bgcolor: "#F2EEE6" }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pr: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Hospital details</Typography>
            <Link
              component="button"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/register-hospital");
              }}
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              Edit
            </Link>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReadRow
              label="Hospital name"
              value={hospitalDetails.hospitalName}
            />
            <ReadRow label="NIN" value={hospitalDetails.nin} />
            <ReadRow label="Category" value={hospitalDetails.category} />
            <ReadRow
              label="CEA licence"
              value={hospitalDetails.ceaLicenceNumber}
            />
            <ReadRow
              label="CGHS empanelment"
              value={hospitalDetails.cghsEmpanelment}
            />
            <ReadRow
              label="Ayushman Bharat"
              value={hospitalDetails.ayushmanEmpanelment}
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        disableGutters
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          mb: 1.5,
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pr: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Address & Location</Typography>
            <Link
              component="button"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/register-hospital/address");
              }}
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              Edit
            </Link>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReadRow
              label="Address line 1"
              value={addressLocation.addressLine1}
            />
            <ReadRow
              label="Address line 2"
              value={addressLocation.addressLine2}
            />
            <ReadRow label="City" value={addressLocation.city} />
            <ReadRow label="State" value={addressLocation.state} />
            <ReadRow label="Pincode" value={addressLocation.pincode} />
            <ReadRow
              label="Coordinates"
              value={
                addressLocation.latitude && addressLocation.longitude
                  ? `${addressLocation.latitude}, ${addressLocation.longitude}`
                  : undefined
              }
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        disableGutters
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          mb: 1.5,
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pr: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Admin contact</Typography>
            <Link
              component="button"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/register-hospital/admin");
              }}
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              Edit
            </Link>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReadRow
              label="Hospital email"
              value={adminContact.hospitalEmail}
            />
            <ReadRow
              label="Hospital phone"
              value={adminContact.hospitalPhone}
            />
            <ReadRow label="Admin name" value={adminContact.adminName} />
            <ReadRow label="Admin email" value={adminContact.adminEmail} />
            <ReadRow label="Admin phone" value={adminContact.adminPhone} />
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        disableGutters
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          mb: 1.5,
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pr: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Documents</Typography>
            <Link
              component="button"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/register-hospital/documents");
              }}
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              Edit
            </Link>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {documentNames.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No documents uploaded.
            </Typography>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {documentNames.map((n) => (
                <li key={n}>
                  <Typography variant="body2">{n}</Typography>
                </li>
              ))}
            </ul>
          )}
        </AccordionDetails>
      </Accordion>

      <Box
        sx={{ mt: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              sx={{ alignSelf: "flex-start", pt: 0 }}
            />
          }
          label={
            <Typography variant="body2">
              I confirm the information provided is accurate and that I have
              authority to register this hospital.
            </Typography>
          }
          sx={{ alignItems: "flex-start", mr: 0 }}
        />
      </Box>

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
          onClick={() => navigate("/register-hospital/documents")}
          sx={{ height: 44, px: 3, fontWeight: 600 }}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="contained"
          disabled={!confirmed || mutation.isPending}
          onClick={onSubmit}
          sx={{ height: 44, px: 3, fontWeight: 600 }}
        >
          {mutation.isPending ? "Submitting..." : "Submit application"}
        </Button>
      </Box>
    </Box>
  );
}
