import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snack: [],
  totalCalories: 0,
};
const mealSlice = createSlice({
  name: "track-calorie",
  initialState,
  reducers: {
    addMeal: (state, action) => {
      const { mealCategory, name, quantity, calories } = action.payload;

      const newMeal = { name, quantity, calories: Math.floor(calories) };

      if (mealCategory === "Breakfast") {
        state.breakfast.push(newMeal);
      } else if (mealCategory === "Dinner") {
        state.dinner.push(newMeal);
      } else if (mealCategory === "Snack") {
        state.snack.push(newMeal);
      } else if (mealCategory === "Lunch") {
        state.lunch.push(newMeal);
      }

      state.totalCalories =
        state.breakfast.reduce((total, item) => total + item.calories, 0) +
        state.lunch.reduce((total, item) => total + item.calories, 0) +
        state.dinner.reduce((total, item) => total + item.calories, 0) +
        state.snack.reduce((total, item) => total + item.calories, 0);
    },

    resetMeals: (state) => {
      state.breakfast = [];
      state.lunch = [];
      state.dinner = [];
      state.snack = [];
      state.totalCalories = 0;
    },
  },
});

export const {addMeal,resetMeals} =mealSlice.actions;
export default mealSlice.reducer;