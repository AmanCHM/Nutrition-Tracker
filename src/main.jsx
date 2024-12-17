import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import { Provider } from 'react-redux';

// import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './Redux/store.js';
import persistStore from 'redux-persist/es/persistStore';


const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate 
        persistor={persistor} 
        // loading={<div>Loading...</div>}
      >
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
