import { configureStore } from "@reduxjs/toolkit";
import mealReducer from "./counterSlice";


const store= configureStore({
    reducer:{
        meals:mealReducer,
    },
}
)

export default store;