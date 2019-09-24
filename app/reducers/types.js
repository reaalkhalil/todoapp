import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

// new fields here
export type Todo = {
  +id: number,
  +title: string,
  +priority: number,
  +done: Boolean
};

export type todosStateType = {
  +todos: Todo[]
};

export type Action = {
  +type: string,
  +data: any
};

export type GetState = () => todosStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
