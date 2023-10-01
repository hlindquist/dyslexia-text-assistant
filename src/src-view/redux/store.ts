import { configureStore } from '@reduxjs/toolkit';
import textAssistantReducer from './textAssistantSlice';

const store = configureStore({
  reducer: {
    textAssistant: textAssistantReducer,
  },
});

export default store;
