import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  water: 0,
  alcohol: 0,
  caffeine: 0 , 
};

const waterSlice = createSlice({
  name: "water",
  initialState,
  reducers: {
    setWater(state, action) {
      state.water +=  action.payload;
    },
    setAlcohol(state, action) {
      state.alcohol += action.payload;
    },
    setCaffeine(state, action) {
      state.caffeine += action.payload;
    },
    resetIntake(state) {
      state.water = "";
      state.alcohol = "";
      state.caffeine = "";
    },
  },
});

export const { setWater, setAlcohol, setCaffeine, resetIntake } = waterSlice.actions;
export default waterSlice.reducer;
