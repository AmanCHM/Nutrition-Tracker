
import storage from 'redux-persist/lib/storage'; // Use localStorage
import { persistReducer, persistStore } from 'redux-persist';
import loggedReducer from './counterSlice';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, loggedReducer);

const store = configureStore({
  reducer: persistedReducer,
});



export { store };
