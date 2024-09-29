import { LRUCache } from 'lru-cache';
import { CorrectionParams, Sentence, Spellchecker } from '../../../types/types';

const sentenceCache = new LRUCache<string, Sentence>({ max: 5000 });

const cacheKey = (text: string, language: string) => `${text}-${language}`;

class CacheableSpellchecker implements Spellchecker {
  spellchecker;

  constructor(spellchecker: Spellchecker) {
    this.spellchecker = spellchecker;
  }

  correct = async (
    params: CorrectionParams
  ): Promise<[undefined, Sentence] | [Error, undefined]> => {
    const { language, sentence } = params;

    const key = cacheKey(sentence.original, language);

    const cachedSentence = sentenceCache.get(key);
    if (cachedSentence) {
      return Promise.resolve([undefined, cachedSentence]);
    } else {
      const [error, corrected] = await this.spellchecker.correct(params);

      if (corrected) {
        sentenceCache.set(key, corrected);
      }

      return Promise.resolve([error, corrected]);
    }
  };
}

export default CacheableSpellchecker;
