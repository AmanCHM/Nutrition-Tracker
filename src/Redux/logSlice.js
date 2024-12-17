import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  logged:false,
};
const loggedSlice = createSlice({
  name: "logged",
  initialState,
  reducers: {
    loggedin: (state, action) => {
      state.logged =true;
           
    },
    loggedout:(state,action )=>{
          state.logged=false;
    }
  },
});

export const {loggedin,loggedout} =loggedSlice.actions;
export default loggedSlice.reducer;