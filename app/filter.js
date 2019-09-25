import todos from './reducers/todos';
import type { Todo } from './reducers/types';

export const EQUAL = 'EQUAL';
export const NOT_EQUAL = 'NOT_EQUAL';
export const CONTAINS = 'CONTAINS';
export const NOT_CONTAINS = 'NOT_CONTAINS';
export const MATCHES = 'MATCHES';

const FILTERS = {
  [EQUAL]: (tt, f, v) => tt.filter(t => t[f] === v),

  [NOT_EQUAL]: (tt, f, v) => tt.filter(t => t[f] !== v),

  [CONTAINS]: (tt, f, v) =>
    tt.filter(t => (!t[f] ? false : t[f].indexOf(v) !== -1)),

  [NOT_CONTAINS]: (tt, f, v) =>
    tt.filter(t => (!t[f] ? false : t[f].indexOf(v) === -1))
};

export type Filter = {
  field: string,
  op: EQUAL | NOT_EQUAL | CONTAINS | NOT_CONTAINS | MATCHES,
  value: any
};

export function apply(todos: Todo[], ...filters: Filter[]) {
  let ts = todos;
  filters
    .map(f => ({ ...f, fn: FILTERS[f.op] }))
    .forEach(f => {
      ts = f.fn(ts, f.field, f.value);
    });

  return ts;
}

type Split = {
  position: number,
  title: String,
  filters: Filter[]
};

function minus(all: Todo[], sub: Todo[]) {
  return all.filter(t => !sub.find(s => s.id === t.id));
}

export function applySplits(
  todos: Todo[],
  splits: Splits[],
  currentSplit: number
) {
  let filteredOut = null;
  for (let i = 0; i <= currentSplit; i++) {
    filteredOut = apply(todos, ...splits[i].filters);
    todos = minus(todos, filteredOut);
  }
  return filteredOut;
}

export function sort(todos: Todo[]) {
  return todos;
}
