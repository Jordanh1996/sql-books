import React, { useReducer } from 'react';
import clsx from 'clsx';
import styles from './PhraseFilter.css';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import BackspaceRoundedIcon from '@material-ui/icons/BackspaceRounded';

export interface PhraseFilterProps {
  onFilterClick?: (filter: Filter) => void;
}

enum actions {
  PHRASE_CHANGE = 'PHRASE_CHANGE',
  CLEAR = 'CLEAR',
}

export interface Filter {
  phrase: string;
}

type Action =
  | { type: actions.PHRASE_CHANGE; payload: string }
  | { type: actions.CLEAR };

const initialState = {
  phrase: '',
};

const reducer = (state: Filter, action: Action): Filter => {
  switch (action.type) {
    case actions.PHRASE_CHANGE:
      return { ...state, phrase: action.payload };
    case actions.CLEAR:
      return initialState;
    default:
      return state;
  }
};

export const PhraseFilter = ({
  onFilterClick = () => {},
}: PhraseFilterProps) => {
  const [formState, dispatch] = useReducer(reducer, initialState);

  return (
    <div className={clsx('full-width', 'row', 'justify-center')}>
      <Paper className={clsx('column', styles.container)}>
        <h2>Filters</h2>
        <br />
        <div className="row justify-evenly">
          <FormControl variant="outlined" className={styles.phraseInput}>
            <InputLabel>Phrase</InputLabel>
            <OutlinedInput
              value={formState.phrase}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: actions.PHRASE_CHANGE,
                  payload: e.target.value,
                })
              }
              labelWidth={50}
            />
          </FormControl>
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
