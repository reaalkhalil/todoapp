// @flow
import type { GetState, Dispatch } from '../reducers/types';

const uuid = require('uuid/v4');

export const SET_RECENT_EDIT = 'SET_RECENT_EDIT';
export const LAST_ACTION = 'LAST_ACTION';

import store from '../store/Store';

export function addTodo(data) {
  return async (dispatch: Dispatch, getState: GetState) => {
    let id = uuid();

    while (await store.todoExists(id)) id = uuid();

    await store.addTodo({ ...data.todo, id });

    dispatch({ type: SET_RECENT_EDIT, data: { id } });
  };
}

export function deleteTodo(data) {
  return async (dispatch: Dispatch, getState: GetState) => {
    await store.removeTodo(data.id);
  };
}

export function editTodo(data) {
  return async (dispatch: Dispatch, getState: GetState) => {
    await store.editTodo({ ...data.todo });

    dispatch({ type: SET_RECENT_EDIT, data: { id: data.todo.id } });
  };
}

export function setLastAction(data) {
  return {
    type: LAST_ACTION,
    data
  };
}
