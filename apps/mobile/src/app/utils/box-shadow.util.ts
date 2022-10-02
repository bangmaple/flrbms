import { Platform } from 'react-native';

export const generateBoxShadowStyle = (
  styles,
  xOffset,
  yOffset,
  shadowColorIos,
  shadowOpacity,
  shadowRadius,
  elevation,
  shadowColorAndroid
) => {
  if (Platform.OS === 'ios') {
    return (styles.boxShadow = {
      shadowColor: shadowColorIos,
      shadowOffset: { width: xOffset, height: yOffset },
      shadowOpacity,
      shadowRadius,
    });
  } else if (Platform.OS === 'android') {
    return (styles.boxShadow = {
      elevation,
      shadowColor: shadowColorAndroid,
    });
  }
};

export const boxShadow = (styles) =>
  generateBoxShadowStyle(styles, -2, 4, '#171717', 0.2, 3, 4, '#171717');
