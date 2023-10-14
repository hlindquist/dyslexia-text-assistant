import { createSlice } from '@reduxjs/toolkit';
import { TextAssistantState } from '../../types/types';

const initialState: TextAssistantState = {
  openAiApiKey: undefined,
  language: undefined,
  text: undefined,
  charPosition: undefined,
  originalTokens: undefined,
  correctedTokens: undefined,
  debug: [],
};

const textAssistantSlice = createSlice({
  name: 'textAssistant',
  initialState: initialState,
  reducers: {
    setState: (_, action) => {
      return {
        ...action.payload,
      };
    },
    setOriginalHtml: (state, action) => {
      return {
        ...state,
        originalHtml: action.payload,
      };
    },
    setCorrectedHtml: (state, action) => {
      return {
        ...state,
        correctedHtml: action.payload,
      };
    },
    setCharPosition: (state, action) => {
      return {
        ...state,
        charPosition: action.payload,
      };
    },
    addToHistory: (state, action) => {
      return {
        ...state,
        debug: state.debug.concat([action.payload]).slice(0, 20),
      };
    },
  },
});

export const {
  setState,
  setCharPosition,
  setOriginalHtml,
  setCorrectedHtml,
  addToHistory,
} = textAssistantSlice.actions;

export const selectOpenAiApiKey = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.openAiApiKey;
export const selectLanguage = (state: { textAssistant: TextAssistantState }) =>
  state.textAssistant.language;
export const selectText = (state: { textAssistant: TextAssistantState }) =>
  state.textAssistant.text;
export const selectCharPosition = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.charPosition;
export const selectOriginalTokens = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.originalTokens;
export const selectCorrectedTokens = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.correctedTokens;

const textAssistantReducer = textAssistantSlice.reducer;

export default textAssistantReducer;
