import Copyright from "../UI/Copyright";
import ViewpointUI from "./ViewpointUI";
import Info from "./Info";
import MobileViewpointUI from "./MobileViewpointUI";
import { useMediaQuery } from "@mui/material";

const UI = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      <Copyright />
      {isMobile ? <MobileViewpointUI /> : <ViewpointUI />}
      <Info />
    </>
  );
};

export default UI;
