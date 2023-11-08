/* eslint-disable indent */
/*
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Author: Håkon Lindquist
 */

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  ChangeHistory,
  ChatConfiguration,
  Sentence,
  TextAssistantState,
} from '../../types/types';

const initialState: TextAssistantState = {
  text: undefined,
  chatConfiguration: {
    apiKey: '',
    language: '',
  },
  charPosition: undefined,
  sentences: [],
  sentencesNeedingCorrection: [],
  incompleteSentence: '',
  debug: [],
};

const textAssistantSlice = createSlice({
  name: 'textAssistant',
  initialState: initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        text: action.payload,
      };
    },
    setChatConfiguration: (state, action: PayloadAction<ChatConfiguration>) => {
      return {
        ...state,
        chatConfiguration: action.payload,
      };
    },
    setCharPosition: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        charPosition: action.payload,
      };
    },
    addToDebugHistory: (state, action: PayloadAction<ChangeHistory>) => {
      return {
        ...state,
        debug: state.debug.concat(action.payload).slice(0, 20),
      };
    },
    setSentences: (state, action: PayloadAction<Sentence[]>) => {
      return {
        ...state,
        sentences: action.payload,
      };
    },
    updateSentence: (state, action: PayloadAction<Sentence>) => {
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
    updateSentences: (state, action: PayloadAction<Sentence[]>) => {
      return {
        ...state,
        sentences: state.sentences.map((sentence) => {
          const updatedSentence = action.payload.find(
            (updated) => updated.hash === sentence.hash
          );
          return updatedSentence || sentence;
        }),
      };
    },
    setIncompleteSentence: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        incompleteSentence: action.payload,
      };
    },
    addSentencesNeedingCorrection: (
      state,
      action: PayloadAction<Sentence[]>
    ) => {
      const newSentencesNeedingCorrection = action.payload.filter(
        (newSentence: Sentence) =>
          state.sentencesNeedingCorrection.find(
            (existingSentence: Sentence) =>
              existingSentence.hash === newSentence.hash
          ) === undefined
      );
      return {
        ...state,
        sentencesNeedingCorrection: state.sentencesNeedingCorrection.concat(
          newSentencesNeedingCorrection
        ),
      };
    },
    removeSentenceNeedingCorrection: (
      state,
      action: PayloadAction<Sentence>
    ) => {
      return {
        ...state,
        sentencesNeedingCorrection: state.sentencesNeedingCorrection.filter(
          (sentence) => sentence.hash !== action.payload.hash
        ),
      };
    },
    updateNeedingCorrection: (state, action: PayloadAction<Sentence[]>) => {
      return {
        ...state,
        sentencesNeedingCorrection: state.sentencesNeedingCorrection.map(
          (sentence) => {
            const updatedSentence = action.payload.find(
              (updated) => updated.hash === sentence.hash
            );
            return updatedSentence || sentence;
          }
        ),
      };
    },
  },
});

export const {
  setText,
  setChatConfiguration,
  setCharPosition,
  addToDebugHistory,
  setSentences,
  updateSentences,
  updateSentence,
  setIncompleteSentence,
  addSentencesNeedingCorrection,
  removeSentenceNeedingCorrection,
  updateNeedingCorrection,
} = textAssistantSlice.actions;

export const selectText = (state: { textAssistant: TextAssistantState }) =>
  state.textAssistant.text;
export const selectChatConfiguration = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.chatConfiguration;
export const selectCharPosition = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.charPosition;
export const selectSentences = (state: { textAssistant: TextAssistantState }) =>
  state.textAssistant.sentences;
export const selectIncompleteSentence = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.incompleteSentence;
export const selectSentencesNeedingCorrection = (state: {
  textAssistant: TextAssistantState;
}) => state.textAssistant.sentencesNeedingCorrection;

const textAssistantReducer = textAssistantSlice.reducer;

export default textAssistantReducer;
