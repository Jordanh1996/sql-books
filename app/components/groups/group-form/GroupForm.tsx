import React, { useState, useReducer, useCallback } from 'react';
import clsx from 'clsx';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import BackspaceRoundedIcon from '@material-ui/icons/BackspaceRounded';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import { WordList } from '../../word-list/WordList';
import { addGroup } from '../../../db/utils/add-group';
import styles from './GroupForm.css';

enum Actions {
  NAME_CHANGE = 'NAME_CHANGE',
  WORD_CHANGE = 'WORD_CHANGE',
  ADD_WORD = 'ADD_WORD',
  REMOVE_WORD = 'REMOVE_WORD',
  CLEAR = 'CLEAR',
}

interface FormState {
  name: string;
  word: string;
  words: string[];
}

type Action =
  | { type: Actions.NAME_CHANGE; payload: string }
  | { type: Actions.WORD_CHANGE; payload: string }
  | { type: Actions.ADD_WORD; payload: string }
  | { type: Actions.REMOVE_WORD; payload: string }
  | { type: Actions.CLEAR };

const initialState = {
  name: '',
  word: '',
  words: [],
};

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case Actions.NAME_CHANGE:
      return { ...state, name: action.payload };
    case Actions.WORD_CHANGE:
      return { ...state, word: action.payload };
    case Actions.ADD_WORD:
      return {
        ...state,
        words: Array.from(new Set(state.words.concat(action.payload))),
        word: initialState.word,
      };
    case Actions.REMOVE_WORD:
      return {
        ...state,
        words: state.words.filter((word) => word !== action.payload),
      };
    case Actions.CLEAR:
      return initialState;
    default:
      return state;
  }
};

interface GroupFormProps {
  onAddGroup?: () => void;
}

export const GroupForm = ({ onAddGroup = () => {} }: GroupFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, dispatch] = useReducer(reducer, initialState);

  const submit = useCallback(async () => {
    try {
      setLoading(true);
      await addGroup(formState);
      onAddGroup();
      dispatch({ type: Actions.CLEAR });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [formState, setLoading]);

  return (
    <Paper className={clsx('column', styles.container)}>
      <h2>Create a Group</h2>
      <FormControl variant="outlined" className={styles.input}>
        <InputLabel>Name</InputLabel>
        <OutlinedInput
          value={formState.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: Actions.NAME_CHANGE, payload: e.target.value })
          }
          labelWidth={44}
        />
      </FormControl>

      <FormControl variant="outlined" className={styles.input}>
        <InputLabel>Word</InputLabel>
        <OutlinedInput
          value={formState.word}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({
              type: Actions.WORD_CHANGE,
              payload: e.target.value.replace(/[^a-zA-Z]/gi, ''),
            })
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                disabled={!formState.word.length}
                onClick={() =>
                  dispatch({
                    type: Actions.ADD_WORD,
                    payload: formState.word.toLowerCase(),
                  })
                }
                edge="end"
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>
          }
          labelWidth={40}
        />
      </FormControl>

      <div>
        <WordList
          words={formState.words}
          onDelete={(word: string) =>
            dispatch({ type: Actions.REMOVE_WORD, payload: word })
          }
        />
      </div>

      <div className={clsx('row', styles.ActionsRow)}>
        <div className={clsx(styles.submitWrapper, styles.input)}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading || !formState.name}
            onClick={submit}
            startIcon={<AddIcon />}
          >
            Add Group
            {loading && (
              <CircularProgress size={24} className={styles.submitProgress} />
            )}
          </Button>
        </div>

        <div className={styles.input}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={() => dispatch({ type: Actions.CLEAR })}
            startIcon={<BackspaceRoundedIcon />}
          >
            Clear
          </Button>
        </div>
      </div>
    </Paper>
  );
};
