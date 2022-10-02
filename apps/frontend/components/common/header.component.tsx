import React, { ReactNode } from 'react';
import { createStyles, Text } from '@mantine/core';

interface HeaderProps {
  title: string;
  icon: ReactNode;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      {props.icon}
      <Text className={classes.text}>{props.title}</Text>
    </div>
  );
};

const useStyles = createStyles({
  text: {
    marginLeft: 10,
    fontWeight: 600,
    fontSize: 30,
  },
  container: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default Header;
