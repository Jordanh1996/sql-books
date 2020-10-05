import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import styles from './WordsBar.css';
import { AutoSizer, List } from 'react-virtualized';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

enum sorts {
  Appearance = 'Appearance',
  Lexicographic = 'Lexicographic',
}

enum orders {
  Ascending = 'Ascending',
  Descending = 'Descending',
}

const sortOptions = [sorts.Appearance, sorts.Lexicographic];
const orderOptions = [orders.Ascending, orders.Descending];

export interface WordsBarProps {
  words: { word: string; count: number }[];
  selectedWords: string[];
  setSelectedWords: (selectedWords: string[]) => void;
}

export const WordsBar = ({
  words,
  selectedWords,
  setSelectedWords,
}: WordsBarProps) => {
  const [sortBy, setSortBy] = useState<sorts>(sortOptions[0]);
  const [order, setOrder] = useState<orders>(orderOptions[0]);
  const [search, setSearch] = useState<string>('');

  const searchResults = useMemo(() => {
    if (search) {
      return words.filter((word) => new RegExp(search).test(word.word));
    } else return words;
  }, [search, words]);

  const sorted = useMemo(() => {
    let sorted = searchResults;

    if (sortBy === sorts.Appearance) {
      sorted = sorted.sort((a, b) => (a.count > b.count ? 1 : -1));
    }
    if (sortBy === sorts.Lexicographic) {
      sorted = sorted.sort((a, b) => (a.word > b.word ? 1 : -1));
    }
    if (order === orders.Descending) {
      sorted = sorted.reverse();
    }

    return sorted;
  }, [sortBy, order, searchResults]);

  return (
    <Paper className={clsx(styles.container, 'column', 'expand')}>
      <div className={clsx('column', styles.optionsContainer)}>
        <FormControl variant="outlined">
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSortBy(e.target.value as sorts)
            }
            label="Sort by"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={styles.input}>
          <InputLabel>Order</InputLabel>
          <Select
            value={order}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOrder(e.target.value as orders)
            }
            label="Order"
          >
            {orderOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={styles.input}>
          <InputLabel>Search</InputLabel>
          <OutlinedInput
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!e.target.value.match(/[^a-zA-Z]/))
                setSearch(e.target.value.toLowerCase());
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            labelWidth={56}
          />
        </FormControl>
      </div>

      <div className={styles.resultsCount}>{searchResults.length} Words</div>

      <div className={styles.listContainer}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              height={height}
              width={width}
              rowCount={sorted.length}
              rowHeight={40}
              rowRenderer={({ index, key, style }) => {
                const { word, count } = sorted[index];
                const checked = selectedWords.includes(word);

                return (
                  <ListItem key={key} button style={style}>
                    <ListItemText
                      primary={`${word.slice(0, 1).toUpperCase()}${word.slice(
                        1
                      )} - ${count}`}
                    />
                    <Checkbox
                      onChange={() =>
                        checked
                          ? setSelectedWords(
                              selectedWords.filter(
                                (selected) => selected !== word
                              )
                            )
                          : setSelectedWords([...selectedWords, word])
                      }
                      checked={checked}
                    />
                  </ListItem>
                );
              }}
            />
          )}
        </AutoSizer>
      </div>
    </Paper>
  );
};
