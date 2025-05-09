import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import userReducer from './reducers/userSlice'

// Create the logger middleware
const logger = createLogger({
  // You can customize logger options here
  collapsed: true,
  diff: true,
  logStateLevel: 'info',
  stateTransformer: (state) => state
});

const store = configureStore({
    reducer: {
      user: userReducer
    },
    // Add middleware with logger
    middleware: (getDefaultMiddleware) => 
      import.meta.env.NODE_ENV !== 'production' 
        ? getDefaultMiddleware().concat(logger)
        : getDefaultMiddleware(),
    // Add devTools configuration for development
    devTools: import.meta.env.NODE_ENV !== 'production'
});

export default store;
