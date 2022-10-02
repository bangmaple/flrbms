import React from "react";
import {createStyles} from "@mantine/core";


const renderDividerText = (num: number) => {
  let result = "";
  for (let i = 0; i < num; i++) {
    result += "_";
  }
  return result;
}

interface DividerProps {
  num: number;
};



const Divider = ({num}: DividerProps )=> {
  const {classes} = useStyles();


  return (
    <div className={classes.dividerContainer}>
      <div className={classes.dividerText}>
        {renderDividerText(num)}
      </div>
    </div>
  );
};

const useStyles = createStyles((theme) => ({
  dividerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerText: {
    color: 'rgba(209, 209, 209, 1)'
  },
}));

export default Divider;
