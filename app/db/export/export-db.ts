import { createWriteStream, WriteStream } from 'fs';
import { finished } from 'stream';
import Cursor from 'pg-cursor';
import { promisify } from 'util';
import moment from 'moment';
import _ from 'lodash';
import { connection } from '../connection';
import { Word } from '../tables/word/word.interface';
import { Book } from '../tables/book/book.interface';
import { WordAppearance } from '../tables/word-appearance/word-appearance.interface';
import { GroupWord } from '../tables/group-word/group-word.interface';
import { Group } from '../tables/group/group.interface';
import { Phrase } from '../tables/phrase/phrase.interface';
import { PhraseWord } from '../tables/phrase-word/phrase-word.interface';

const BATCH_SIZE = 1000;

Cursor.prototype.readAsync = promisify(Cursor.prototype.read);
const streamWriteFinished = promisify(finished);

export const exportDB = async (path = __dirname + '/db.xml') => {
  const stream = createWriteStream(path, { encoding: 'utf8' });

  stream.write('<?xml version="1.0" encoding="utf-8" ?>')
  stream.write('<book_db>');
  await exportWords(stream);
  await exportBooks(stream);
  await exportGroups(stream);
  await exportPhrases(stream);
  stream.write('</book_db>');
  stream.end();
  await streamWriteFinished(stream);
};

const exportWords = async (stream: WriteStream) => {
  stream.write('<words>');
  const cursor = connection.query(new Cursor(`SELECT * FROM word`));

  let rows: Word[];
  while ((rows = await cursor.readAsync(BATCH_SIZE)) && rows.length) {
    for (const word of rows) {
      stream.write(`<word id="${word.word_id}">${word.word}</word>`);
    }
  }

  stream.write('</words>');

  cursor.close();
};

const exportBooks = async (stream: WriteStream) => {
  stream.write('<books>');
  const bookCursor = connection.query(new Cursor(`SELECT * FROM book`));
 
  let book: Book;
  while (([book] = await bookCursor.readAsync(BATCH_SIZE)) && book) {
    stream.write(`<book id="${book.book_id}">`);
    stream.write(`<title>${book.title}</title>`);
    stream.write(`<author>${book.author}</author>`);
    stream.write(`<file_path>${book.file_path}</file_path>`);
    stream.write(`<release_date>${moment(book.release_date).format('YYYY-MM-DD')}</release_date>`);
    stream.write('<content>')
    const { rows: words } = await connection.query<WordAppearance>(`SELECT * FROM word_appearance WHERE book_id = $1`, [book.book_id]);
    for (const word of words) {
      stream.write('<word_appearance>');
      stream.write(`<word refid="${word.word_id}"></word>`);
      stream.write(`<paragraph>${word.paragraph}</paragraph>`);
      stream.write(`<sentence>${word.sentence}</sentence>`);
      stream.write(`<line>${word.line}</line>`);
      stream.write(`<index>${word.index}</index>`);
      stream.write(`<offset>${word.offset}</offset>`);
      stream.write('</word_appearance>');
    }
    stream.write('</content>')
    stream.write('</book>');
  }

  stream.write('</books>');
  bookCursor.close();
};

export const exportGroups = async (stream: WriteStream) => {
  stream.write('<groups>');
  const { rows: groups } = await connection.query<Group & GroupWord>(`SELECT * FROM "group" NATURAL JOIN group_word`);

  const groupsMap = _.groupBy(groups, 'group_id');

  for (const [group_id, group] of Object.entries(groupsMap)) {
    stream.write(`<group id="${group_id}">`);
    stream.write(`<name>${group[0].name}</name>`);
    stream.write('<group_words>');
    for (const groupWord of group) {
      stream.write(`<word refid="${groupWord.word_id}"></word>`);
    }
    stream.write('</group_words>');
    stream.write('</group>');
  }

  stream.write('</groups>');
};

export const exportPhrases = async (stream: WriteStream) => {
  stream.write('<phrases>');
  const { rows: phrases } = await connection.query<Phrase & PhraseWord>(`SELECT * FROM phrase NATURAL JOIN phrase_word`);

  const phrasesMap = _.groupBy(phrases, 'phrase_id');

  for (const [phrase_id, phrases] of Object.entries(phrasesMap)) {
    stream.write(`<phrase id="${phrase_id}">`);
    stream.write('<phrase_words>');
    for (const phraseWord of phrases) {
      stream.write('<phrase_word>');
      stream.write(`<word refid="${phraseWord.word_id}"></word>`);
      stream.write(`<word_index>${phraseWord.word_index}</word_index>`);
      stream.write('</phrase_word>');
    }
    stream.write('</phrase_words>');
    stream.write('</phrase>');
  }

  stream.write('</phrases>');
};
