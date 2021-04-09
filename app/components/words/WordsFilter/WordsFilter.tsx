import React, { useReducer } from 'react';
import clsx from 'clsx';
import styles from './WordsFilter.css';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import BackspaceRoundedIcon from '@material-ui/icons/BackspaceRounded';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { Book } from '../../../db/tables/book/book.interface';
import { Group } from '../../../db/tables/group/group.interface';

export interface WordFilterProps {
  books: Book[];
  groups: Group[];
  onFilterClick?: (filter: Filter) => void;
}

enum actions {
  CHANGE_BOOKS = 'CHANGE_BOOKS',
  CHANGE_GROUPS = 'CHANGE_GROUPS',
  CHANGE_LINE = 'CHANGE_LINE',
  CHANGE_PARAGRAPH = 'CHANGE_PARAGRAPH',
  CHANGE_SENTENCE = 'CHANGE_SENTENCE',
  CHANGE_OFFSET = 'CHANGE_OFFSET',
  CLEAR = 'CLEAR',
}

export interface Filter {
  books: number[];
  groups: number[];
  line: string;
  paragraph: string;
  sentence: string;
  offset: string;
}

type Action =
  | { type: actions.CHANGE_BOOKS; payload: number[] }
  | { type: actions.CHANGE_GROUPS; payload: number[] }
  | { type: actions.CHANGE_LINE; payload: string }
  | { type: actions.CHANGE_PARAGRAPH; payload: string; }
  | { type: actions.CHANGE_SENTENCE; payload: string; }
  | { type: actions.CHANGE_OFFSET; payload: string; }
  | { type: actions.CLEAR };

const initialState = {
  books: [],
  groups: [],
  line: '',
  paragraph: '',
  sentence: '',
  offset: ''
};

const reducer = (state: Filter, action: Action): Filter => {
  switch (action.type) {
    case actions.CHANGE_BOOKS:
      return { ...state, books: action.payload };
    case actions.CHANGE_GROUPS:
      return { ...state, groups: action.payload };
    case actions.CHANGE_LINE:
      return { ...state, line: action.payload };
    case actions.CHANGE_PARAGRAPH:
      return { ...state, paragraph: action.payload };
    case actions.CHANGE_SENTENCE:
      return { ...state, sentence: action.payload };
    case actions.CHANGE_OFFSET:
      return { ...state, offset: action.payload };
    case actions.CLEAR:
      return initialState;
    default:
      return state;
  }
};

export const WordsFilter = ({
  books,
  groups,
  onFilterClick = () => {},
}: WordFilterProps) => {
  const [formState, dispatch] = useReducer(reducer, initialState);

  return (
    <div className={clsx('full-width', 'row', 'justify-center')}>
      <Paper className={clsx('column', styles.container)}>
        <div className="row justify-evenly">
          <div className="column">

            <FormControl variant="outlined" className={styles.input}>
              <InputLabel>Books</InputLabel>
              <Select
                multiple
                value={formState.books}
                label="Books"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch({
                    type: actions.CHANGE_BOOKS,
                    payload: (e.target.value as unknown) as number[],
                  });
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
                    <Checkbox
                      checked={formState.books.includes(book.book_id)}
                    />
                    <ListItemText primary={book.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={styles.input}>
              <InputLabel>Groups</InputLabel>
              <Select
                multiple
                value={formState.groups}
                label="Groups"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch({
                    type: actions.CHANGE_GROUPS,
                    payload: (e.target.value as unknown) as number[],
                  });
                }}
                renderValue={(selected: number[]) =>
                  selected
                    .map((id) => groups.find((group) => group.group_id === id))
                    .map((group) => group.name)
                    .join(', ')
                }
                MenuProps={{
                  variant: 'menu',
                  getContentAnchorEl: null,
                }}
              >
                {groups.map((group) => (
                  <MenuItem key={group.group_id} value={group.group_id}>
                    <Checkbox
                      checked={formState.groups.includes(group.group_id)}
                    />
                    <ListItemText primary={group.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="column">
            <FormControl variant="outlined" className={styles.input}>
              <InputLabel>Line</InputLabel>
              <OutlinedInput
                value={formState.line}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({
                    type: actions.CHANGE_LINE,
                    payload: e.target.value.replace(/[^0-9]/g, ''),
                  })
                }
                labelWidth={34}
              />
            </FormControl>

            <FormControl variant="outlined" className={styles.input}>
              <InputLabel>Paragraph</InputLabel>
              <OutlinedInput
                value={formState.paragraph}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({
                    type: actions.CHANGE_PARAGRAPH,
                    payload: e.target.value.replace(/[^0-9]/g, ''),
                  })
                }
                labelWidth={34}
              />
            </FormControl>
          </div>
          
          <div className="column">
            <FormControl variant="outlined" className={styles.input}>
              <InputLabel>Sentence</InputLabel>
              <OutlinedInput
                value={formState.sentence}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({
                    type: actions.CHANGE_SENTENCE,
                    payload: e.target.value.replace(/[^0-9]/g, ''),
                  })
                }
                labelWidth={34}
              />
            </FormControl>

            <FormControl variant="outlined" className={styles.input}>
              <InputLabel>Offset</InputLabel>
              <OutlinedInput
                value={formState.offset}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({
                    type: actions.CHANGE_OFFSET,
                    payload: e.target.value.replace(/[^0-9]/g, ''),
                  })
                }
                labelWidth={34}
              />
            </FormControl>
            </div>
          </div>

        <div className={clsx('row', styles.actionsRow)}>
          <Button
            variant="contained"
            color="primary"
            className={styles.button}
            startIcon={<SearchIcon />}
            onClick={() => onFilterClick(formState)}
          >
            Apply Filter
          </Button>

          <Button
            variant="contained"
            color="primary"
            className={styles.button}
            onClick={() => dispatch({ type: actions.CLEAR })}
            startIcon={<BackspaceRoundedIcon />}
          >
            Clear
          </Button>
        </div>
      </Paper>
    </div>
  );
};
