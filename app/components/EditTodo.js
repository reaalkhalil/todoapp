import React, { useRef, useEffect, useState } from 'react';

export default function AddTodo({ initTodo, onUpdate }) {
  const titleRef = useRef();
  const priorityRef = useRef();
  const tagsRef = useRef();

  const [todo, setTodo] = useState(initTodo);

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const updateData = (field, value) => {
    const newTodo = { ...todo, [field]: value };
    setTodo(newTodo);
    onUpdate(newTodo);
  };

  return (
    <>
      [esc] Cancel
      <br />
      [enter] Add
      <br />
      <br />
      <input
        ref={titleRef}
        className="mousetrap"
        type="text"
        defaultValue={initTodo.title}
        onChange={() => updateData('title', titleRef.current.value)}
      />
      <br />
      <input
        ref={priorityRef}
        className="mousetrap"
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
        defaultValue={initTodo.priority}
        onChange={() => {
          let v = parseInt(priorityRef.current.value);
          if (v !== v || typeof v !== 'number') v = 0;
          if (v < 0) v = 0;
          if (v > 2) v = 2;
          priorityRef.current.value = v;
          updateData('priority', v);
        }}
      />
      <br />
      <textarea
        ref={tagsRef}
        className="mousetrap"
        defaultValue={initTodo.tags ? initTodo.tags.join('\n') : ''}
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
    </>
  );
}
