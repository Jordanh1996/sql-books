import React from 'react';
import { useHistory } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const tabs = [
  {
    label: 'Books',
    route: '/books',
  },
  {
    label: 'Words',
    route: '/words',
  },
  {
    label: 'Groups',
    route: '/groups',
  },
  {
    label: 'Phrases',
    route: '/phrases',
  },
  {
    label: 'Statistics',
    route: '/statistics',
  },
  {
    label: 'Import / Export',
    route: '/importexport',
  },
];

export const TopBar = () => {
  const history = useHistory();

  return (
    <AppBar position="sticky">
      <Tabs value={history.location.pathname} aria-label="simple tabs example">
        {tabs.map(({ label, route }) => (
          <Tab
            key={label}
            label={label}
            value={route}
            onClick={() => history.push(route)}
          />
        ))}
      </Tabs>
    </AppBar>
  );
};
