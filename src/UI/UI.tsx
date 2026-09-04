import Copyright from "../UI/Copyright";
import ViewpointUI from "./ViewpointUI";
import Info from "./Info";
import MobilePortraitUI from "./MobilePortraitUI";
import MobileLandscapeUI from "./MobileLandscapeUI";
import { useMediaQuery } from "@mui/material";

const UI = () => {
  const isPhonePortrait = useMediaQuery(
    "(max-width: 1024px) and (orientation: portrait)",
  );
  const isPhoneLandscape = useMediaQuery(
    "(orientation: landscape) and (max-height: 500px)",
  );

  return (
    <>
      <Info />
      {isPhonePortrait ? (
        <MobilePortraitUI />
      ) : isPhoneLandscape ? (
        <MobileLandscapeUI />
      ) : (
        <>
          <ViewpointUI />
          <Copyright />
        </>
      )}
    </>
  );
};

export default UI;
