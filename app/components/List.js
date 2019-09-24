import React, { Component, useState } from 'react';
import styles from './List.css';

export default function List({ todos, startIndex, selectedId, onHover }) {
  const [hoverId, setHoverId] = useState(null);

  const todoList = todos
    ? todos.map(t => {
        const classes = [styles.TodoItem];
        if (t.id === selectedId) classes.push(styles['TodoItem--selected']);
        if (t.priority === 1) classes.push(styles['TodoItem--priority-1']);
        if (t.priority === 2) classes.push(styles['TodoItem--priority-2']);
        return (
          <div
            key={t.id}
            className={classes.join(' ')}
            onMouseMoveCapture={() => {
              if (t.id !== hoverId) {
                setHoverId(t.id);
                onHover(t.id);
              }
            }}
          >
            {t.title}
            {t.tags ? (
              <span style={{ opacity: 0.6, paddingLeft: 200 }}>
                {t.tags.join(', ')}
              </span>
            ) : null}
          </div>
        );
      })
    : 'todos undefined';

  return <div className={styles.List}>{todoList}</div>;
}
