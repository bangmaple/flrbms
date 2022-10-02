import { createSlice } from '@reduxjs/toolkit';

interface FeedbackSearchFilterState {
  search: string;
  searchType: string[];
}

const feedbackSearchFilterInitialState: FeedbackSearchFilterState = {
  search: '',
  searchType: ['All'],
};

export const feedbackSearchFilterSlice = createSlice({
  name: 'feedbackSearchFilter',
  initialState: feedbackSearchFilterInitialState,
  reducers: {
    addSearchType: (state, action) => {
      for (const searchType in state.searchType) {
        if (searchType === action.payload) {
          return;
        }
      }
      state.searchType.push(action.payload);
    },
    removeSearchType: (state, action) => {
      state.searchType = state.searchType.filter(
        (searchType) => action.payload !== searchType
      );
    },
    removeSearchTypeAll: (state) => {
      state.searchType = state.searchType.filter(
        (searchType) => 'All' !== searchType
      );
    },
  },
});

export const feedbackSearchFilterReducer = feedbackSearchFilterSlice.reducer;
export const { addSearchType, removeSearchType, removeSearchTypeAll } =
  feedbackSearchFilterSlice.actions;
