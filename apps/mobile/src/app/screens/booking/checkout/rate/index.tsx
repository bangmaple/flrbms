import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { StarIcon as OutlineStarIcon } from 'react-native-heroicons/outline';
import { StarIcon as SolidStarIcon } from 'react-native-heroicons/solid';

import { deviceWidth } from '../../../../utils/device';
import { FPT_ORANGE_COLOR, GRAY } from '@app/constants';

interface StarRatingProps {
  rating: number;

  setRating(val: number): void;
}

const StarRating: React.FC<StarRatingProps> = (props) => {
  return (
    <>
      {props.rating >= 1
        ? <TouchableOpacity onPress={() => props.setRating(1)}>
          <SolidStarIcon size={deviceWidth / 10} color={FPT_ORANGE_COLOR} />
        </TouchableOpacity>
        : <TouchableOpacity onPress={() => props.setRating(1)}>
          <OutlineStarIcon size={deviceWidth / 10} color={GRAY} />
        </TouchableOpacity>}
      {props.rating >= 2
        ? <TouchableOpacity onPress={() => props.setRating(2)}>
          <SolidStarIcon size={deviceWidth / 10} color={FPT_ORANGE_COLOR} />
        </TouchableOpacity>
        : <TouchableOpacity onPress={() => props.setRating(2)}>
          <OutlineStarIcon size={deviceWidth / 10} color={GRAY} />
        </TouchableOpacity>}
      {props.rating >= 3
        ? <TouchableOpacity onPress={() => props.setRating(3)}>
          <SolidStarIcon size={deviceWidth / 10} color={FPT_ORANGE_COLOR} />
        </TouchableOpacity>
        : <TouchableOpacity onPress={() => props.setRating(3)}>
          <OutlineStarIcon size={deviceWidth / 10} color={GRAY} />
        </TouchableOpacity>}
      {props.rating >= 4
        ? <TouchableOpacity onPress={() => props.setRating(4)}>
          <SolidStarIcon size={deviceWidth / 10} color={FPT_ORANGE_COLOR} />
        </TouchableOpacity>
        : <TouchableOpacity onPress={() => props.setRating(4)}>
          <OutlineStarIcon size={deviceWidth / 10} color={GRAY} />
        </TouchableOpacity>}
      {props.rating === 5
        ? <TouchableOpacity onPress={() => props.setRating(5)}>
          <SolidStarIcon size={deviceWidth / 10} color={FPT_ORANGE_COLOR} />
        </TouchableOpacity>
        : <TouchableOpacity onPress={() => props.setRating(5)}>
          <OutlineStarIcon size={deviceWidth / 10} color={GRAY} />
        </TouchableOpacity>}
    </>
  );
};

const styles = StyleSheet.create({});

export default StarRating;
