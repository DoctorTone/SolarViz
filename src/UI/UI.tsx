import Copyright from "../UI/Copyright";
import ViewpointUI from "./ViewpointUI";
import MobileViewpointBar from "../components/MobileViewpointBar";
import Info from "./Info";
import { useMediaQuery } from "@mui/material";

const UI = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      <Copyright />
      {isMobile ? <MobileViewpointBar /> : <ViewpointUI />}
      <Info />
    </>
  );
};

export default UI;
