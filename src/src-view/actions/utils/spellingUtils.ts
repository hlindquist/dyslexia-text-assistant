import ChatGPTConversational from '../adapters/ChatGptConversational';
import SentenceCache from '../adapters/SentenceCache';
import { abstractCheckSpelling } from '../../functions/spellingFunctions';
import store from '../../redux/store';

export const checkSpelling = abstractCheckSpelling(
  new ChatGPTConversational(),
  store,
  console,
  SentenceCache
);
