import React, { Component, useState } from 'react';
import styles from './List.css';

export default function List({
  todos,
  startIndex,
  selectedId,
  onHover,
  helpOpen
}) {
  const [now, endOfDay] = (function() {
    const a = new Date();
    const b = new Date();
    b.setHours(23, 59, 59, 999);
    return [a.getTime(), b.getTime()];
  })();

  const [hoverId, setHoverId] = useState(null);
  const todoList = todos
    ? todos.map(t => {
        const classes = [styles.TodoItem];
        if (t.id === selectedId) classes.push(styles['TodoItem--selected']);
        if (t.done) classes.push(styles['TodoItem--done']);
        if (!!t.due_at && t.due_at < now && !t.done)
          classes.push(styles['TodoItem--overdue']);

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

            <span className={styles.TodoItem__Priority}>
              {t.priority > 0 ? (
                <span
                  className={
                    styles[`TodoItem__PriorityDots--priority-${t.priority}`]
                  }
                ></span>
              ) : null}
            </span>

            {t.done ? (
              <span className={styles.TodoItem__Done}>
                <i className="fas fa-check" />
              </span>
            ) : null}

            {!!t.content && t.content !== '' ? (
              <span className={styles.TodoItem__HasContent}>
                <i className="fas fa-file-alt" />
              </span>
            ) : null}

            {!!t.due_at && (t.due_at < now || t.due_at === endOfDay) ? (
              <span className={styles.TodoItem__DueToday}>
                <i className="far fa-calendar" />
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
