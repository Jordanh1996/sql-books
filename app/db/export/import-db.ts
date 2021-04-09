import { promises as fs } from 'fs';
import { parseStringPromise } from 'xml2js';
import _ from 'lodash';
import { connection } from '../connection';
import { queries } from '../queries';

interface XMLTree {
  book_db: {
    books: [{
      book: Array<{
        $: { id: string };
        author: [string];
        content: [{
          word_appearance: Array<{
            index: [string];
            line: [string];
            offset: [string];
            paragraph: [string];
            sentence: [string];
            word: [{ $: { refid: string } }];
          }>;
        }];
        file_path: [string];
        release_date: [string];
        title: [string];
      }>;
    }];
    groups: [{
      group: Array<{
        $: { id: string };
        group_words: [{
          word: Array<{ $: { refid: string } }>;
        }];
        name: [string];
      }>
    }];
    phrases: [{
      phrase: Array<{
        $: { id: string };
        phrase_words: [{
          phrase_word: Array<{
            word: [{ $: { refid: string }}];
            word_index: [string];
          }>;
        }];
      }>;
    }];
    words: [{
      word: Array<{
        _: string;
        $: { id: string };
      }>;
    }];
  };
}

interface Tree {
  book_db: {
    books: Array<{
      book_id: number;
      author: string;
      file_path: string;
      release_date: Date;
      title: string;
      content: Array<{
        index: number;
        line: number;
        offset: number;
        paragraph: number;
        sentence: number;
        word_id: number;
      }>;
    }>;
    groups: Array<{
      group_id: number;
      group_words: number[];
      name: string;
    }>;
    phrases: Array<{
      phrase_id: number;
      phrase_words: Array<{
        word_index: number;
        word_id: number;
      }>
    }>;
    words: Array<{
      word: string;
      word_id: number;
    }>;
  }
}

export const importDB = async (path = __dirname + '/db.xml') => {
  const xml = await fs.readFile(path, 'utf-8');
  const tree = await parseStringPromise(xml);

  try {
    await connection.query('BEGIN');

    await importWords(tree);
    await importBooks(tree);
    await importGroups(tree);
    await importPhrases(tree);
    await updateSerialIds();
    await connection.query('COMMIT');
  } catch(err) {
    await connection.query('ROLLBACK');
    throw err;
  }
};

const normalizeWords = (tree: XMLTree) => {
  return tree.book_db.words[0].word.map(({ _: word, $: { id: word_id }}) => ({
    word,
    word_id: parseInt(word_id),
  }));
};

const importWords = async (tree: XMLTree) => {
  const normalizedWords = normalizeWords(tree);
  
  return withChunks(queries.insertWords, normalizedWords);
};

const normalizeBooks = (tree: XMLTree) => {
  return tree.book_db.books[0].book.map(({
    $: { id: book_id },
    author: [author],
    file_path: [file_path],
    release_date: [release_date],
    title: [title],
    content: [{
      word_appearance: word_appearances
    }],
  }) => ({
    book_id: parseInt(book_id),
    author,
    file_path,
    release_date: new Date(release_date),
    title,
    content: word_appearances.map(({
      index: [index],
      line: [line],
      offset: [offset],
      paragraph: [paragraph],
      sentence: [sentence],
      word: [{ $: { refid: word_id } }],
    }) => ({
      index: parseInt(index),
      line: parseInt(line),
      offset: parseInt(offset),
      paragraph: parseInt(paragraph),
      sentence: parseInt(sentence),
      word_id: parseInt(word_id),
    })),
  }));
};

const importBooks = async (tree: XMLTree) => {
  const normalizedBooks = normalizeBooks(tree);
  const wordsAppearances = normalizedBooks.reduce((acc, { book_id, content }) => {
    const newWords = content.map(word => ({ ...word, book_id }));

    return [
      ...acc,
      ...newWords,
    ];
  }, []);

  await queries.insertBooksWithIds(normalizedBooks);
  await withChunks(queries.insertWordsAppearances, wordsAppearances);
};

const normalizeGroups = (tree: XMLTree) => {
  return tree.book_db.groups[0].group.map(({
    $: { id: group_id },
    group_words: [{ word: group_words }],
    name: [name],
  }) => ({
    group_id: parseInt(group_id),
    name,
    group_words: group_words.map(({ $: { refid: group_id } }) => parseInt(group_id)),
  }));
};

const importGroups = async (tree: XMLTree) => {
  const normalizedGroups = normalizeGroups(tree);
  const groupsWords = normalizedGroups.reduce((acc, { group_id, group_words }) => {
    const newWords = group_words.map((word_id) => ({ group_id, word_id }));

    return [
      ...acc,
      ...newWords,
    ];
  }, []);

  await queries.insertGroups(normalizedGroups);
  await queries.insertGroupsWords(groupsWords);
};

const normalizePhrases = (tree: XMLTree) => {
  return tree.book_db.phrases[0].phrase.map(({
    $: { id: phrase_id },
    phrase_words: [{ phrase_word: phrase_words }],
  }) => ({
    phrase_id: parseInt(phrase_id),
    phrase_words: phrase_words.map(({
      word: [{ $: { refid: word_id } }],
      word_index: [word_index],
    }) => ({
      word_index: parseInt(word_index),
      word_id: parseInt(word_id),
    }))}),
  );
};

const importPhrases = async (tree: XMLTree) => {
  const normalizedPhrases = normalizePhrases(tree);
  const phrasesWords = normalizedPhrases.reduce((acc, { phrase_id, phrase_words }) => {
    const newWords = phrase_words.map(({ word_index, word_id }) => ({ phrase_id, word_index, word_id }));

    return [
      ...acc,
      ...newWords,
    ];
  }, []);

  await queries.insertPhrases(
    normalizedPhrases.map(({ phrase_id, phrase_words }) => ({
      phrase_id,
      word_count: phrase_words.length,
    }))
  );
  await queries.insertPhrasesWords(phrasesWords);
};

const updateSerialIds = async () => {
  await updateTableSerialId('word', 'word_id');
  await updateTableSerialId('book', 'book_id');
  await updateTableSerialId('group', 'group_id');
  await updateTableSerialId('phrase', 'phrase_id');
};

const updateTableSerialId = async (tableName: string, columnName: string) => {
  await connection.query(`SELECT setval(pg_get_serial_sequence('${tableName}', '${columnName}'), coalesce(max(${columnName})+1, 1), false) FROM "${tableName}";`);
};

const CHUNK_SIZE = 500;

const withChunks = async (fn: Function, arr: Array<unknown>) => {
  const chunks = _.chunk(arr, CHUNK_SIZE);
  for (const chunk of chunks) {
    await fn(chunk);
  }
};
