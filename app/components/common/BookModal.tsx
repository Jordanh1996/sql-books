import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import styles from './BookModal.css';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface Highlight {
  start: number;
  end: number;
}

interface BookModalProps {
  open: boolean;
  onClose: () => void;
  content: string | null;
  title: string | null;
  matches?: Highlight[];
  firstMatchIndex?: number;
}

export const BookModal = ({
  open,
  onClose,
  content,
  title,
  matches,
  firstMatchIndex,
}: BookModalProps) => {
  const [highlightIndex, setHighlightIndex] = useState<number>(null);
  const prevHighlightIndex = usePrevious(highlightIndex);
  const [lastContentRendered, setLastContentRendered] = useState<Date>(null);

  const fixHighlightIndex = useCallback(
    (index: number) => {
      if (index >= matches.length) return setHighlightIndex(0);
      if (index < 0) return setHighlightIndex(matches.length - 1);
      setHighlightIndex(index);
    },
    [matches, setHighlightIndex]
  );

  const renderContent = useMemo(() => {
    if (matches && content) {
      let lastOffset = 0;

      setTimeout(() => {
        setLastContentRendered(new Date());
      });

      return (
        <DialogContentText>
          {matches.map(({ start, end }, i) => {
            const temp = lastOffset;
            lastOffset = end;

            const jsx = [
              <span key={`highlighted-${i}-1`}>
                {content.substring(temp, start)}
              </span>,
              <span id={`highlighted-${i}`} key={`highlighted-${i}`}>
                {content.substring(start, end)}
              </span>,
            ];

            if (i === matches.length - 1) {
              jsx.push(
                <span key={`highlighted-${i}-2`}>
                  {content.substring(end, content.length - 1)}
                </span>
              );
            }

            return jsx;
          })}
        </DialogContentText>
      );
    } else return <DialogContentText>{content}</DialogContentText>;
  }, [matches, content]);

  const renderMatchActions = useMemo(() => {
    if (!matches || !matches.length) return null;

    return (
      <div className={clsx('row', styles.paginationWrapper)}>
        <IconButton
          color="primary"
          onClick={() => fixHighlightIndex(highlightIndex - 1)}
        >
          <NavigateBeforeRoundedIcon />
        </IconButton>
        <div className={styles.paginationText}>
          {highlightIndex + 1} / {matches.length}
        </div>
        <IconButton
          color="primary"
          onClick={() => fixHighlightIndex(highlightIndex + 1)}
        >
          <NavigateNextRoundedIcon />
        </IconButton>
      </div>
    );
  }, [matches, highlightIndex]);

  useEffect(() => {
    if (typeof firstMatchIndex === 'number') setHighlightIndex(firstMatchIndex);
  }, [firstMatchIndex, open]);

  useEffect(() => {
    if (open) {
      const prevEl = document.getElementById(
        `highlighted-${prevHighlightIndex}`
      );
      if (prevEl) prevEl.style.background = 'none';

      const el = document.getElementById(`highlighted-${highlightIndex}`);

      if (el) {
        el.style.background = 'yellow';
        el.scrollIntoView({ inline: 'center', block: 'center' });
      }
    }
  }, [lastContentRendered, highlightIndex]);

  return (
    <Dialog open={open} onClose={onClose} scroll="paper" maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        dividers
        style={{ padding: '30px', whiteSpace: 'pre-wrap' }}
      >
        {renderContent}
      </DialogContent>
      <DialogActions>
        {renderMatchActions}
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export type OpenedBook = Omit<BookModalProps, 'onClose'> & {
  matches?: Highlight[];
  firstMatchIndex?: number;
};
