import { useState } from "react";
import {
  Link as RouterLink,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import { useAuthStore } from "@/features/auth/store";
import { useSignOut } from "@/features/auth/api/useSignOut";
import { EmerhnetWordmark } from "@/shared/components/EmerhnetWordmark";
import {
  SUPER_ADMIN_NAV,
  HOSPITAL_ADMIN_NAV,
  type NavItem,
} from "@/shared/constants/nav";

const SIDEBAR_WIDTH = 264;
const TOPBAR_HEIGHT = 64;

function SidebarItem({ item }: { item: Extract<NavItem, { kind: "link" }> }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1.25,
            mx: 1.5,
            borderRadius: 1,
            color: isActive ? "primary.main" : "text.primary",
            bgcolor: isActive ? "#E8EEF5" : "transparent",
            fontWeight: isActive ? 600 : 500,
            cursor: "pointer",
            transition: "background 120ms",
            "&:hover": { bgcolor: isActive ? "#E8EEF5" : "#F2EEE6" },
            "&::before": isActive
              ? {
                  content: '""',
                  position: "absolute",
                  left: -12,
                  top: 6,
                  bottom: 6,
                  width: 3,
                  bgcolor: "primary.main",
                  borderRadius: 1,
                }
              : {},
          }}
        >
          <Icon
            sx={{
              fontSize: 20,
              color: isActive ? "primary.main" : "text.secondary",
            }}
          />
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: "inherit",
              flex: 1,
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </Typography>
        </Box>
      )}
    </NavLink>
  );
}

export function AppShell() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOutMutation = useSignOut();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const nav =
    user?.role === "superAdmin" ? SUPER_ADMIN_NAV : HOSPITAL_ADMIN_NAV;
  const roleLabel =
    user?.role === "superAdmin" ? "Super Admin" : "Hospital Admin";
  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const signOut = async () => {
    setMenuAnchor(null);
    await signOutMutation.mutateAsync();
    navigate("/sign-in");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAF7F2" }}>
      <Box
        component="aside"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            height: TOPBAR_HEIGHT,
            display: "flex",
            alignItems: "center",
            px: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <RouterLink to="/" style={{ textDecoration: "none" }}>
            <EmerhnetWordmark size={20} />
          </RouterLink>
        </Box>
        <Box sx={{ py: 2, flex: 1, overflowY: "auto" }}>
          {nav.map((item, i) =>
            item.kind === "divider" ? (
              <Divider key={`div-${i}`} sx={{ my: 1.5, mx: 2 }} />
            ) : (
              <SidebarItem key={item.to} item={item} />
            ),
          )}
        </Box>
      </Box>

      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: SIDEBAR_WIDTH,
          right: 0,
          height: TOPBAR_HEIGHT,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          zIndex: 1,
        }}
      >
        {user?.role === "hospitalAdmin" && (
          <Chip
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#0F5132",
                  }}
                />
                <Box component="span" sx={{ fontWeight: 600 }}>
                  General Hospital, Pune
                </Box>
                <Box component="span" sx={{ color: "text.secondary" }}>
                  · Approved
                </Box>
              </Box>
            }
            size="small"
            sx={{
              bgcolor: "#D1E7DD",
              color: "#0F5132",
              fontSize: 13,
              height: 28,
              borderRadius: 1,
              "& .MuiChip-label": { px: 1.25 },
            }}
          />
        )}
        <Box sx={{ flex: 1 }} />

        <IconButton aria-label="Notifications">
          <Badge badgeContent={3} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <Box
          sx={{
            width: 320,
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#F2EEE6",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 1.5,
            height: 38,
            "&:focus-within": {
              borderColor: "primary.main",
              bgcolor: "background.paper",
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          <InputBase
            placeholder="Search hospitals, doctors…"
            sx={{ flex: 1, fontSize: 14 }}
            inputProps={{ "aria-label": "Universal search" }}
          />
          <Typography
            component="kbd"
            sx={{
              fontSize: 11,
              color: "text.secondary",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 0.75,
              px: 0.75,
              py: 0.125,
              bgcolor: "background.paper",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            ⌘K
          </Typography>
        </Box>

        <Chip
          label={roleLabel}
          size="small"
          sx={{
            bgcolor: "#E8EEF5",
            color: "primary.main",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            borderRadius: 1,
            height: 22,
          }}
        />
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
          {user?.fullName ?? "Guest"}
        </Typography>
        <IconButton
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ display: "flex", alignItems: "center", gap: 0.5, p: 0.5 }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: 14,
            }}
          >
            {initials ?? "?"}
          </Avatar>
          <KeyboardArrowDownIcon
            sx={{ fontSize: 18, color: "text.secondary" }}
          />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={signOut}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Box>

      <Box
        component="main"
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          pt: `${TOPBAR_HEIGHT}px`,
          minHeight: "100vh",
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: "auto", px: 4, pt: 4, pb: 6 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
