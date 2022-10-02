import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FPT_ORANGE_COLOR } from '@app/constants';

export const Spinner: React.FC = () => {
  const [dot1, setDot1] = useState(styles.dotBig);
  const [dot2, setDot2] = useState(styles.dotSmall);
  const [dot3, setDot3] = useState(styles.dotSmall);

  const [dot1Active, setDot1Active] = useState<boolean>(true);
  const [dot2Active, setDot2Active] = useState<boolean>(false);
  const [dot3Active, setDot3Active] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!dot1Active) {
        setDot1({
          width: 10,
          height: 10,
        });
      }
      if (!dot2Active) {
        setDot2({
          width: 10,
          height: 10,
        });
      }
      if (!dot3Active) {
        setDot3({
          width: 10,
          height: 10,
        });
      }
      if (dot3Active) {
        setDot3({
          width: 20,
          height: 20,
        });
        setDot3Active(false);
        setDot1Active(true);
      }

      if (dot2Active) {
        setDot2({
          width: 20,
          height: 20,
        });
        setDot2Active(false);
        setDot3Active(true);
      }

      if (dot1Active) {
        setDot1({
          width: 20,
          height: 20,
        });
        setDot1Active(false);
        setDot2Active(true);
      }
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, [dot1Active, dot2Active, dot3Active]);

  return (
    <View style={[styles.spinner]}>
      <View style={[styles.dotContainer]}>
        <View style={[styles.dot, dot1]}></View>
        <View style={[styles.dot, dot2]}></View>
        <View style={[styles.dot, dot3]}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dotContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    margin: 5,
    borderRadius: 50,
    backgroundColor: FPT_ORANGE_COLOR,
  },
  dotSmall: {
    width: 10,
    height: 10,
  },
  dotBig: {
    width: 20,
    height: 20
  }
})
