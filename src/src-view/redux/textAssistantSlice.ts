import { createSlice } from '@reduxjs/toolkit';
import { TextAssistantState } from '../../types/types';

const initialState: TextAssistantState = {
  openAiApiKey: undefined,
  language: undefined,
  text: undefined,
  charPosition: undefined,
  spellingSection: undefined,
  originalHtml: undefined,
  correctedHtml: undefined,
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
  },
});

export const { setState, setCharPosition, setOriginalHtml, setCorrectedHtml } =
  textAssistantSlice.actions;

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
export const selectSpellingSection = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.spellingSection;
export const selectOriginalHtml = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.originalHtml;
export const selectCorrectedHtml = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.correctedHtml;

const textAssistantReducer = textAssistantSlice.reducer;

export default textAssistantReducer;
