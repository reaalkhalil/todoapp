// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const ADD_TODO = 'ADD_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const EDIT_TODO = 'EDIT_TODO';

function add(data) {
  return {
    type: ADD_TODO,
    data
  };
}

export function addTodo(data) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { todos } = getState();

    let i = 0;
    todos.forEach(t => {
      if (t.id > i) i = t.id;
    });

    dispatch(add({ todo: { id: i + 1, ...data.todo } }));
  };
}

export function deleteTodo(data) {
  return {
    type: DELETE_TODO,
    data
  };
}

export function editTodo(data) {
  console.log('editTodo', data);

  return {
    type: EDIT_TODO,
    data
  };
}
