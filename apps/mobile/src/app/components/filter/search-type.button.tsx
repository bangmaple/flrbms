import SearchTypeCheckBadge from './search-type.badge';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { Ref, useEffect, useState } from 'react';
import { BLACK, FPT_ORANGE_COLOR } from '@app/constants';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  addSearchType,
  removeSearchType,
} from '../../redux/features/feedback-search-filter';

const searchTypeBoxSelected = {
  color: FPT_ORANGE_COLOR,
  borderColor: FPT_ORANGE_COLOR,
};

const searchTypeBoxDeSelected = {
  borderColor: '#808080',
  color: BLACK,
}

interface SearchTypeFilterButtonProps {
  name: string;
  searchType: {
    checkedWidth: number;
    checkedHeight: number;
  };
  isSelected?: boolean;
  ref?: Ref<TouchableOpacity>;
}

const SearchTypeFilterButton: React.FC<SearchTypeFilterButtonProps> = (props) => {

  const [isSelected, setSelected] = useState<boolean>(props.isSelected);
  const [boxContainer, setBoxContainer] = useState<object>();

  const dispatch: AppDispatch = useDispatch();
  const searchType = useSelector((state: RootState) => state.feedbackSearchFilter.searchType);

  useEffect(() => {

    if (isSelected === true) {
      setBoxContainer(searchTypeBoxSelected);
    } else {
      setBoxContainer(searchTypeBoxDeSelected);
    }
  }, [isSelected]);

  const handleSearchTypeButtonSelected = () => {
    if (isSelected) {
      if (searchType.length < 2) {
        return;
      }
      dispatch(removeSearchType(props.name));
    } else {
      dispatch(addSearchType(props.name));

    }
    setSelected(!isSelected);

  }

  return (
    <TouchableOpacity onPress={() => handleSearchTypeButtonSelected()} ref={props.ref} style={{
    ...styles.searchTypeBox,
    ...props.searchType,
    ...boxContainer,
  }}>

    {isSelected ? <SearchTypeCheckBadge
      width={props.searchType.checkedWidth}
      height={props.searchType.checkedHeight}/> : null}
    <Text style={{
      ...styles.searchTypeText,
      ...boxContainer,
    }}>{props.name}</Text>
  </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchTypeBox: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTypeText: {
    fontSize: 16,
  },
});

export default SearchTypeFilterButton;
