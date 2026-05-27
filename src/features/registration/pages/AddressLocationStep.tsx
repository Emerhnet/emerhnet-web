import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { INDIAN_STATES } from "@/shared/constants/indianStates";
import {
  addressLocationSchema,
  type AddressLocationInput,
} from "../schemas/addressLocationSchema";
import { useRegistrationStore } from "../store";

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    house_number?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
  };
};

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      variant="body2"
      sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
    >
      {children} {required && <span style={{ color: "#842029" }}>*</span>}
    </Typography>
  );
}

export function AddressLocationStep() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const stored = useRegistrationStore((s) => s.addressLocation);
  const setAddressLocation = useRegistrationStore((s) => s.setAddressLocation);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressLocationInput>({
    resolver: zodResolver(addressLocationSchema),
    defaultValues: {
      addressLine1: stored.addressLine1 ?? "",
      addressLine2: stored.addressLine2 ?? "",
      city: stored.city ?? "",
      state: stored.state as AddressLocationInput["state"] | undefined,
      pincode: stored.pincode ?? "",
      latitude: stored.latitude ?? "",
      longitude: stored.longitude ?? "",
    },
  });

  const lat = useWatch({ control, name: "latitude" });
  const lng = useWatch({ control, name: "longitude" });
  const hasPin =
    lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));

  const onSubmit = handleSubmit((data) => {
    setAddressLocation(data);
    navigate("/register-hospital/admin");
  });

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      enqueueSnackbar("Geolocation not supported by this browser.", {
        variant: "error",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", pos.coords.latitude.toFixed(4), {
          shouldValidate: true,
        });
        setValue("longitude", pos.coords.longitude.toFixed(4), {
          shouldValidate: true,
        });
      },
      (err) =>
        enqueueSnackbar(err.message || "Could not get location.", {
          variant: "error",
        }),
    );
  };

  const [searchInput, setSearchInput] = useState("");
  const [searchOptions, setSearchOptions] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = searchInput.trim();
    if (q.length < 3) {
      setSearchOptions([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=7&countrycodes=in`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Search failed");
        const data: NominatimResult[] = await res.json();
        if (!cancelled) setSearchOptions(data);
      } catch {
        if (!cancelled) setSearchOptions([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchInput]);

  const applySearchResult = (r: NominatimResult) => {
    setValue("latitude", parseFloat(r.lat).toFixed(6), { shouldValidate: true });
    setValue("longitude", parseFloat(r.lon).toFixed(6), { shouldValidate: true });
    const a = r.address ?? {};
    const line1 = [a.house_number, a.road].filter(Boolean).join(" ").trim() ||
      [a.suburb, a.neighbourhood].filter(Boolean).join(", ");
    if (line1) setValue("addressLine1", line1, { shouldValidate: true });
    const city = a.city ?? a.town ?? a.village;
    if (city) setValue("city", city, { shouldValidate: true });
    if (a.state && (INDIAN_STATES as readonly string[]).includes(a.state)) {
      setValue("state", a.state as AddressLocationInput["state"], {
        shouldValidate: true,
      });
    }
    if (a.postcode && /^\d{6}$/.test(a.postcode)) {
      setValue("pincode", a.postcode, { shouldValidate: true });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h1"
          sx={{ fontSize: 28, fontWeight: 600, color: "primary.main", mb: 0.5 }}
        >
          Register your hospital
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Help us locate your hospital.
        </Typography>
      </Box>

      <form onSubmit={onSubmit} noValidate>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <LocationOnIcon sx={{ color: "primary.main" }} />
          <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 600 }}>
            Address
          </Typography>
        </Box>

        <FieldLabel htmlFor="addressLine1" required>
          Address line 1
        </FieldLabel>
        <Controller
          name="addressLine1"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="addressLine1"
              placeholder="Building No, Street Name"
              error={!!errors.addressLine1}
              helperText={errors.addressLine1?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        <FieldLabel htmlFor="addressLine2">Address line 2</FieldLabel>
        <Controller
          name="addressLine2"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="addressLine2"
              placeholder="Apartment, Landmark (Optional)"
              sx={{ mb: 2 }}
            />
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <FieldLabel htmlFor="city" required>
              City
            </FieldLabel>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="city"
                  placeholder="e.g. Mumbai"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
          </div>
          <div>
            <FieldLabel htmlFor="state" required>
              State
            </FieldLabel>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={INDIAN_STATES as readonly string[]}
                  value={field.value ?? null}
                  onChange={(_, v) => field.onChange(v ?? "")}
                  onBlur={field.onBlur}
                  autoHighlight
                  renderInput={(p) => (
                    <TextField
                      {...p}
                      id="state"
                      placeholder="Search state"
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    />
                  )}
                />
              )}
            />
          </div>
          <div>
            <FieldLabel htmlFor="pincode" required>
              Pincode
            </FieldLabel>
            <Controller
              name="pincode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="pincode"
                  placeholder="6 digits"
                  inputProps={{ inputMode: "numeric", maxLength: 6 }}
                  error={!!errors.pincode}
                  helperText={errors.pincode?.message}
                />
              )}
            />
          </div>
        </div>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3, mb: 1.5 }}
        >
          <MapIcon sx={{ color: "primary.main" }} />
          <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 600 }}>
            Location
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FieldLabel>Search for your hospital location</FieldLabel>
          <Autocomplete
            freeSolo
            filterOptions={(x) => x}
            options={searchOptions}
            getOptionLabel={(o) => (typeof o === "string" ? o : o.display_name)}
            inputValue={searchInput}
            onInputChange={(_, v) => setSearchInput(v)}
            onChange={(_, v) => {
              if (v && typeof v !== "string") applySearchResult(v);
            }}
            loading={searching}
            noOptionsText={
              searchInput.length < 3
                ? "Type at least 3 characters"
                : "No matches"
            }
            renderOption={(props, option) => {
              const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & {
                key?: React.Key;
              };
              return (
                <Box
                  component="li"
                  key={key as React.Key}
                  {...rest}
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}
                >
                  <LocationOnIcon
                    sx={{ fontSize: 18, color: "primary.main", mt: 0.25 }}
                  />
                  <Typography sx={{ fontSize: 13, lineHeight: 1.4 }}>
                    {option.display_name}
                  </Typography>
                </Box>
              );
            }}
            renderInput={(p) => (
              <TextField
                {...p}
                placeholder="e.g. AIIMS Delhi, Sassoon Hospital Pune"
                helperText="Pick from suggestions to auto-fill address and coordinates."
                InputProps={{
                  ...p.InputProps,
                  startAdornment: (
                    <SearchIcon
                      fontSize="small"
                      sx={{ color: "text.secondary", mr: 0.5 }}
                    />
                  ),
                  endAdornment: (
                    <>
                      {searching ? <CircularProgress size={16} /> : null}
                      {p.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* lat/lng tracked in form state, set via search/GPS. Hidden from UI. */}
        <Controller name="latitude" control={control} render={({ field }) => <input type="hidden" {...field} />} />
        <Controller name="longitude" control={control} render={({ field }) => <input type="hidden" {...field} />} />

        <Box
          sx={{
            position: "relative",
            height: 280,
            mt: 2,
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "#EEF2F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasPin ? (
            <iframe
              key={`${lat},${lng}`}
              title="Map preview"
              src={(() => {
                const la = Number(lat);
                const lo = Number(lng);
                const d = 0.01;
                return `https://www.openstreetmap.org/export/embed.html?bbox=${lo - d}%2C${la - d}%2C${lo + d}%2C${la + d}&layer=mapnik&marker=${la}%2C${lo}`;
              })()}
              style={{ border: 0, width: "100%", height: "100%" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Map preview — enter coordinates to drop pin
            </Typography>
          )}
          <Button
            type="button"
            onClick={useMyLocation}
            startIcon={<MyLocationIcon fontSize="small" />}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "#FFFFFF",
              color: "primary.main",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 999,
              px: 2,
              zIndex: 1,
              "&:hover": { bgcolor: "#FFFFFF" },
            }}
            size="small"
          >
            Use my location
          </Button>
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
            onClick={() => navigate("/register-hospital")}
            sx={{ height: 44, px: 3, fontWeight: 600 }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ height: 44, px: 3, fontWeight: 600 }}
          >
            Next: Admin Contact
          </Button>
        </Box>
      </form>
    </Box>
  );
}
