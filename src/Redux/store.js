
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import loggedReducer from './logSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import loaderReducer from "./loaderSlice";
import waterReducer from './waterSlice'
import { foodApi } from "./foodApiSlice";
import calorieGoalReducer from "./calorieGoalSlice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [ 'loggedReducer' ]
};

const reducers = combineReducers({
  loggedReducer,
  loaderReducer,
  calorieGoalReducer,
  waterReducer,
  [foodApi.reducerPath]: foodApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({

  reducer:persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(

      {
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }
    ).concat(foodApi.middleware),

});



export { store };
