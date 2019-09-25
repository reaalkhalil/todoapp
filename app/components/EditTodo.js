import React, { useRef, useEffect, useState } from 'react';

import styles from './EditTodo.css';

export default function AddTodo({ initTodo, onUpdate, helpOpen }) {
  const titleRef = useRef();
  const priorityRef = useRef();
  const tagsRef = useRef();

  const defaultTodo = initTodo || {
    title: '',
    priority: 0,
    done: false,
    tags: []
  };

  const [todo, setTodo] = useState(defaultTodo);

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const updateData = (field, value) => {
    const newTodo = { ...todo, [field]: value };
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
      <span className={styles.Label}>Title:</span>
      <input
        ref={titleRef}
        className={['mousetrap', styles.TextInput].join(' ')}
        type="text"
        defaultValue={defaultTodo.title}
        onChange={() => updateData('title', titleRef.current.value)}
      />

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

      <span className={styles.Label}>Tags:</span>
      <textarea
        ref={tagsRef}
        className={['mousetrap', styles.TextArea].join(' ')}
        defaultValue={defaultTodo.tags ? defaultTodo.tags.join('\n') : ''}
        rows={3}
        onChange={() => {
          const v = tagsRef.current.value;
          const addNewLine = v.endsWith('\n');

          const tags = v
            .split('\n')
            .map(t => t.trim())
            .filter(t => t.length > 0);
          tagsRef.current.value = tags.join('\n') + (addNewLine ? '\n' : '');
          updateData('tags', tags);
        }}
      />
    </div>
  );
}
