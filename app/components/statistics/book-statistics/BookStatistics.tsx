import React, { useState, useEffect, useCallback } from 'react';
import styles from './BookStatistics.css';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import { Book } from '../../../db/tables/book/book.interface';
import { BoxList } from '../../common/BoxList';
import clsx from 'clsx';
import { displayDecimal } from '../../../utils/math/afterDotNum';
import { queries } from '../../../db/queries';

interface BookStatisticsProps {}

export const BookStatistics = ({}: BookStatisticsProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);

  const [wordCount, setWordCount] = useState<string | number>('Loading...');
  const [distinctWordCount, setDistinctWordCount] = useState<string | number>(
    'Loading...'
  );
  const [letterCount, setLetterCount] = useState<string | number>('Loading...');
  const [letterAvg, setLetterAvg] = useState<string | number>('Loading...');
  const [paragraphWordCount, setParagraphWordCount] = useState<string | number>(
    'Loading...'
  );
  const [sentenceWordCount, setSentenceWordCount] = useState<string | number>(
    'Loading...'
  );
  const [lineWordCount, setLineWordCount] = useState<string | number>(
    'Loading...'
  );
  const [paragraphWordAvg, setParagraphWordAvg] = useState<string | number>(
    'Loading...'
  );
  const [sentenceWordAvg, setSentenceWordAvg] = useState<string | number>(
    'Loading...'
  );
  const [lineWordAvg, setLineWordAvg] = useState<string | number>('Loading...');
  const [paragraphLetterAvg, setParagraphLetterAvg] = useState<string | number>(
    'Loading...'
  );
  const [sentenceLetterAvg, setSentenceLetterAvg] = useState<string | number>(
    'Loading...'
  );
  const [lineLetterAvg, setLineLetterAvg] = useState<string | number>(
    'Loading...'
  );

  const getBooks = useCallback(async () => {
    const books = await queries.selectBooks({});

    setBooks(books);
  }, []);

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    [setWordCount, setDistinctWordCount, setLetterCount, setLetterAvg, setParagraphWordCount, setSentenceWordCount, setLineWordCount, setParagraphWordAvg, setSentenceWordAvg, setLineWordAvg, setParagraphLetterAvg, setSentenceLetterAvg, setLineLetterAvg]
      .forEach(fn => fn('Loading...'));

    queries.countWords(selectedBooks).then(setWordCount);
    queries.countWords(selectedBooks, 'word').then(setDistinctWordCount);
    queries.sumLetters(selectedBooks).then(setLetterCount);
    queries.averageLetters(selectedBooks, 'offset').then(setLetterAvg);

    queries.countMaxColumn(selectedBooks, 'paragraph').then(setParagraphWordCount);
    queries.countMaxColumn(selectedBooks, 'sentence').then(setSentenceWordCount);
    queries.countMaxColumn(selectedBooks, 'line').then(setLineWordCount);

    queries.averageWords(selectedBooks, 'paragraph').then(setParagraphWordAvg);
    queries.averageWords(selectedBooks, 'sentence').then(setSentenceWordAvg);
    queries.averageWords(selectedBooks, 'line').then(setLineWordAvg);

    queries.averageLetters(selectedBooks, 'paragraph').then(setParagraphLetterAvg);
    queries.averageLetters(selectedBooks, 'sentence').then(setSentenceLetterAvg);
    queries.averageLetters(selectedBooks, 'line').then(setLineLetterAvg);
  }, [selectedBooks]);

  return (
    <div className={clsx('full-width', 'justify-center', 'column')}>
      <FormControl variant="outlined" className={styles.input}>
        <InputLabel>Books</InputLabel>
        <Select
          multiple
          value={selectedBooks}
          label="Books"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedBooks((e.target.value as unknown) as number[]);
          }}
          renderValue={(selected: number[]) =>
            selected
              .map((id) => books.find((book) => book.book_id === id))
              .map((book) => book.title)
              .join(', ')
          }
          MenuProps={{
            variant: 'menu',
            getContentAnchorEl: null,
          }}
        >
          {books.map((book) => (
            <MenuItem key={book.book_id} value={book.book_id}>
              <Checkbox checked={selectedBooks.includes(book.book_id)} />
              <ListItemText primary={book.title} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={clsx('full-width', 'justify-center', 'column')}>
        <div className={clsx('row', 'full-width', 'justify-center')}>
          <BoxList
            className={styles.lowerBox}
            list={[
              { label: 'Words Count:', value: wordCount },
              { label: 'Distinct Words:', value: distinctWordCount },
              { label: 'Letters Count:', value: letterCount },
              {
                label: 'Average Letters in Word:',
                value: displayDecimal(letterAvg),
              },
            ]}
          />
          <BoxList
            className={styles.lowerBox}
            list={[
              { label: 'Paragraphs Count:', value: paragraphWordCount },
              {
                label: 'Average Words in Paragraph:',
                value: displayDecimal(paragraphWordAvg),
              },
              {
                label: 'Average Letters in Paragraph:',
                value: displayDecimal(paragraphLetterAvg),
              },
            ]}
          />
        </div>
        <div className={clsx('row', 'full-width', 'justify-center')}>
          <BoxList
            className={styles.lowerBox}
            list={[
              { label: 'Sentence Count:', value: sentenceWordCount },
              {
                label: 'Average Words in Sentence:',
                value: displayDecimal(sentenceWordAvg),
              },
              {
                label: 'Average Letters in Sentence:',
                value: displayDecimal(sentenceLetterAvg),
              },
            ]}
          />
          <BoxList
            className={styles.lowerBox}
            list={[
              { label: 'Line Count:', value: lineWordCount },
              {
                label: 'Average Words in Line:',
                value: displayDecimal(lineWordAvg),
              },
              {
                label: 'Average Letters in Line:',
                value: displayDecimal(lineLetterAvg),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
