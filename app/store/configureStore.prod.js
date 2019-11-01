// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import * as settingsActions from '../actions/settings';
import * as todosActions from '../actions/todos';
import { formatSplits } from '../utils/settings';

import Store from './Store';

const history = createHashHistory();
const rootReducer = createRootReducer(history);

function configureStore() {
  const s = new Store();

  const persistent = ({ getState }) => {
    return next => action => {
      const returnValue = next(action);
      const state = getState();

      if (action.type in settingsActions) {
        if (
          action.type === settingsActions.SAVE_SETTINGS ||
          action.type === settingsActions.ADD_SPLIT ||
          action.type === settingsActions.EDIT_SPLIT
        ) {
          s.saveSettings(settings);
        } else if (action.type === settingsActions.ADD_INTEGRATIONS) {
          s.setIntegrations(state.integrations);
        }
      } else if (action.type in todosActions) {
        s.saveTodos(state.todos.present);
      }

      return returnValue;
    };
  };

  const todos = s.getTodos();
  const settings = s.getSettings();
  const userId = s.getUserId();
  const integrations = s.getIntegrations();

  return createStore(
    rootReducer,
    {
      todos: { past: [], future: [], present: todos },
      settings,
      userId,
      integrations
    },
    compose(applyMiddleware(thunk, persistent))
  );
}

export default { configureStore, history };
