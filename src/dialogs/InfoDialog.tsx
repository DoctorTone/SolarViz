import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import useSolar from "../state/store";

const InfoDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const infoDialogOpen = useSolar((state) => state.infoDialogOpen);
  const setShowInfoDialog = useSolar((state) => state.setShowInfoDialog);

  const handleClose = () => {
    setDialogOpen(false);
    setShowInfoDialog(false);
  };

  useEffect(() => {
    setDialogOpen(infoDialogOpen ? true : false);
  }, [infoDialogOpen]);

  return (
    <>
      <Dialog
        onClose={handleClose}
        open={dialogOpen}
        maxWidth={"md"}
        fullWidth={true}
        slotProps={{
          paper: {
            sx: {
              opacity: 0.75,
              backgroundColor: "#222222",
              color: "#cccccc",
              borderRadius: "30px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{ textAlign: "center", pb: 0, mb: 3, color: "orange" }}
        >
          Solar Farm Visualisation
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            This is an interactive visualisation of the consented Springwell
            Solar Farm, a Nationally Significant Infrastructure Project in
            Lincolnshire (DCO refereence EN010149). It reproduces the
            assessment's surveyed viewpoints, showing the development and its
            screening from construction through to year ten.
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Terrain is from Environment Agency LIDAR; viewpoints, panel
            specifications and planting positions are taken from the submitted
            application documents. Existing vegetation is shown as it is now;
            new and strengthened hedgerows grow to their 3.5m maintained height
            over the ten-year period assessed, with reduced screening shown in
            winter.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            This is a demonstration, not a verified photomontage. Where planting
            is shown only indicatively, hedgerows are placed within field
            margins, and heights are representative. It shows every state as
            accurately as possible, including the least-screened views, and is
            intended to be equally useful to applicants, authorities and the
            public.
          </Typography>
          <Typography variant="h6">
            Created by{" "}
            <Link
              href="https://www.drt-software.com/"
              target="_blank"
              rel="noreferrer noopener"
              underline="none"
              aria-label="Go to DRT software main site"
              color="orange"
            >
              DRT Software Ltd
            </Link>{" "}
            2026.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="warning"
            onClick={handleClose}
            sx={{ mr: 1, mb: 1 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoDialog;
