import todos from './reducers/todos';
import type { Todo } from './reducers/types';
import { now, endOfDay } from './utils';

export const EQUAL = 'EQUAL';
export const NOT_EQUAL = 'NOT_EQUAL';
export const CONTAINS = 'CONTAINS';
export const NOT_CONTAINS = 'NOT_CONTAINS';
export const BEFORE_EOD = 'BEFORE_EOD';
export const AFTER_EOD = 'AFTER_EOD';
export const BEFORE_NOW = 'BEFORE_NOW';
export const AFTER_NOW = 'AFTER_NOW';

// type Split = {
//   position: number,
//   title: String,
//   shortcut: String,
//   filters: Filter[],
//   sort: String[]
// };

// type Page = {
//   title: String,
//   shortcut: String,
//   filters: Filter[],
//   sort: String[]
// };

const FILTERS = {
  [EQUAL]: (tt, f, v) => tt.filter(t => t[f] === v),

  [NOT_EQUAL]: (tt, f, v) => tt.filter(t => t[f] !== v),

  [CONTAINS]: (tt, f, v) =>
    tt.filter(t => (!t[f] ? false : t[f].indexOf(v) !== -1)),

  [NOT_CONTAINS]: (tt, f, v) =>
    tt.filter(t => (!t[f] ? false : t[f].indexOf(v) === -1)),

  [BEFORE_EOD]: (tt, f, v) => tt.filter(t => !!t[f] && t[f] <= endOfDay(v)),

  [AFTER_EOD]: (tt, f, v) => tt.filter(t => !!t[f] && t[f] > endOfDay(v)),

  [BEFORE_NOW]: (tt, f, v) => tt.filter(t => !!t[f] && t[f] <= now(v)),

  [AFTER_NOW]: (tt, f, v) => tt.filter(t => !!t[f] && t[f] > now(v))
};

export type Filter = {
  field: string,
  op:
    | EQUAL
    | NOT_EQUAL
    | CONTAINS
    | NOT_CONTAINS
    | BEFORE_EOD
    | AFTER_EOD
    | BEFORE_NOW
    | AFTER_NOW,
  value: any
};

function matchFilter(todo, filter) {
  const fn = FILTERS[filter.op];
  return fn ? fn([todo], filter.field, filter.value).length > 0 : false;
}

function apply(tt: Todo[], filterStr: String) {
  const filters = filterStr
    .split(' ')
    .filter(i => !!i)
    .map(parseFilter)
    .filter(i => !!i);

  let ts = tt;
  filters
    .map(f => ({ ...f, fn: FILTERS[f.op] }))
    .forEach(f => {
      ts = f.fn(ts, f.field, f.value);
    });

  return ts;
}

function minus(all: Todo[], sub: Todo[]) {
  return all.filter(t => !sub.find(s => s.id === t.id));
}

export function applySplits(
  tt: Todo[],
  splits: Splits[],
  currentSplit: number
) {
  let filteredOut = null;
  let ts = [...tt];

  const currentSplitIndex = splits.findIndex(s => s.position === currentSplit);

  for (let i = 0; i <= currentSplitIndex; i++) {
    if (splits[i].position < 0) continue;
    filteredOut = apply(ts, splits[i].filters);
    ts = minus(ts, filteredOut);
  }

  const sorter = splits[currentSplitIndex].sort;
  return sorter ? sort(filteredOut, sorter) : filteredOut;
}

export function applyPage(tt: Todo[], pages: Pages[], currentPage: string) {
  const page = pages.find(p => p.shortcut === currentPage);
  if (!page) return [];

  const res = apply(tt, page.filters);

  return page.sort ? sort(res, page.sort) : res;
}

function sort(tt: Todo[], by: string) {
  if (!by || by.length === 0) return tt;

  const bys = by.split(' ');
  let ts = [...tt];

  ts = ts.sort((t1, t2) => {
    for (let i = 0; i < bys.length; i++) {
      let [field, order] = bys[i].split(':');
      const filter = parseFilter(field);

      let a = t1[field];
      let b = t2[field];

      if (!!filter) {
        a = matchFilter(t1, filter);
        b = matchFilter(t2, filter);
      }

      if (a == undefined && b != undefined) return 1;
      if (b == undefined && a != undefined) return -1;

      const asc = order
        ? order.toLowerCase().startsWith('desc')
          ? 1
          : -1
        : -1;

      if (a < b) return asc;
      if (b < a) return -asc;
    }

    const p1 = parseInt(t1.title);
    const p2 = parseInt(t2.title);

    if (t1.title == NaN && t2.title != NaN) return 1;
    if (t2.title == NaN && t1.title != NaN) return -1;

    if (p1 !== NaN && p2 !== NaN && p1 < p2) return -1;
    if (p1 !== NaN && p2 !== NaN && p2 < p1) return 1;

    if (t1.title < t2.title) return -1;
    if (t2.title < t1.title) return 1;

    return 0;
  });

  return ts;
}

export function search(tt: Todos[], q: String) {
  const searchQuery = q
    .split(' ')
    .filter(s => s !== '')
    .filter(s => !parseFilter(s))
    .map(s => (s.length > 0 && s[0] === '"' ? s.slice(1) : s))
    .map(s => (s.length > 0 && s[s.length - 1] === '"' ? s.slice(0, -1) : s))
    .filter(s => s !== '');

  const searchFilters = q
    .split(' ')
    .filter(parseFilter)
    .join(' ');

  const res = tt
    .filter(t =>
      searchFilters.length > 0 ? apply([t], searchFilters).length > 0 : true
    )
    .filter(t =>
      t.title && searchQuery.length > 0
        ? searchQuery.every(q => match(q, t.title))
        : !!t.title
    );
  return sort(res, 'done,due_at,created_at desc');
}

export function match(query, str) {
  return str.toLowerCase().indexOf(query.toLowerCase()) > -1;
}

export function getTags(tt) {
  let tags = [];

  tt.forEach(todo =>
    todo.tags
      ? todo.tags.forEach(t => {
          if (!tags.find(tag => tag.tag === t))
            tags.push({ tag: t, timesNotDone: 0, timesDone: 0 });

          const tag = tags.find(tag => tag.tag === t);
          if (todo.done) tag.timesDone = tag.timesDone ? tag.timesDone + 1 : 1;
          else tag.timesNotDone = tag.timesNotDone ? tag.timesNotDone + 1 : 1;
        })
      : null
  );

  return tags
    .sort((a, b) => {
      const diff = b.timesNotDone - a.timesNotDone;
      if (diff !== 0) return diff;
      return b.timesDone - a.timesDone.timesDone;
    })
    .map(t => t.tag);
}

/*
	!! report parsing errors for this

	done (done=true) (done=false)
	tags=reading,books <- all tags
	tag=reading,books <- any tag
   sort=done_at:desc,priority:desc
   due=0,eod  due=0,eod-2d  OR? due<eod+2d

   https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
*/

function parseFilter(str) {
  const allowedFilterNames = [
    'done',
    'tags',
    'due_at',
    'done_at',
    'created_at',
    'updated_at'
  ];
  const allowedOps = ['=', '<', '>']; // must be single char + only occurence of that char in filter

  let opIdx = -1;
  allowedOps.forEach(op => {
    const i = str.indexOf(op);
    if (i !== -1) opIdx = i;
  });

  if (opIdx === str.length - 1) return;

  const op = opIdx === -1 ? '' : str[opIdx];
  const filterName = opIdx > -1 ? str.slice(0, opIdx) : str;
  const vals =
    opIdx > -1 && opIdx < str.length - 1 ? str.slice(opIdx + 1).split(',') : [];

  if (!allowedFilterNames.includes(filterName)) return;

  switch (filterName) {
    case 'done': {
      const f = { field: filterName };
      if (op === '' || op === '=') {
        f.op = EQUAL;
        f.value = true;
      }

      if (op !== '' && op !== '=') return null;
      if (op === '=' && vals.length > 0 && vals[0] === 'false') f.value = false;

      return f;
    }

    case 'created_at':
    case 'updated_at':
    case 'done_at':
    case 'due_at': {
      const f = { field: filterName };
      if ((op !== '<' && op !== '>') || vals.length !== 1) return null;

      const t = parseTime(vals[0]);
      if (t === null) return;

      if (t.base === 'eod') {
        if (op === '<') f.op = 'BEFORE_EOD';
        else f.op = 'AFTER_EOD';
      } else if (t.base === 'now') {
        if (op === '<') f.op = 'BEFORE_NOW';
        else f.op = 'AFTER_NOW';
      } else return null;

      f.value = t.offset * (t.op === '-' ? -1 : 1);

      return f;
    }

    case 'tags': {
      if (op !== '=' || vals.length < 1) return null;
      return { field: filterName, op: CONTAINS, value: vals[0] };
    }

    default:
      return null;
  }
}

function parseTime(str) {
  // (now/eod/0)[(+/-)(%d)(min,h,d,w,m)]
  // TODO: multiple [(+/-)(%d)(min,h,d,w,m)]s

  const allowedBases = ['eod', 'now'];
  const allowedOffsetUnits = ['min', 'h', 'd', 'w', 'm'];

  let base = str;
  let op = '';
  let offsetNum = '';
  let offsetUnit = '';

  ['-', '+'].forEach(o => {
    const opIdx = str.indexOf(o);
    if (opIdx === -1 || opIdx === str.length - 1) return null;

    op = o;
    base = str.slice(0, opIdx);
    offsetNum = parseFloat(str.slice(opIdx + 1));
    offsetUnit = str.slice(opIdx + 1).replace(/\d|\./gi, '');
  });

  if (!allowedBases.includes(base)) return null;
  if (offsetUnit !== '') {
    if (!allowedOffsetUnits.includes(offsetUnit)) return null;
    if (Number.isNaN(offsetNum)) offsetNum = 1;
  }

  let offset = 0;

  if (offsetUnit !== '')
    switch (offsetUnit) {
      case 'min':
        offset = offsetNum * 60 * 1000;
        break;
      case 'h':
        offset = offsetNum * 60 * 60 * 1000;
        break;
      case 'd':
        offset = offsetNum * 24 * 60 * 60 * 1000;
        break;
      case 'w':
        offset = offsetNum * 7 * 24 * 60 * 60 * 1000;
        break;
      case 'm':
        offset = offsetNum * 30 * 24 * 60 * 60 * 1000;
        break;
      default:
    }

  return { base, op, offset };
}

export function higerOrderTags(splits, selectedSplit) {
  // TODO: does this need to be smarter? maybe worry about it when query language is improved
  const higherOrderSplits = [];
  splits.some(s => {
    if (s.position === selectedSplit) {
      return true;
    } else {
      higherOrderSplits.push(s);
    }
  });
  const tags = [];
  higherOrderSplits.forEach(s => {
    if (s.filters && s.filters.length > 0) {
      s.filters
        .split(' ')
        .filter(s => !!s)
        .map(parseFilter)
        .filter(f => !!f)
        .forEach(f => {
          if (f.field === 'tags' && f.op === 'CONTAINS') tags.push(f.value);
        });
    }
  });
  return tags;
}
