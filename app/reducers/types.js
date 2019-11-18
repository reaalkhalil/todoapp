import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type Todo = {
  id: string,
  title: string,
  notes: string,
  priority: number,
  tags: string[],
  created_at: number,
  updated_at: number,
  done_at: number | null,
  due_at: number | null,
  done: Boolean
};

export type Settings = {
  splits: {
    title: string,
    shortcut: string,
    position: number,
    index: number,
    filters: string,
    sort: string,
    default: any
  }[],
  pages: {
    title: string,
    shortcut: string,
    filters: string,
    sort: string,
    default: any
  }[]
};

export type StateType = {
  settings: Settings
};

export type Action = {
  type: string,
  data: any
};

export type GetState = () => StateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
