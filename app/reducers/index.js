// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import todos from './todos';
import newlyCreated from './newlyCreated';
import lastAction from './lastAction';
import { settings, integrations, userId } from './settings';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    newlyCreatedId: newlyCreated,
    lastAction,
    todos,
    settings,
    integrations,
    userId
  });
}
