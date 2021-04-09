import React, { useMemo } from 'react';
import styles from './GroupTable.css';
import { GroupWithWords } from '../../db/tables/group/group.interface';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { VirtualizedTable } from '../common/VirtualizedTable';

export interface GroupTableProps {
  groups: GroupWithWords[];
  loading: boolean;
  onDelete: (group: GroupWithWords) => void;
}

export const GroupTable = ({
  groups,
  loading,
  onDelete = () => {},
}: GroupTableProps) => {
  const groupsWithActions = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        words: group.words.join(', '),
        count: group.words.length,
        actions: (
          <>
            <IconButton
              color="secondary"
              onClick={() => onDelete(group)}
              key="delete"
            >
              <DeleteIcon />
            </IconButton>
          </>
        ),
      })),
    [groups]
  );

  if (loading) {
    return <CircularProgress size={80} />;
  } else {
    return (
      <Paper className={styles.container}>
        <VirtualizedTable
          rowCount={groupsWithActions.length}
          rowGetter={({ index }) => groupsWithActions[index]}
          columns={[
            {
              label: 'Name',
              dataKey: 'name',
            },
            {
              label: 'Words',
              dataKey: 'words',
            },
            {
              label: 'Words Count',
              dataKey: 'count',
            },
            {
              label: 'Actions',
              dataKey: 'actions',
            },
          ]}
        />
      </Paper>
    );
  }
};
