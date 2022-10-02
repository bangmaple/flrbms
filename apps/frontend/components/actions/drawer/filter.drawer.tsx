import React from 'react';
import {  createStyles, Drawer } from '@mantine/core';

interface FilterProps {
  isShown: boolean;
  toggleShown(): void;
}

const Filter: React.FC<FilterProps> = (props) => {
  const { classes } = useStyles();

  return (
    <Drawer
      opened={props.isShown}
      position="right"
      onClose={() => props.toggleShown()}
      closeOnClickOutside={true}
      closeOnEscape={true}
      overlayColor="#f2f2f2"
      overlayOpacity={0.55}
      overlayBlur={3}
      size={400}
    >
      <div className={classes.container}></div>
    </Drawer>
  );
};

const useStyles = createStyles(() => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '92%',
      margin: 10,
    },
  };
});

export default Filter;
