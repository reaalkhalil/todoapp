import React, { Component, useState } from 'react';
import styles from './List.css';

export default function List({
  todos,
  startIndex,
  selectedId,
  onHover,
  helpOpen
}) {
  const [hoverId, setHoverId] = useState(null);
  const todoList = todos
    ? todos.map(t => {
        const classes = [styles.TodoItem];
        if (t.id === selectedId) classes.push(styles['TodoItem--selected']);
        if (t.done) classes.push(styles['TodoItem--done']);

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
            {t.id === selectedId ? (
              <span className={styles.TodoItem__highlight}></span>
            ) : null}

            <span className={styles.TodoItem__Flags}>
              {t.priority > 0 ? (
                <span
                  className={
                    styles[`TodoItem__Priority--priority-${t.priority}`]
                  }
                ></span>
              ) : null}
            </span>

            {t.done ? (
              <span className={styles.TodoItem__Done}>
                <i className="fas fa-check" />
              </span>
            ) : null}

            <span className={styles.TodoItem__Title}>{t.title}</span>

            {t.tags ? (
              <div className={styles.TodoItem__Tags}>
                {t.tags.map(g => (
                  <span key={g}>{g}</span>
                ))}
              </div>
            ) : null}
          </div>
        );
      })
    : 'todos undefined';

  const classes = [styles.List];
  if (helpOpen) classes.push(styles['List--help-open']);

  return <div className={classes.join(' ')}>{todoList}</div>;
}
