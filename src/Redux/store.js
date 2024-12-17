
import storage from 'redux-persist/lib/storage'; // Use localStorage
import { persistReducer, persistStore } from 'redux-persist';
import loggedReducer from './logSlice';
import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from "./loaderSlice";
import { foodApi } from "./foodApiSlice";
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, loggedReducer);

const store = configureStore({
  reducer: persistedReducer,
  loader: loaderReducer,

  reducer: {
    [foodApi.reducerPath]: foodApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(foodApi.middleware),
});



export { store };
