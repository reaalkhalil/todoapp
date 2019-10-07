// @flow
import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  DESELECT_NEWLY_CREATED,
  LAST_ACTION
} from '../actions/todos';
import { trackEvent, Categories, Actions } from '../track';
import { Action, Todo } from './types';
import undoable, { excludeAction } from 'redux-undo';

function todos(state: Todo[] = [], action: Action) {
  switch (action.type) {
    case ADD_TODO:
      trackEvent(Categories.USER_INTERACTION, Actions.TODO_CREATE);
      return [...state, action.data.todo];

    case DELETE_TODO:
      trackEvent(Categories.USER_INTERACTION, Actions.TODO_DELETE);
      return state.filter(t => t.id !== action.data.id);

    case EDIT_TODO:
      trackEvent(Categories.USER_INTERACTION, Actions.TODO_EDIT);
      const idx = state.findIndex(t => t.id === action.data.todo.id);
      if (idx === -1) return state;
      const newState = [...state];
      newState[idx] = action.data.todo;
      return newState;

    default:
      return state;
  }
}

const undoableTodos = undoable(todos, {
  filter: excludeAction([DESELECT_NEWLY_CREATED, LAST_ACTION])
});

export default undoableTodos;
