import React from 'react';
import Image from 'next/image';
import { createStyles, Text } from '@mantine/core';
import { FPT_ORANGE_COLOR } from '@app/constants';

const Logo: React.FC = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Image alt="FPTU Logo" src="/logo.svg" height={75} width={75} />
      <Text className={classes.text}>FLRBMS</Text>
    </div>
  );
};

const useStyles = createStyles((theme, context) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontWeight: 'bold',
      color: FPT_ORANGE_COLOR,
      fontSize: 26,
      fontFamily: 'monospace',
      marginTop: -10,
    },
  };
});

export default Logo;
