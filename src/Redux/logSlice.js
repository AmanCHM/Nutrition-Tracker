import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  logged:false,
  signedup:true,
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
    },
     setSignup:(state)=>{
      state.signedup= true;
     },
     setSignout:(state)=>{
      state.signedup=false;
     }
  },
});

export const {loggedin,loggedout,setSignup,setSignout} =loggedSlice.actions;
export default loggedSlice.reducer;