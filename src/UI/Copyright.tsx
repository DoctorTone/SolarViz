import CopyrightIcon from "@mui/icons-material/Copyright";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";

const Copyright = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      {isMobile ? null : (
        <div id="copyright" className="panel">
          <Link
            href="https://www.drt-software.com/"
            underline="none"
            target="_blank"
            rel="noopener"
            aria-label="Go to DRT software main site"
          >
            <Typography variant="h6" sx={{ color: "orange", display: "flex" }}>
              <CopyrightIcon fontSize="large" sx={{ mr: 1 }} /> DRT Software
              Ltd. 2026
            </Typography>
          </Link>
        </div>
      )}
    </>
  );
};

export default Copyright;
