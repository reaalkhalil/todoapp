import todos from './reducers/todos';
import type { Todo } from './reducers/types';

export const EQUAL = 'EQUAL';
export const NOT_EQUAL = 'NOT_EQUAL';
export const CONTAINS = 'CONTAINS';
export const NOT_CONTAINS = 'NOT_CONTAINS';
export const MATCHES = 'MATCHES';
export const BEFORE_EOD = 'BEFORE_EOD';
export const AFTER_EOD = 'AFTER_EOD';

function eod(offset) {
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return endOfDay.getTime() + (typeof offset === 'number' ? offset : 0);
}

const FILTERS = {
  [EQUAL]: (tt, f, v) => tt.filter(t => t[f] === v),

  [NOT_EQUAL]: (tt, f, v) => tt.filter(t => t[f] !== v),

  [CONTAINS]: (tt, f, v) =>
    tt.filter(t => (!t[f] ? false : t[f].indexOf(v) !== -1)),

  [NOT_CONTAINS]: (tt, f, v) =>
    tt.filter(t => (!t[f] ? false : t[f].indexOf(v) === -1)),

  [BEFORE_EOD]: (tt, f, v) => {
    return tt.filter(t => !!t[f] && t[f] <= eod(v));
  },

  [AFTER_EOD]: (tt, f, v) => {
    return tt.filter(t => !!t[f] && t[f] > eod(v));
  }
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
  shortcut: String,
  filters: Filter[],
  sort: String[]
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

  const currentSplitIndex = splits.findIndex(s => s.position === currentSplit);

  for (let i = 0; i <= currentSplitIndex; i++) {
    if (splits[i].position < 0) continue;
    filteredOut = apply(
      todos,
      {
        field: 'done',
        op: EQUAL,
        value: false
      },
      ...splits[i].filters
    );
    todos = minus(todos, filteredOut);
  }

  const sorter = splits[currentSplitIndex].sort;

  return sorter ? sort(filteredOut, sorter) : filteredOut;
}

type Page = {
  title: String,
  shortcut: String,
  filters: Filter[],
  sort: String[]
};
export function applyPage(todos: Todo[], pages: Pages[], currentPage: string) {
  const page = pages.find(p => p.shortcut === currentPage);
  if (!page) return [];

  const res = apply(todos, ...page.filters);

  return page.sort ? sort(res, page.sort) : res;
}

function sort(todos: Todo[], by: string[]) {
  if (!by || by.length === 0) return todos;

  todos = [...todos];

  todos.sort((t1, t2) => {
    for (let i = 0; i < by.length; i++) {
      const [field, order] = by[i].split(' ');

      const a = t1[field];
      const b = t2[field];

      const asc = order
        ? order.toLowerCase().startsWith('desc')
          ? 1
          : -1
        : -1;

      if ((a == undefined && b != undefined) || a < b) return asc;
      if ((b == undefined && a != undefined) || b < a) return -asc;
    }

    if (t1.title < t2.title) return 1;
    if (t2.title < t1.title) return -1;

    return 0;
  });

  return todos;
}

export function search(todos: Todos[], q: String) {
  const res = todos.filter(t => (t.title ? t.title.indexOf(q) > -1 : false));
  return sort(res, ['done', 'due_at desc', 'created_at desc']);
}
