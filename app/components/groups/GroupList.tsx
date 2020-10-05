import React from 'react';
import clsx from 'clsx';
import { GroupWithWords } from '../../db/tables/group/group.interface';
import { GroupTable } from './GroupTable';
import { GroupFilter } from './group-filter/GroupFilter';

export interface GroupListProps {
  removeGroup: (group: GroupWithWords) => void;
  getGroups: () => {};
  groups: GroupWithWords[];
  loading: boolean;
}

export const GroupList = ({
  getGroups,
  removeGroup,
  groups,
  loading,
}: GroupListProps) => {
  return (
    <div className={clsx('column', 'expand')}>
      <GroupFilter onFilterClick={getGroups} />
      <GroupTable groups={groups} loading={loading} onDelete={removeGroup} />
    </div>
  );
};
