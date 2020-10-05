import React, { useState, useReducer, useCallback } from 'react';
import { promises as fs } from 'fs';
import moment, { Moment } from 'moment';
import clsx from 'clsx';
import styles from './BookForm.css';
import { addBook } from '../../../db/utils/add-book';
import { KeyboardDatePicker } from '@material-ui/pickers';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import BackspaceRoundedIcon from '@material-ui/icons/BackspaceRounded';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import { getAuthor } from '../../../utils/book/getAuthor';
import { getTitle } from '../../../utils/book/getTitle';
import { getReleaseDate } from '../../../utils/book/getReleaseDate';
import toastr from 'toastr';

enum actions {
  TITLE_CHANGE = 'TITLE_CHANGE',
  AUTHOR_CHANGE = 'AUTHOR_CHANGE',
  FILE_PATH_CHANGE = 'FILE_PATH_CHANGE',
  RELEASE_DATE_CHANGE = 'RELEASE_DATE_CHANGE',
  CLEAR = 'CLEAR',
}

interface FormState {
  title: string;
  author: string;
  file_path: string;
  release_date: Moment | null;
}

type Action =
  | { type: actions.TITLE_CHANGE; payload: string }
  | { type: actions.AUTHOR_CHANGE; payload: string }
  | { type: actions.FILE_PATH_CHANGE; payload: string }
  | { type: actions.RELEASE_DATE_CHANGE; payload: Moment | null }
  | { type: actions.CLEAR };

const initialState = {
  title: '',
  author: '',
  file_path: '',
  release_date: null,
};

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case actions.TITLE_CHANGE:
      return { ...state, title: action.payload };
    case actions.AUTHOR_CHANGE:
      return { ...state, author: action.payload };
    case actions.FILE_PATH_CHANGE:
      return { ...state, file_path: action.payload };
    case actions.RELEASE_DATE_CHANGE:
      return { ...state, release_date: action.payload };
    case actions.CLEAR:
      return initialState;
    default:
      return state;
  }
};

interface BookFormProps {
  onAddBook?: () => void;
}

export const BookForm = ({ onAddBook = () => {} }: BookFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, dispatch] = useReducer(reducer, initialState);

  const submit = useCallback(async () => {
    try {
      setLoading(true);
      await addBook({
        ...formState,
        release_date: formState.release_date
          ? formState.release_date.toDate()
          : null,
      });
      onAddBook();
      dispatch({ type: actions.CLEAR });
    } catch (e) {
      toastr.error(e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [formState, setLoading]);

  const onFilePick = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const path = e.currentTarget.files[0].path;
      dispatch({
        type: actions.FILE_PATH_CHANGE,
        payload: path,
      });
      e.target.value = null;

      const file = await fs.readFile(path, 'utf8');
      dispatch({
        type: actions.TITLE_CHANGE,
        payload: getTitle(file),
      });
      dispatch({
        type: actions.AUTHOR_CHANGE,
        payload: getAuthor(file),
      });
      dispatch({
        type: actions.RELEASE_DATE_CHANGE,
        payload: moment(getReleaseDate(file)),
      });
    },
    []
  );

  return (
    <Paper className={clsx('column', styles.container)}>
      <h2>Add a Book</h2>

      <FormControl variant="outlined" className={styles.input}>
        <InputLabel>File Path</InputLabel>
        <OutlinedInput
          disabled
          value={formState.file_path}
          labelWidth={66}
          endAdornment={
            <InputAdornment position="end">
              <Button variant="contained" component="label">
                Upload
                <input
                  type="file"
                  accept="text/plain"
                  style={{ display: 'none' }}
                  onChange={onFilePick}
                />
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl
        variant="outlined"
        className={styles.input}
        disabled={!formState.file_path}
      >
        <InputLabel>Title</InputLabel>
        <OutlinedInput
          value={formState.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: actions.TITLE_CHANGE, payload: e.target.value })
          }
          labelWidth={34}
        />
      </FormControl>

      <FormControl
        variant="outlined"
        className={styles.input}
        disabled={!formState.file_path}
      >
        <InputLabel>Author</InputLabel>
        <OutlinedInput
          value={formState.author}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: actions.AUTHOR_CHANGE, payload: e.target.value })
          }
          labelWidth={50}
        />
      </FormControl>

      <KeyboardDatePicker
        className={styles.input}
        label="Release Date"
        inputVariant="outlined"
        format="MM/DD/yyyy"
        disabled={!formState.file_path}
        value={formState.release_date}
        onChange={(date: Moment | null) =>
          dispatch({ type: actions.RELEASE_DATE_CHANGE, payload: date })
        }
      />

      <div className={clsx('row', styles.actionsRow)}>
        <div className={clsx(styles.submitWrapper, styles.input)}>
          <Button
            variant="contained"
            color="primary"
            disabled={
              loading ||
              !formState.title ||
              !formState.author ||
              !formState.file_path
            }
            onClick={submit}
            startIcon={<AddIcon />}
          >
            Add Book
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
