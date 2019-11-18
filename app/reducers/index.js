// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
// import todos from './todos';
import recentlyEdited from './recentlyEdited';
import lastAction from './lastAction';
import { settings, integrations, userId } from './settings';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    recentlyEditedId: recentlyEdited,
    lastAction,
    settings,
    integrations,
    userId
  });
}
