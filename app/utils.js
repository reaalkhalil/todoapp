export function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}

export function now() {
  return new Date().getTime();
}

export function endOfDay() {
  const a = new Date();
  a.setHours(23, 59, 59, 999);
  return a.getTime();
}

export function previewText(title) {
  const prevLength = 25;

  return title.slice(0, prevLength) + (title.length > prevLength ? '...' : '');
}

export function todoToText(todo, maxLength = 0) {
  let res = '';
  res += (todo.done ? '+' : '-') + ' ';
  const p = new Array(todo.priority ? todo.priority : 0).fill('!').join('');
  res += p ? p + ' ' : '';
  res += todo.title;

  const spaces = Math.max(maxLength - res.length + 5, 3);

  if (todo.tags && todo.tags.length > 0)
    res +=
      new Array(spaces).fill(' ').join('') +
      todo.tags.map(t => '#' + t).join(' ');

  return res;
}

export function textToTodo(text) {
  // TODO: implement this
  const res = {
    title: '',
    priority: 0,
    done: false
  };

  let t = text;
  if (t.startsWith('+ ')) res.done = true;
  t = t.slice(2);
  if (t.startsWith('!!')) {
    res.priority = 2;
    t = t.slice(2);
  } else if (t.startsWith('!')) {
    res.priority = 1;
    t = t.slice(1);
  }

  // TODO: better tag parsing
  const tt = t.split('#');

  res.title = tt[0].trim();
  res.tags = tt
    .slice(1)
    .map(t => t.trim())
    .filter(t => t !== '');

  return res;
}
