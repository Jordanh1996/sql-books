import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import styles from './WordsPage.css';
import { Group } from '../../db/tables/group/group.interface';
import {
  WordsFilter,
  Filter,
} from '../../components/words/WordsFilter/WordsFilter';
import { Book } from '../../db/tables/book/book.interface';
import { WordsBar } from '../../components/words/WordsBar/WordsBar';
import {
  SelectWordsOptions,
  WordCount,
  WordAppearance,
} from '../../db/tables/word-appearance/queries/select-words-appearances';
import { WordTable } from '../../components/words/WordsTable/WordsTable';
import { queries } from '../../db/queries';

export const WordsPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [lastFilter, setLastFilter] = useState<Filter>();
  const [words, setWords] = useState<WordCount[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [wordAppearances, setWordAppearances] = useState<WordAppearance[]>([]);

  const onFilterClick = useCallback(async (filter: Filter) => {
    const params: SelectWordsOptions = {};
    if (filter.books.length) params.books = filter.books;
    if (filter.groups.length) params.groups = filter.groups;
    if (filter.line) params.line = Number(filter.line);

    setLastFilter(filter);
    const words = await queries.selectWordsCount(params);
    setSelectedWords([]);
    setWordAppearances([]);
    setWords(words);
  }, []);

  const getGroups = useCallback(async () => {
    const groups = await queries.selectGroups();
    setGroups(groups);
  }, [setGroups]);

  const getBooks = useCallback(async () => {
    const books = await queries.selectBooks({});
    setBooks(books);
  }, [setBooks]);

  const getInitData = useCallback(async () => {
    await Promise.all([getGroups(), getBooks()]);
  }, [getGroups]);

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedWords.length) return setWordAppearances([]);

      const options: SelectWordsOptions = {};
      if (lastFilter?.books?.length)
        options.books = lastFilter.books;
      if (lastFilter?.groups?.length)
        options.groups = lastFilter.groups;
      if (lastFilter?.line)
        options.line = Number(lastFilter.line);

      setWordAppearances(
        await queries.selectWordsAppearances({ words: selectedWords, options })
      );
    })();
  }, [selectedWords]);

  return (
    <div className={clsx('row', 'full-page-height')}>
      <div className={styles.wordsBar}>
        <WordsBar
          words={words}
          selectedWords={selectedWords}
          setSelectedWords={setSelectedWords}
        />
      </div>
      <div className={clsx('column', 'full-width', styles.secondColumn)}>
        <div className={clsx('justify-center', styles.formWrapper)}>
          <WordsFilter
            books={books}
            groups={groups}
            onFilterClick={onFilterClick}
          />
        </div>
        {wordAppearances.length ? <WordTable words={wordAppearances} /> : null}
      </div>
    </div>
  );
};
