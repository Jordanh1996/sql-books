import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Store } from '../store';
import Routes from '../Routes';
import { wrapRendererQueries } from '../db/queries';

wrapRendererQueries();

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Routes />
      </MuiPickersUtilsProvider>
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
