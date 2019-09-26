// @flow
import { ADD_TODO, DELETE_TODO, EDIT_TODO } from '../actions/todos';
import type { Action, Todo } from './types';

export default function todos(state: Todo[] = [], action: Action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.data.todo];
    case DELETE_TODO:
      return state.filter(t => t.id !== action.data.id);
    case EDIT_TODO:
      const idx = state.findIndex(t => t.id === action.data.todo.id);
      if (idx === -1) return state;
      const newState = [...state];
      newState[idx] = action.data.todo;
      return newState;
    default:
      return state;
  }
}
