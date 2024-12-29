import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  currentWeight: "",
  targetWeight: "",
  height: "",
  gender: "",
  age: "",
  activity: "",
  requiredCalorie: "",
  goal: "",
  waterIntake: "",
  showrecommendation: false,
};

const calorieGoalSlice = createSlice({
  name: "calorieGoal",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      const { userName, height, gender, age } = action.payload;
      state.userName = userName || state.userName;
      state.height = height || state.height;
      state.gender = gender || state.gender;
      state.age = age || state.age;
    },

    updateGoal: (state, action) => {
      const { currentWeight, targetWeight, goal } = action.payload;
      state.currentWeight = currentWeight || state.currentWeight;
      state.targetWeight = targetWeight || state.targetWeight;
      state.goal = goal || action.payload;
    },

    setActivityLevel: (state, action) => {
      state.activity = action.payload;
    },

    setRequiredCalorie: (state, action) => {
      state.requiredCalorie = action.payload;
    },
    openCalorieModal: (state) => {
      state.showrecommendation = true;
    },
    closeCalorieModal: (state) => {
      state.showrecommendation = false;
    },

    resetGoal: () => initialState,
  },
});

export const {
  setUserInfo,
  updateGoal,
  setActivityLevel,
  setRequiredCalorie,
  resetGoal,
  openCalorieModal,
  closeCalorieModal,
} = calorieGoalSlice.actions;
export default calorieGoalSlice.reducer;
