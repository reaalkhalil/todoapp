import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import TodoPage from './containers/TodoPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={TodoPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
