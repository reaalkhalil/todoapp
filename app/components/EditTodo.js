import React, { useRef, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import CaretPositioning from '../caretpos';
import * as Mousetrap from 'mousetrap';

import styles from './EditTodo.css';

function tagsToHTML(tags) {
  if (!tags) return '';
  return tags.map(t => '<b>' + t + '</b>').join(' ');
}

export default function EditTodo({
  defaultTodo = {},
  onUpdate,
  create,
  trigger,
  cancel
}) {
  const titleRef = useRef();
  const priorityRef = useRef();
  const tagsRef = useRef();
  const descRef = useRef();

  const endOfDay = function() {
    const a = new Date();
    a.setHours(23, 59, 59, 999);
    return a.getTime();
  };

  useEffect(() => {
    onUpdate({
      ...defaultTodo,
      updated_at: new Date().getTime()
    });
  }, []);

  const [caretPos, setCaretPos] = useState({ start: 0, end: 0 });
  const [todo, setTodo] = useState(defaultTodo);
  const [tagsHTML, setTagsHTML] = useState(
    defaultTodo.tags && defaultTodo.tags.length
      ? tagsToHTML(defaultTodo.tags) + ' '
      : ''
  );

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    if (tagsRef.current !== document.activeElement) return;
    CaretPositioning.restoreSelection(tagsRef.current, caretPos);
  }, [tagsHTML]);

  const updateData = (field, value) => {
    const newTodo = {
      ...todo,
      [field]: value,
      updated_at: new Date().getTime()
    };

    newTodo.tags = newTodo.tags.filter((t, i) => newTodo.tags.indexOf(t) === i);

    setTodo(newTodo);
    onUpdate(newTodo);
  };

  const updateTags = v => {
    const endWhiteSpace =
      v.length > 0 && v[v.length - 1].trim() === '' ? ' ' : '';

    let tags = v.split(/\s+/).filter(t => !!t);

    tags = tags.filter(
      (t, i) =>
        tags.indexOf(t) === i || (i === tags.length - 1 && !endWhiteSpace)
    );

    let html = tagsToHTML(tags.slice(0, -1));

    if (endWhiteSpace) {
      html += (tags.length > 1 ? ' ' : '') + tagsToHTML(tags.slice(-1));
    } else if (tags.length > 0) {
      html += (tags.length > 1 ? ' ' : '') + tags[tags.length - 1];
    }

    let savedCaretPosition = CaretPositioning.saveSelection(tagsRef.current);
    setCaretPos(savedCaretPosition);

    setTagsHTML(html + endWhiteSpace);
    updateData('tags', tags);
  };

  return (
    <div className={styles.EditTodo}>
      <div className={styles.Header}>
        <span>{create ? 'Create Todo' : 'Edit Todo'}</span>
      </div>
      <table className={styles.Table}>
        <tbody>
          <tr>
            <td colSpan={2}>
              <span className={styles.Label}>Title:</span>
              <input
                ref={titleRef}
                className={['mousetrap', styles.TextInput].join(' ')}
                type="text"
                defaultValue={defaultTodo ? defaultTodo.title.trim() : ''}
                onChange={() => updateData('title', titleRef.current.value)}
                onKeyDown={e => {
                  if (e.keyCode === 9 && event.shiftKey) {
                    descRef.current.focus();
                    e.preventDefault();
                  }
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <span className={styles.Label}>Priority:</span>
              <input
                ref={priorityRef}
                className={['mousetrap', styles.Number].join(' ')}
                type="number"
                defaultValue={0}
                step={1}
                onKeyPress={e => {
                  const v = priorityRef.current.value;
                  let newV = null;
                  switch (e.key) {
                    case 'ArrowDown':
                    case 'j':
                      newV = Math.max(v - 1, 0);
                      break;
                    case 'ArrowUp':
                    case 'k':
                      newV = Math.min(v + 1, 2);
                      break;
                    case 's':
                      newV = (v + 1) % 3;
                      break;
                  }
                  if (newV !== null) priorityRef.current.value = newV;
                }}
                defaultValue={defaultTodo ? defaultTodo.priority : 0}
                onChange={() => {
                  let v = parseInt(priorityRef.current.value);
                  if (v !== v || typeof v !== 'number') v = 0;
                  if (v < 0) v = 0;
                  if (v > 2) v = 2;
                  priorityRef.current.value = v;
                  updateData('priority', v);
                }}
              />
            </td>
            <td>
              <span className={styles.Label}>Tags:</span>
              <ContentEditable
                html={tagsHTML}
                innerRef={tagsRef}
                tagName="pre"
                className={[
                  'mousetrap',
                  styles.TextInput,
                  styles.TagInput
                ].join(' ')}
                onFocus={() => {
                  const sel = window.getSelection();
                  sel.selectAllChildren(tagsRef.current);
                  sel.collapseToEnd();
                }}
                onBlur={() => {
                  const v = tagsRef.current.innerText;
                  if (v.length > 0 && v[v.length - 1] !== ' ')
                    updateTags(v + ' ');
                }}
                onChange={() => updateTags(tagsRef.current.innerText)}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <span className={styles.Label}>Notes:</span>
              <textarea
                ref={descRef}
                className={[styles.TextArea, styles.Content].join(' ')}
                defaultValue={defaultTodo.content || ''}
                onChange={() => {
                  updateData('content', descRef.current.value);
                }}
                onKeyDown={e => {
                  if (e.keyCode === 9 && !event.shiftKey) {
                    titleRef.current.focus();
                    e.preventDefault();
                  }

                  if (e.keyCode === 27) cancel();

                  if (e.keyCode === 13) {
                    if (e.metaKey) {
                      trigger();
                      return;
                    }
                    const self = descRef.current;
                    if (self.selectionStart == self.selectionEnd) {
                      var sel = self.selectionStart;
                      var text = self.value;
                      while (sel > 0 && text[sel - 1] != '\n') sel--;

                      var lineStart = sel;
                      while (text[sel] == ' ' || text[sel] == '\t') sel++;

                      if (sel > lineStart) {
                        document.execCommand(
                          'insertText',
                          false,
                          '\n' + text.substr(lineStart, sel - lineStart)
                        );

                        self.blur();
                        self.focus();
                        e.preventDefault();
                      }
                    }
                  }
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className={styles.Times}>
        <table>
          <tbody>
            {todo.created_at ? (
              <tr>
                <td>Created: </td>
                <td>{new Date(todo.created_at).toDateString()}</td>
              </tr>
            ) : null}
            {todo.updated_at ? (
              <tr>
                <td>Last Edit:</td>
                <td>{new Date(todo.updated_at).toDateString()}</td>
              </tr>
            ) : null}
            {todo.done_at ? (
              <tr>
                <td>Done:</td>
                <td>{new Date(todo.done_at).toDateString()}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
