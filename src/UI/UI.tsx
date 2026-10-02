import { useEffect } from "react";
import Copyright from "../UI/Copyright";
import ViewpointUI from "./ViewpointUI";
import Info from "./Info";
import MobilePortraitUI from "./MobilePortraitUI";
import MobileLandscapeUI from "./MobileLandscapeUI";
import { useMediaQuery } from "@mui/material";
import useSolar from "../state/store";

const UI = () => {
  const isPhonePortrait = useMediaQuery(
    "(max-width: 1024px) and (orientation: portrait)",
  );
  const isPhoneLandscape = useMediaQuery(
    "(orientation: landscape) and (max-height: 500px)",
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "h") {
        useSolar.getState().toggleUI();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
