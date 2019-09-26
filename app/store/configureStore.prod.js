// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';

import Store from './Store';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

function configureStore() {
  const s = new Store();

  const persistent = ({ getState }) => {
    return next => action => {
      const returnValue = next(action);
      const state = getState();
      s.saveTodos(state.todos);
      s.saveSettings(state.settings);

      return returnValue;
    };
  };

  const todos = s.getTodos();
  const settings = s.getSettings();

  console.log('todos', todos);
  console.log('settings', settings);

  return createStore(
    rootReducer,
    {
      todos,
      settings
    },
    compose(applyMiddleware(thunk, persistent))
  );
}

export default { configureStore, history };
