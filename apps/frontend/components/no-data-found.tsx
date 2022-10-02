import React from 'react';
import Image from 'next/image';
import { createStyles, Text } from '@mantine/core';

const NoDataFound: React.FC = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Image
        src="/undraw/no-data.svg"
        layout="fixed"
        height={300}
        width={300}
      />
      <Text className={classes.text}>
        No data found!
        <br />
        Please come back later!
      </Text>
    </div>
  );
};

const useStyles = createStyles({
  container: {
    margin: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 600,
    fontSize: 30,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default NoDataFound;
