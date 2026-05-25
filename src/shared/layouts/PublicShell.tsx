import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LanguageIcon from "@mui/icons-material/Language";
import { EmerhnetWordmark } from "../components/EmerhnetWordmark";

type PublicShellProps = {
  children: ReactNode;
  width?: 440 | 480 | 720;
  disableCardPadding?: boolean;
  showHeaderActions?: boolean;
  showGalasFooterLine?: boolean;
};

export function PublicShell({
  children,
  width = 440,
  showHeaderActions = false,
  showGalasFooterLine = false,
  disableCardPadding = false,
}: PublicShellProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState<HTMLElement | null>(null);
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-3 mb-6">
          <EmerhnetWordmark size={56} />
          {showHeaderActions && (
            <div className="flex items-center gap-1">
              <Tooltip title="Help & support">
                <IconButton
                  size="small"
                  onClick={() => setHelpOpen(true)}
                  aria-label="Help"
                >
                  <HelpOutlineIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Language">
                <IconButton
                  size="small"
                  onClick={(e) => setLangAnchor(e.currentTarget)}
                  aria-label="Language"
                >
                  <LanguageIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>

        <Box
          sx={{
            width: "100%",
            maxWidth: width,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
            p: disableCardPadding ? 0 : { xs: 2, sm: 3 },
            overflow: "hidden",
          }}
        >
          {children}
        </Box>

        {showGalasFooterLine && (
          <Typography variant="caption" sx={{ mt: 3, color: "text.secondary" }}>
            EMERHNET is a Galas platform.
          </Typography>
        )}
      </div>

      <footer className="pb-6 pt-2 text-center px-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-2">
          <Link
            href="#"
            underline="hover"
            variant="caption"
            color="text.secondary"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            underline="hover"
            variant="caption"
            color="text.secondary"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            underline="hover"
            variant="caption"
            color="text.secondary"
          >
            Support
          </Link>
        </div>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          © {currentYear} EMERHNET. Government of India Medical Portal. All
          rights reserved.
        </Typography>
      </footer>

      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Need help?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For account issues or technical support, contact{" "}
            <Link href="mailto:support@emerhnet.gov.in">
              support@emerhnet.gov.in
            </Link>{" "}
            or call 1800-XXX-XXXX (Mon–Fri, 9:00–18:00 IST).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={langAnchor}
        open={Boolean(langAnchor)}
        onClose={() => setLangAnchor(null)}
      >
        <MenuItem selected onClick={() => setLangAnchor(null)}>
          English
        </MenuItem>
        <MenuItem disabled>More languages coming soon</MenuItem>
      </Menu>
    </div>
  );
}
