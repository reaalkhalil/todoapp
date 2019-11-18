// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import * as settingsActions from '../actions/settings';
import * as todosActions from '../actions/todos';
import { formatSplits } from '../utils/settings';

import store from './Store';

const history = createHashHistory();
const rootReducer = createRootReducer(history);

function configureStore() {
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
          store.saveSettings(settings);
        } else if (action.type === settingsActions.ADD_INTEGRATIONS) {
          store.setIntegrations(state.integrations);
        }
      } else if (action.type in todosActions) {
        //   s.saveTodos(state.todos.present);
        // TODO handle todo actions
      }

      return returnValue;
    };
  };

  //   const todos = store.getTodos();
  const settings = store.getSettings();
  const userId = store.getUserId();
  const integrations = store.getIntegrations();

  return createStore(
    rootReducer,
    {
      // todos: { past: [], future: [], present: todos },
      settings,
      userId,
      integrations
    },
    compose(applyMiddleware(thunk, persistent))
  );
}

export default { configureStore, history };
