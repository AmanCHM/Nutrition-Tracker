
import storage from 'redux-persist/lib/storage'; // Use localStorage
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import loggedReducer from './logSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import loaderReducer from "./loaderSlice";
import { foodApi } from "./foodApiSlice";
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [ 'loggedReducer' ]
};

const reducers = combineReducers({
  loggedReducer,
  loaderReducer,
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
