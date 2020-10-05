import React, { useReducer } from 'react';
import clsx from 'clsx';
import styles from './BookFilter.css';
import { WordList } from '../../../word-list/WordList';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import BackspaceRoundedIcon from '@material-ui/icons/BackspaceRounded';

export interface BookFilterProps {
  onFilterClick?: (filter: Filter) => void;
}

enum actions {
  TITLE_CHANGE = 'TITLE_CHANGE',
  AUTHOR_CHANGE = 'AUTHOR_CHANGE',
  WORD_CHANGE = 'WORD_CHANGE',
  ADD_WORD = 'ADD_WORD',
  REMOVE_WORD = 'REMOVE_WORD',
  CLEAR = 'CLEAR',
}

export interface Filter {
  title: string;
  author: string;
  words: string[];
}

interface FormState extends Filter {
  word: string;
}

type Action =
  | { type: actions.TITLE_CHANGE; payload: string }
  | { type: actions.AUTHOR_CHANGE; payload: string }
  | { type: actions.WORD_CHANGE; payload: string }
  | { type: actions.ADD_WORD; payload: string }
  | { type: actions.REMOVE_WORD; payload: string }
  | { type: actions.CLEAR };

const initialState = {
  title: '',
  author: '',
  word: '',
  words: [],
};

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case actions.TITLE_CHANGE:
      return { ...state, title: action.payload };
    case actions.AUTHOR_CHANGE:
      return { ...state, author: action.payload };
    case actions.WORD_CHANGE:
      return { ...state, word: action.payload };
    case actions.ADD_WORD:
      return {
        ...state,
        words: Array.from(new Set(state.words.concat(action.payload))),
        word: initialState.word,
      };
    case actions.REMOVE_WORD:
      return {
        ...state,
        words: state.words.filter((word) => word !== action.payload),
      };
    case actions.CLEAR:
      return initialState;
    default:
      return state;
  }
};

export const BookFilter = ({ onFilterClick = () => {} }: BookFilterProps) => {
  const [formState, dispatch] = useReducer(reducer, initialState);

  return (
    <div className={clsx('full-width', 'row', 'justify-center')}>
      <Paper className={clsx('column', styles.container)}>
        <h2>Filters</h2>
        <br />
        <div className="row justify-evenly">
          <FormControl variant="outlined">
            <InputLabel>Title</InputLabel>
            <OutlinedInput
              value={formState.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: actions.TITLE_CHANGE,
                  payload: e.target.value,
                })
              }
              labelWidth={34}
            />
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel>Author</InputLabel>
            <OutlinedInput
              value={formState.author}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: actions.AUTHOR_CHANGE,
                  payload: e.target.value,
                })
              }
              labelWidth={50}
            />
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel>Word Appearance</InputLabel>
            <OutlinedInput
              value={formState.word}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: actions.WORD_CHANGE,
                  payload: e.target.value.replace(/[^a-zA-Z]/gi, ''),
                })
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    disabled={!formState.word.length}
                    onClick={() =>
                      dispatch({
                        type: actions.ADD_WORD,
                        payload: formState.word.toLowerCase(),
                      })
                    }
                    edge="end"
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={120}
            />
          </FormControl>
        </div>

        <div>
          <WordList
            words={formState.words}
            onDelete={(word: string) =>
              dispatch({ type: actions.REMOVE_WORD, payload: word })
            }
          />
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
