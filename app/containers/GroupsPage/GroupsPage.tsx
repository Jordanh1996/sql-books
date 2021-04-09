import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import styles from './GroupsPage.css';
import { GroupForm } from '../../components/groups/group-form/GroupForm';
import { GroupWithWords } from '../../db/tables/group/group.interface';
import { GroupList } from '../../components/groups/GroupList';
import { queries } from '../../db/queries';
import { Filter } from '../../components/groups/group-filter/GroupFilter';

export const GroupsPage = () => {
  const [groups, setGroups] = useState<GroupWithWords[]>([]);
  const [lastFilter, setLastFilter] = useState<Filter>({ name: '', words: [] });
  const [loading, setLoading] = useState<boolean>(true);

  const getGroups = useCallback(
    async (options: Filter = { name: '', words: [] }) => {
      setLastFilter(options);
      setLoading(true);
      let groups = await queries.selectGroupsWithWords(options);
      if (options.name) {
        const regexp = new RegExp(options.name);
        groups = groups.filter(group => group.name.match(regexp));
      }
      if (options.words.length) {
        groups = groups.filter(group => options.words.filter(word => group.words.includes(word)).length);
      }
      setGroups(groups);
      setLoading(false);
    },
    [setLoading, setGroups]
  );

  const removeGroup = useCallback(
    (group: GroupWithWords) => {
      queries.deleteGroup(group.group_id);
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
