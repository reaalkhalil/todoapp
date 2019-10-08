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

  if (todo.content && todo.content.length > 0)
    res +=
      '\n' +
      todo.content
        .split('\n')
        .map(c => '\t' + c)
        .join('\n');

  return res;
}

export function textToTodos(text) {
  let todos = [];
  const tt = text.split('\n');
  tt.forEach(t => {
    if ((t.startsWith(' ') || t.startsWith('\t')) && todos.length > 0) {
      todos[todos.length - 1].content.push(t);
      return;
    }

    if (t.trim() === '') return;
    todos.push({ title: t, content: [] });
  });

  return todos.map(t => {
    const todo = textToTodo(t.title);
    todo.content = removeCommonWhitespace(t.content);
    return todo;
  });
}

function textToTodo(text) {
  const res = {
    title: '',
    priority: 0,
    done: false
  };

  let t = text.trimLeft();
  if (t.startsWith('+ ') || t.startsWith('x ')) {
    res.done = true;
    t = t.slice(2);
  } else if (t.startsWith('- ')) {
    t = t.slice(2);
  }

  if (t.startsWith('!!')) {
    res.priority = 2;
    t = t.slice(2);
  } else if (t.startsWith('!')) {
    res.priority = 1;
    t = t.slice(1);
  }

  const tags = [];
  let title = [''];

  const tt = t.trim().split(' ');
  for (let i = tt.length - 1; i >= 0; i--) {
    if (tt[i].startsWith('#')) {
      tags.push(tt[i].slice(1));
    } else {
      title = tt.slice(0, i + 1);
      break;
    }
  }

  res.tags = tags;
  res.title = title.join(' ').trim();

  return res;
}

function removeCommonWhitespace(aa) {
  for (let delim of ['\t', '    ', '   ', '  ', ' ']) {
    if (aa.every(t => t.startsWith(delim)))
      return aa.map(a => a.slice(delim.length)).join('\n');
  }

  return aa.join('\n');
}
