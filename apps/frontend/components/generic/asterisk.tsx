import React from "react";
import {createStyles} from "@mantine/core";


const Asterisk = () => {
  const {classes} = useStyles();


  return (
    <div className={classes.asterisk}>
      *
    </div>
  );
};

const useStyles = createStyles((theme) => ({
  asterisk: {
    color: 'red',
    marginLeft: 2,
    marginTop: -2,
  },
}));

export default Asterisk;
