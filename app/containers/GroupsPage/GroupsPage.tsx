import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import styles from './GroupsPage.css';
import { GroupForm } from '../../components/groups/group-form/GroupForm';
import { GroupWithWords } from '../../db/tables/group/group.interface';
import { selectGroupsWithWords } from '../../db/tables/group/queries/select-groups';
import { deleteGroup } from '../../db/tables/group/queries/delete-group';
import { GroupList } from '../../components/groups/GroupList';

export const GroupsPage = () => {
  const [groups, setGroups] = useState<GroupWithWords[]>([]);
  const [lastFilter, setLastFilter] = useState<unknown>({});
  const [loading, setLoading] = useState<boolean>(true);

  const getGroups = useCallback(
    async (options: any = {}) => {
      setLastFilter(options);
      setLoading(true);
      const groups = await selectGroupsWithWords(options);
      setGroups(groups);
      setLoading(false);
    },
    [setLoading, setGroups]
  );

  const removeGroup = useCallback(
    (group: GroupWithWords) => {
      deleteGroup(group.group_id);
      setGroups(groups.filter((cur) => cur.group_id !== group.group_id));
    },
    [setGroups, groups]
  );

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <div className={clsx('column', 'full-page-height')}>
      <div className={clsx('justify-center', styles.formWrapper)}>
        <GroupForm onAddGroup={() => getGroups(lastFilter)} />
      </div>
      <GroupList
        groups={groups}
        loading={loading}
        getGroups={getGroups}
        removeGroup={removeGroup}
      />
    </div>
  );
};
