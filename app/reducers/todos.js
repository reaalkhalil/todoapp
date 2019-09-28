// @flow
import { ADD_TODO, DELETE_TODO, EDIT_TODO } from '../actions/todos';

import { trackEvent, Categories, Actions } from '../track';

import { Action, Todo } from './types';

export default function todos(state: Todo[] = [], action: Action) {
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
