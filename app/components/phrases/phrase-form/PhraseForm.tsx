import React, { useState, useReducer, useCallback } from 'react';
import clsx from 'clsx';
import styles from './PhraseForm.css';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import BackspaceRoundedIcon from '@material-ui/icons/BackspaceRounded';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import toastr from 'toastr';
import { queries } from '../../../db/queries';

enum actions {
  PHRASE_CHANGE = 'PHRASE_CHANGE',
  CLEAR = 'CLEAR',
}

interface FormState {
  phrase: string;
}

type Action =
  | { type: actions.PHRASE_CHANGE; payload: string }
  | { type: actions.CLEAR };

const initialState = {
  phrase: '',
};

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case actions.PHRASE_CHANGE:
      return { ...state, phrase: action.payload };
    case actions.CLEAR:
      return initialState;
    default:
      return state;
  }
};

interface PhraseFormProps {
  onAddPhrase?: () => void;
}

export const PhraseForm = ({ onAddPhrase = () => {} }: PhraseFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, dispatch] = useReducer(reducer, initialState);

  const submit = useCallback(async () => {
    try {
      setLoading(true);
      await queries.addPhrase(formState);
      onAddPhrase();
      dispatch({ type: actions.CLEAR });
    } catch (e) {
      toastr.error(e);
    } finally {
      setLoading(false);
    }
  }, [formState, setLoading]);

  return (
    <Paper className={clsx('column', styles.container)}>
      <h2>Create a Phrase</h2>
      <FormControl variant="outlined" className={styles.input}>
        <InputLabel>Phrase</InputLabel>
        <OutlinedInput
          value={formState.phrase}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({
              type: actions.PHRASE_CHANGE,
              payload: e.target.value.toLowerCase().replace(/[^a-z ]/g, ''),
            })
          }
          labelWidth={50}
        />
      </FormControl>

      <div className={clsx('row', styles.actionsRow)}>
        <div className={clsx(styles.submitWrapper, styles.input)}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading || !formState.phrase}
            onClick={submit}
            startIcon={<AddIcon />}
          >
            Add Phrase
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
            onClick={() => dispatch({ type: actions.CLEAR })}
            startIcon={<BackspaceRoundedIcon />}
          >
            Clear
          </Button>
        </div>
      </div>
    </Paper>
  );
};
