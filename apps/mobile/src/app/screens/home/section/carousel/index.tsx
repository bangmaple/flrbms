import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import HomeScreenSectionCarouselItem from './carousel-item';

const items = [
  {
    title: 'Item 1',
    text: 'Text 1',
  },
  {
    title: 'Item 2',
    text: 'Text 2',
  },
  {
    title: 'Item 3',
    text: 'Text 3',
  },
  {
    title: 'Item 4',
    text: 'Text 4',
  },
  {
    title: 'Item 5',
    text: 'Text 5',
  },
];
const itemWidth = 350;
const sliderWidth = 400;

const HomeScreenSectionCarousel: React.FC<any> = () => {
  const carousel = useRef<Carousel<any>>();

  return (
    <View style={styles.container}>
      <Carousel
        layout="stack"
        ref={carousel}
        data={items}
        renderItem={() => <HomeScreenSectionCarouselItem />}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        vertical={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default HomeScreenSectionCarousel;
