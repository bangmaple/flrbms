import React, {useEffect, useRef} from "react";
import {StyleSheet, View, Animated, Easing, Text, Vibration, TouchableOpacity, Pressable} from "react-native";
import {deviceHeight, deviceWidth} from "../utils/device";
import {CheckCircleIcon, XIcon} from "react-native-heroicons/outline";
import {BLACK, FPT_ORANGE_COLOR, GRAY, INPUT_GRAY_COLOR, LIGHT_GRAY} from "@app/constants";

const size = (opacity) => opacity.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 60]
});
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const NotificationModal: React.FC<any> = (props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const animate = () => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.in(Easing.exp),
      useNativeDriver: false,
    }).start();
    Vibration.vibrate();
  };

  useEffect(() => {
    animate();
  }, []);

  return (
      <Animated.View style={[styles.box,
        {
          opacity,
          height: size(opacity)
        }]}>
        <AnimatedTouchable onPress={() => {
        }}  style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginLeft: 10,
          flex: 1,
        }}>
          <View  style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
            <CheckCircleIcon size={deviceWidth / 14} color={FPT_ORANGE_COLOR}/>
            <Text style={{color: BLACK, fontSize: deviceWidth / 22, fontWeight: '600', marginLeft: 10,}}>
              Your feedback has been resolved
            </Text>
          </View>
        </AnimatedTouchable>
      </Animated.View>
  );

};
const styles = StyleSheet.create({
  box: {
    marginTop: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
    display: 'flex',
    elevation: 8,
    width: deviceWidth / 1.05,
    alignSelf: 'center',
    position: 'absolute',
    flex: 1,
  },
});
