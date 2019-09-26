import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

// ADDFIELDS:
export type Todo = {
  +id: number,
  +title: string,
  +content: string,
  +priority: number,
  +created_at: number,
  +done_at: number | null,
  +due_at: number | null,
  +done: Boolean
};

export type Todo = {
  +id: number,
  +title: string,
  +priority: number,
  +done: Boolean
};

type Filter = {
  field: string,
  op: string,
  value: any
};

export type Settings = {
  +splits: {
    +title: string,
    +shortcut: string,
    +position: number,
    +filters: Filter[]
  }[]
};

export type StateType = {
  +todos: Todo[],
  +settings: Settings
};

export type Action = {
  +type: string,
  +data: any
};

export type GetState = () => StateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
