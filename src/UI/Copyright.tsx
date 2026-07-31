import CopyrightIcon from "@mui/icons-material/Copyright";
import Typography from "@mui/material/Typography";

const Copyright = () => {
  return (
    <div id="copyright" className="panel">
      <Typography variant="h6" sx={{ color: "orange", display: "flex" }}>
        <CopyrightIcon fontSize="large" sx={{ mr: 1 }} /> DRT Software Ltd. 2025
      </Typography>
    </div>
  );
};

export default Copyright;
