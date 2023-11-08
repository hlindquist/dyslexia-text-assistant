import hash from 'object-hash';

import { Sentence, SentenceCacher } from '../../types/types';

export const transformToSentenceObjects = (sentences: string[]): Sentence[] =>
  sentences.map((sentence) => ({
    hash: hash(sentence, { algorithm: 'md5' }),
    original: sentence,
  }));

export const updateSentencesFromCache = (
  sentences: Sentence[],
  cache: SentenceCacher
): Sentence[] =>
  sentences.map((sentence) => {
    const cachedSentence = cache.get(sentence.hash);
    return cachedSentence || sentence;
  });

export const markUncorrectedForCorrection = (
  sentences: Sentence[]
): Sentence[] =>
  sentences.map((sentence) => {
    return !sentence.corrected
      ? {
          ...sentence,
          needsCorrection: true,
        }
      : sentence;
  });

export const findNeedsCorrection = (sentences: Sentence[]) =>
  sentences.filter((sentence: Sentence) => sentence.needsCorrection);
