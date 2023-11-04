import { describe, it, expect } from '@jest/globals';
import { ContentMessage } from '../../types/types';
import { checkApiKey, checkLanguage } from '../generalUtils';

describe('checking configuration functions', () => {
  it('should catch and handle checkApiKey errors with try...catch', () => {
    const contentMessage: ContentMessage = {
      text: 'Some text',
      language: '',
      apiKey: '',
    };

    try {
      checkApiKey(contentMessage.apiKey);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Missing API key');
    }
  });

  it('should catch and handle checkLanguage errors with try...catch', () => {
    const language = '';

    try {
      checkLanguage(language);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('No language specified');
    }
  });
});
