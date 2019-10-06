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

export function todoToText(todo) {
  let res = '';
  res += (todo.done ? '+' : '-') + ' ';
  const p = new Array(todo.priority ? todo.priority : 0).fill('!').join('');
  res += p ? p + ' ' : '';
  res += todo.title;

  return res;
}
