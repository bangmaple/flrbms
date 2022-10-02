import {createStyles, Loader} from "@mantine/core";
import React from "react";
import {useAppSelector} from "../../redux/hooks";

const useStyles = createStyles({
  spinner: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    opacity: 0.8,
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  innerSpinner: {
    fontSize: 10,
  }
});

const Spinner: React.FC = () => {
  const isSpinnerEnabled = useAppSelector((state) => state.spinner.isEnabled);
  const {classes} = useStyles();

  return (
    isSpinnerEnabled ?
    <div className={classes.spinner}>
      <Loader color="orange" size="xl" variant="dots" />
    </div> : null
  );
};

export default Spinner;
