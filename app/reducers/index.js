// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import todos from './todos';
import settings from './settings';
import newlyCreated from './newlyCreated';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    todos,
    settings,
    newlyCreatedId: newlyCreated
  });
}
