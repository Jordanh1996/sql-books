import { ipcMain, IpcMainInvokeEvent, ipcRenderer } from 'electron';
import { exportDB } from './export/export-db';
import { importDB } from './export/import-db';
import { deleteBook } from './tables/book/queries/delete-book';
import { insertBooks, insertBooksWithIds } from './tables/book/queries/insert-books';
import { selectBooks } from './tables/book/queries/select-books';
import { createTables } from './tables/create-tables';
import { dropTables } from './tables/drop-tables';
import { insertGroupsWords, insertGroupWords } from './tables/group-word/queries/insert-group-words';
import { deleteGroup } from './tables/group/queries/delete-group';
import { insertGroup, insertGroups } from './tables/group/queries/insert-group';
import { selectGroups, selectGroupsWithWords } from './tables/group/queries/select-groups';
import { insertPhrasesWords, insertPhraseWords } from './tables/phrase-word/queries/insert-phrase-words';
import { deletePhrase } from './tables/phrase/queries/delete-phrase';
import { insertPhrase, insertPhrases } from './tables/phrase/queries/insert-phrase';
import { findPhrase, selectPhrases } from './tables/phrase/queries/select-phrases';
import { insertWordsAppearances } from './tables/word-appearance/queries/insert-words-appearances';
import { averageLetters, averageWords, countMaxColumn, countWords, selectWordsAppearances, selectWordsCount, sumLetters } from './tables/word-appearance/queries/select-words-appearances';
import { insertWords } from './tables/word/queries/insert-words';
import { selectWords } from './tables/word/queries/select-words';
import { upsertWords } from './tables/word/queries/upsert-words';
import { addBook } from './utils/add-book';
import { addGroup } from './utils/add-group';
import { addPhrase } from './utils/add-phrase';
import { avgTable } from './utils/avg-table';
import { countTable } from './utils/count-table';

export const queries = {
  // general
  avgTable,
  countTable,

  // DDL
  createTables,
  dropTables,

  // import / export
  importDB,
  exportDB,

  // book
  deleteBook,
  insertBooks,
  insertBooksWithIds,
  selectBooks,
  addBook,

  // word
  insertWords,
  selectWords,
  upsertWords,

  // word appearance
  insertWordsAppearances,
  selectWordsCount,
  selectWordsAppearances,
  countWords,
  countMaxColumn,
  averageWords,
  averageLetters,
  sumLetters,

  // group
  deleteGroup,
  insertGroup,
  insertGroups,
  selectGroupsWithWords,
  selectGroups,
  addGroup,
  insertGroupWords,
  insertGroupsWords,

  // phrase
  deletePhrase,
  insertPhrase,
  insertPhrases,
  selectPhrases,
  findPhrase,
  insertPhraseWords,
  insertPhrasesWords,
  addPhrase,
};

export const registerQueryHandlers = () => {
  for (const queryName in queries) {
    ipcMain.handle(`query:${queryName}`, async (event: IpcMainInvokeEvent, ...args: unknown[]) => {
      return await queries[queryName](...args);
    });
  }
};

const queryInvoker = (queryName: string) => (...args: unknown[]) => ipcRenderer.invoke(`query:${queryName}`, ...args);

export const wrapRendererQueries = () => {
  for (const queryName in queries) {
    queries[queryName] = queryInvoker(queryName);
  }
};
