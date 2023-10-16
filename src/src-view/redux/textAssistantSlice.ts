import { createSlice } from '@reduxjs/toolkit';
import { TextAssistantState } from '../../types/types';

const initialState: TextAssistantState = {
  text: undefined,
  charPosition: undefined,
  sentences: [],
  incompleteSentence: '',
  debug: [],
};

const textAssistantSlice = createSlice({
  name: 'textAssistant',
  initialState: initialState,
  reducers: {
    setText: (state, action) => {
      return {
        ...state,
        text: action.payload,
      };
    },
    setCharPosition: (state, action) => {
      return {
        ...state,
        charPosition: action.payload,
      };
    },
    addToDebugHistory: (state, action) => {
      return {
        ...state,
        debug: state.debug.concat([action.payload]).slice(0, 20),
      };
    },
    setSentences: (state, action) => {
      return {
        ...state,
        sentences: action.payload,
      };
    },
    updateSentence: (state, action) => {
      return {
        ...state,
        sentences: state.sentences.map((sentence) => {
          if (sentence.hash === action.payload.hash) {
            return action.payload;
          } else {
            return sentence;
          }
        }),
      };
    },
    setIncompleteSentence: (state, action) => {
      return {
        ...state,
        incompleteSentence: action.payload,
      };
    },
  },
});

export const {
  setText,
  setCharPosition,
  addToDebugHistory,
  setSentences,
  updateSentence,
  setIncompleteSentence,
} = textAssistantSlice.actions;

export const selectText = (state: { textAssistant: TextAssistantState }) =>
  state.textAssistant.text;
export const selectCharPosition = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.charPosition;
export const selectSentences = (state: { textAssistant: TextAssistantState }) =>
  state.textAssistant.sentences;
export const selectIncompleteSentence = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.incompleteSentence;

const textAssistantReducer = textAssistantSlice.reducer;

export default textAssistantReducer;
