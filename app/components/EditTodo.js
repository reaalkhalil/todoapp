import React, { useRef, useEffect, useState } from 'react';

import styles from './EditTodo.css';

export default function EditTodo({ initTodo, onUpdate, helpOpen }) {
  const titleRef = useRef();
  const priorityRef = useRef();
  const tagsRef = useRef();
  const descRef = useRef();

  // ADDFIELDS:
  const defaultTodo = initTodo || {
    title: '',
    content: '',
    priority: 0,
    done: false,
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    done_at: null,
    due_at: null,
    tags: []
  };

  useEffect(() => onUpdate(defaultTodo), []);

  const [todo, setTodo] = useState(defaultTodo);

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const updateData = (field, value) => {
    const newTodo = {
      ...todo,
      [field]: value,
      updated_at: new Date().getTime()
    };

    setTodo(newTodo);
    onUpdate(newTodo);
  };

  const classes = [styles.EditTodo];
  if (helpOpen) classes.push(styles['EditTodo--help-open']);

  return (
    <div className={classes.join(' ')}>
      <div className={styles.Header}>
        <span>{initTodo ? 'Edit Todo' : 'Create Todo'}</span>
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
                defaultValue={defaultTodo.title}
                onChange={() => updateData('title', titleRef.current.value)}
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
                onKeyDown={e => {
                  const v = priorityRef.current.value;
                  let newV = null;
                  switch (e.key) {
                    case 'j':
                      newV = Math.max(v - 1, 0);
                      break;
                    case 'k':
                      newV = Math.min(v + 1, 2);
                      break;
                    case 'p':
                      newV = (v + 1) % 3;
                      break;
                  }
                  if (newV !== null) {
                    priorityRef.current.value = newV;
                    updateData('priority', newV);
                  }
                }}
                defaultValue={defaultTodo.priority}
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
              <input
                type="text"
                ref={tagsRef}
                className={['mousetrap', styles.TextInput].join(' ')}
                defaultValue={
                  defaultTodo.tags ? defaultTodo.tags.join(' ') : ''
                }
                rows={3}
                onChange={() => {
                  const v = tagsRef.current.value;
                  const endWhiteSpace =
                    v.length > 0 && v[v.length - 1] === ' ' ? ' ' : '';

                  const tags = v
                    .split(' ')
                    .map(t => t.trim())
                    .filter(t => t.length > 0);

                  tagsRef.current.value = tags.join(' ') + endWhiteSpace;
                  updateData('tags', tags);
                }}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <span className={styles.Label}>Description:</span>
              <textarea
                ref={descRef}
                className={['mousetrap', styles.TextArea, styles.Content].join(
                  ' '
                )}
                defaultValue={defaultTodo.content || ''}
                rows={4}
                onChange={() => {
                  updateData('content', descRef.current.value);
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      Created: {new Date(todo.created_at).toDateString()}
      <br />
      Last Edit: {new Date(todo.updated_at).toDateString()}
      <br />
      Done: {new Date(todo.done_at).toDateString()}
    </div>
  );
}
