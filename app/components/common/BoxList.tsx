import React, { useMemo } from 'react';
import styles from './BoxList.css';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

export interface BoxListProps {
  title?: string;
  list: { label: string; value: string | number }[];
  className?: string;
}

export const BoxList = ({ title, list, className }: BoxListProps) => {
  const renderItems = useMemo(() => {
    return list.map(({ label, value }, index) => (
      <React.Fragment key={index}>
        {index !== 0 && <Divider key={'divider-' + index} />}
        <ListItem className={styles.listItem} key={index}>
          <ListItemText primary={label} />
          <ListItemText primary={value} className={styles.listItemValue} />
        </ListItem>
      </React.Fragment>
    ));
  }, [list]);

  return (
    <Paper className={className}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {renderItems}
    </Paper>
  );
};
