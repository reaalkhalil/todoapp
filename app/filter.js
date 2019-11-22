import type { Todo } from './reducers/types';
import { now, endOfDay } from './utils';

export const EQUAL = 'EQUAL';
export const NOT_EQUAL = 'NOT_EQUAL';

export const LESS_THAN = 'LESS_THAN';
export const GREATER_THAN = 'GREATER_THAN';

export const MATCHES_ALL = 'MATCHES_ALL';
export const MATCHES_SOME = 'MATCHES_SOME';

export const CONTAINS_SOME = 'CONTAINS_SOME';
export const CONTAINS_ALL = 'CONTAINS_ALL';
export const CONTAINS_NONE = 'CONTAINS_NONE';

export const BEFORE_EOD = 'BEFORE_EOD';
export const AFTER_EOD = 'AFTER_EOD';
export const BEFORE_NOW = 'BEFORE_NOW';
export const AFTER_NOW = 'AFTER_NOW';

const FILTERS = {
  [EQUAL]: (tt, f, v) =>
    tt.filter(t => (Array.isArray(v) ? v.some(x => t[f] === x) : t[f] === v)),

  [NOT_EQUAL]: (tt, f, v) => tt.filter(t => t[f] !== v),

  [LESS_THAN]: (tt, f, v) => tt.filter(t => t[f] < v),

  [GREATER_THAN]: (tt, f, v) => tt.filter(t => t[f] > v),

  [MATCHES_ALL]: (tt, f, vv) =>
    tt.filter(t => (!t[f] ? false : vv.every(v => match(v, t[f])))),

  [MATCHES_SOME]: (tt, f, vv) =>
    tt.filter(t => (!t[f] ? false : vv.some(v => match(v, t[f])))),

  [CONTAINS_ALL]: (tt, f, vv) =>
    tt.filter(t =>
      !t[f] ? false : vv.every(v => t[f].some(tf => match(v, tf)))
    ),

  [CONTAINS_SOME]: (tt, f, vv) =>
    tt.filter(t =>
      !t[f] ? false : vv.some(v => t[f].some(tf => match(v, tf)))
    ),

  [CONTAINS_NONE]: (tt, f, vv) =>
    tt.filter(t =>
      !t[f] ? true : !vv.some(v => t[f].some(tf => match(v, tf)))
    ),

  [BEFORE_EOD]: (tt, f, v) => tt.filter(t => !!t[f] && t[f] < endOfDay(v)),

  [AFTER_EOD]: (tt, f, v) => tt.filter(t => !!t[f] && t[f] > endOfDay(v)),

  [BEFORE_NOW]: (tt, f, v) => tt.filter(t => !!t[f] && t[f] < now(v)),

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

const allowedFilterNames = [
  'done',
  'priority',
  'tags',
  'due_at',
  'done_at',
  'created_at',
  'updated_at',
  'title',
  'notes'
];

function matchFilter(todo, filter) {
  const fn = FILTERS[filter.op];
  return fn ? fn([todo], filter.field, filter.value).length > 0 : false;
}

function apply(tt: Todo[], filterStr: String) {
  const filters = filterStr
    .split(/\s+/)
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
    filteredOut = search(ts, splits[i].filters);
    ts = minus(ts, filteredOut);
  }

  const sorter = splits[currentSplitIndex].sort;
  return sorter ? sort(filteredOut, sorter) : filteredOut;
}

export function applyPage(tt: Todo[], pages: Pages[], currentPage: string) {
  const page = pages.find(p => p.shortcut === currentPage);
  if (!page) return [];

  const res = search(tt, page.filters);

  return page.sort ? sort(res, page.sort) : res;
}

function parseSortOrder(o) {
  if (!o) return null;
  const or = o.toLowerCase();
  if (['desc', 'descending', '-'].indexOf(or) !== -1) return 1;
  if (['asc', 'ascending', '+'].indexOf(or) !== -1) return -1;
  return null;
}

export function parseSort(by: string) {
  return by
    .split(/\s+/)
    .filter(s => !!s)
    .map(s => {
      let [field, order] = s.split(':');
      const filter = parseFilter(field);
      const asc = parseSortOrder(order);

      return (!filter && allowedFilterNames.indexOf(field) === -1) ||
        (order && order.length > 0 ? asc === null : false)
        ? { type: 'str', str: s }
        : {
            field,
            filter,
            type: filter ? 'filter' : 'field',
            asc: asc ? asc : -1,
            str: s
          };
    });
}

function sort(tt: Todo[], by: string) {
  if (!by || by.length === 0) return tt;

  const bys = parseSort(by).filter(s => s.type !== 'str');
  let ts = [...tt];

  ts = ts.sort((t1, t2) => {
    for (let i = 0; i < bys.length; i++) {
      let { field, filter, asc } = bys[i];

      let a = t1[field];
      let b = t2[field];

      if (!!filter) {
        a = matchFilter(t1, filter);
        b = matchFilter(t2, filter);
      }

      if (!filter) {
        if (a === undefined && b !== undefined) return asc;
        if (b === undefined && a !== undefined) return 0 - asc;
      } else {
        if (a === false && b !== false) return 0 - asc;
        if (b === false && a !== false) return asc;
      }

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

export function parseSearchQ(q) {
  const queries = q
    .split(/\s+/)
    .filter(s => !!s)
    .filter(s => !parseFilter(s))
    .filter(s => !!s);

  const filters = q
    .split(/\s+/)
    .filter(s => !!s)
    .filter(parseFilter)
    .filter(s => !!s);

  const all = q
    .split(/\s+/)
    .filter(s => !!s)
    .map(s => ({ type: parseFilter(s) ? 'filter' : 'query', str: s }));

  return { queries, filters, all };
}

export function search(tt: Todos[], q: String) {
  const { queries, filters } = parseSearchQ(q);

  const res = tt
    .filter(t =>
      filters.length > 0 ? apply([t], filters.join(' ')).length > 0 : true
    )
    .filter(t =>
      t.title && queries.length > 0
        ? queries.every(q => match(q, t.title))
        : !!t.title
    );

  return sort(res, 'done:desc due_at<eod priority:desc due_at:desc created_at');
}

export function match(q, str) {
  let query = q.trim();

  const qStartsWith = query.length > 0 && query[0] === '^';

  if (qStartsWith || query[0] === "'" || query[0] === '"')
    query = query.slice(1);

  const qEndsWith = query.length > 0 && query[query.length - 1] === '$';

  if (
    qEndsWith ||
    query[query.length - 1] === "'" ||
    query[query.length - 1] === '"'
  )
    query = query.slice(0, -1);

  if (!query) return false;

  const idx = str.toLowerCase().indexOf(query.toLowerCase());

  if (idx === -1) return false;
  if (qStartsWith && idx !== 0) return false;
  if (qEndsWith && idx + query.length !== str.length) return false;

  return true;
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
   TODO: report parsing errors for this
   TODO: use this https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
*/

function parseFilter(str) {
  const allowedOps = ['=', '<', '<=', '>', '>=']; // must be only occurrence of that string in the filter

  let opIdx = -1;
  let op = '';
  allowedOps.forEach(o => {
    const i = str.indexOf(o);
    if (i === -1) return;

    opIdx = i;
    op = o;
  });

  const filterName = opIdx > -1 ? str.slice(0, opIdx) : str;
  const vals =
    opIdx > -1 && opIdx + op.length < str.length
      ? str.slice(opIdx + op.length).split(',')
      : [];

  if (!allowedFilterNames.includes(filterName)) return;

  switch (filterName) {
    case 'done': {
      const f = { field: filterName };
      if (op === '' || op === '=') {
        f.op = EQUAL;
        f.value = true;
      }

      if (op !== '' && op !== '=') return null;
      if (op === '=') {
        if (vals.length === 0) return null;
        if (vals[0] === 'false' || vals[0] === '0') f.value = false;
        else if (vals[0] === 'true' || vals[0] === '1') {
        } else return null;
      }

      return f;
    }

    case 'priority': {
      const f = { field: filterName };
      if ((op !== '=' && op !== '<' && op !== '>') || vals.length === 0) return;

      if (op === '=') f.op = EQUAL;
      if (op === '<') f.op = LESS_THAN;
      if (op === '>') f.op = GREATER_THAN;

      f.value =
        vals.length === 1 ? parseInt(vals[0]) : vals.map(x => parseInt(x));
      if (Number.isNaN(f.value)) return null;

      return f;
    }

    case 'created_at':
    case 'updated_at':
    case 'done_at':
    case 'due_at': {
      const f = { field: filterName };
      if (
        (op !== '<' &&
          op !== '>' &&
          op !== '=' &&
          op !== '<=' &&
          op !== '>=') ||
        vals.length !== 1
      )
        return null;

      const t = parseTime(vals[0]);
      if (t === null) return; // TODO: if no time unit should be null

      if (t.base === 'eod' || t.base === 'now') {
        if (op === '<' || op === '<=') f.op = 'BEFORE_' + t.base.toUpperCase();
        else if (op === '>' || op === '>=')
          f.op = 'AFTER_' + t.base.toUpperCase();
      } else return null;

      if (op === '=') {
        f.op = 'EQUAL';
        if (t.base !== 'eod' && t.base !== 'now' && t.base !== '0') return null;
        f.value = t.base === 'eod' ? endOfDay() : t.base === 'now' ? now() : 0;
        f.value += t.offset * (t.op === '-' ? -1 : 1);
      } else {
        f.value = t.offset * (t.op === '-' ? -1 : 1);
      }

      if (op === '<=') f.value += 1;
      if (op === '>=') f.value -= 1;

      return f;
    }

    case 'tags': {
      if (
        (op !== '=' && op !== '>' && op !== '<') ||
        vals.length < 1 ||
        !(vals instanceof Array)
      )
        return null;

      return {
        field: filterName,
        op:
          op === '='
            ? CONTAINS_SOME
            : op === '>'
            ? CONTAINS_ALL
            : CONTAINS_NONE,
        value: vals
      };
    }

    case 'notes':
    case 'title': {
      if (
        (op !== '=' && op !== '>') ||
        vals.length < 1 ||
        !(vals instanceof Array)
      )
        return null;

      return {
        field: filterName,
        op: op === '=' ? MATCHES_SOME : MATCHES_ALL,
        value: vals
      };
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
  if (offsetNum !== '' && offsetUnit === '') return null;
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

export function higerOrderTags(tags, splits, selectedSplit) {
  // TODO: does this need to be smarter?
  const higherOrderSplits = [];
  splits.some(s => {
    if (s.position === selectedSplit) {
      return true;
    } else {
      higherOrderSplits.push(s);
    }
  });
  let tt = [...tags];

  higherOrderSplits.forEach(s => {
    if (s.filters && s.filters.length > 0) {
      s.filters
        .split(/\s+/)
        .filter(s => !!s)
        .map(parseFilter)
        .filter(f => !!f)
        .forEach(f => {
          if (f.field === 'tags' && f.value && f.value.length > 0) {
            if (f.op === CONTAINS_SOME)
              f.value.forEach(v => (tt = tt.filter(t => !match(v, t))));
            else if (
              f.op === CONTAINS_ALL &&
              f.value.every(v => tt.some(tf => match(v, tf)))
            )
              f.value.forEach(v => (tt = tt.filter(t => !match(v, t))));
          }
        });
    }
  });
  return tt;
}

// TODO: this should be ok, but check
export function applyTimes(todo) {
  const applyTime = t => {
    if (t === 0 || !t) return t;

    if (Number.isInteger(t)) return t;

    let res = new Date().getTime();

    const r = parseTime(t);
    if (r === null || !r.base) return res;

    res = r.base === 'eod' ? endOfDay() : r.base === 'now' ? now() : 0;
    if (r.op && r.offset) res += r.offset * (r.op === '-' ? -1 : 1);

    return res;
  };

  const res = { ...todo };
  ['created_at', 'updated_at', 'done_at', 'due_at'].forEach(p => {
    res[p] = applyTime(todo[p]);
  });

  return res;
}
