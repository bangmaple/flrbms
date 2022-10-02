import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { deviceWidth } from '../../../../utils/device';

const HomeScreenSectionCarouselItem: React.FC<any> = () => {
  return (
    <View>
      <Image
        style={styles.carouselImage}
        source={require('../../../../../assets/library/tv3.jpeg')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselImage: {
    borderRadius: 8,
    height: deviceWidth / 1.65,
  },
});

export default HomeScreenSectionCarouselItem;
