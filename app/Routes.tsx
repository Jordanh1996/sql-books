/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import { TopBar } from './components/TopBar';
import { BooksPage } from './containers/BooksPage/BooksPage';
import { GroupsPage } from './containers/GroupsPage/GroupsPage';
import { WordsPage } from './containers/WordsPage/WordsPage';
import { PhrasesPage } from './containers/PhrasesPage/PhrasesPage';
import { StatisticsPage } from './containers/StatisticsPage/StatisticsPage';

const structuedPage = (Component: () => JSX.Element) => {
  return () => (
    <div className="expand">
      <TopBar />
      <Component />
    </div>
  );
};

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.WORDS} component={structuedPage(WordsPage)} />
        <Route path={routes.GROUPS} component={structuedPage(GroupsPage)} />
        <Route path={routes.PHRASES} component={structuedPage(PhrasesPage)} />
        <Route
          path={routes.STATISTICS}
          component={structuedPage(StatisticsPage)}
        />
        <Route
          path={routes.IMPORT_EXPORT}
          component={structuedPage(HomePage)}
        />
        <Route path={routes.BOOKS} component={structuedPage(BooksPage)} />
      </Switch>
    </App>
  );
}
