import { createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSpinnerOff, toggleSpinnerOn } from '../../spinner';
import axios from 'axios';
import { Slot } from '../../../../models/slot.model';

export const fetchSlotNames = createAsyncThunk<
  Slot[],
  void,
  {
    rejectValue: {
      message: string;
    };
  }
>('slot/fetch-slot-names', async (payload, thunkAPI) => {
  thunkAPI.dispatch(toggleSpinnerOn());
  try {
    const response = await axios.get('api/slots/name');
    // const result = await response.data.map((slot) => ({
    //   value: slot.id,
    //   label: slot.name,
    //   slotNum: slot.slotNum,
    //   timeStart: slot.timeStart,
    //   timeEnd: slot.timeEnd,
    // }));
    return await response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      message: e.response.data.message,
    });
  } finally {
    thunkAPI.dispatch(toggleSpinnerOff());
  }
});
