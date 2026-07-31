import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoDialog from "../dialogs/InfoDialog";
import Typography from "@mui/material/Typography";
import useStore from "../state/store";

const Info = () => {
  const setShowInfoDialog = useStore((state) => state.setShowInfoDialog);

  return (
    <>
      <div id="info" className="panel">
        <IconButton onClick={() => setShowInfoDialog(true)}>
          <Typography variant="h6" sx={{ color: "orange" }}>
            <InfoOutlinedIcon fontSize={"large"} />
          </Typography>
        </IconButton>
      </div>
      <InfoDialog />
    </>
  );
};

export default Info;
