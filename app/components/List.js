import React, { Component, useState, useRef, useEffect } from 'react';
import { ipcRenderer, shell } from 'electron';

import styles from './List.css';

function validURL(str) {
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

function now() {
  return new Date().getTime();
}

function endOfDay() {
  const a = new Date();
  a.setHours(23, 59, 59, 999);
  return a.getTime();
}

export default function List({
  todos,
  startIndex,
  selectedId,
  onHover,
  helpOpen
}) {
  const listRef = useRef();
  const todoRef = useRef();

  useEffect(() => {
    if ((selectedId !== 0 && !selectedId) || !todoRef) return;

    const idx = todos.findIndex(t => t.id === selectedId);
    const l = listRef.current.getBoundingClientRect();
    const t = todoRef.current.getBoundingClientRect();
    if (l.bottom + 5 < t.bottom) {
      listRef.current.scrollTop += l.height / 2;
      return;
    }

    if (t.top + 5 < l.top) {
      listRef.current.scrollTop -= l.height / 2;
      return;
    }
  }, [selectedId, todoRef]);

  const [hoverId, setHoverId] = useState(null);
  const todoList = todos
    ? todos.map(t => {
        const classes = [styles.TodoItem];
        if (t.id === selectedId) classes.push(styles['TodoItem--selected']);
        if (t.done) classes.push(styles['TodoItem--done']);
        if (!!t.due_at && t.due_at < now() && !t.done)
          classes.push(styles['TodoItem--overdue']);

        const titleClasses = [styles.TodoItem__Title];
        const isLink = validURL(t.title);
        if (isLink) titleClasses.push(styles['TodoItem__Title--link']);

        return (
          <div
            ref={t.id === selectedId ? todoRef : null}
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

            {!!t.due_at && (t.due_at < now() || t.due_at === endOfDay()) ? (
              <span className={styles.TodoItem__DueToday}>
                <i
                  className={
                    'fas ' +
                    (t.due_at < now()
                      ? 'fa-hourglass-end'
                      : 'fa-hourglass-half')
                  }
                />
              </span>
            ) : null}

            <span
              className={titleClasses.join(' ')}
              onClick={() => {
                if (isLink) shell.openExternal(t.title);
              }}
            >
              {t.title}
            </span>

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
    : null;

  const classes = [styles.List];
  if (helpOpen) classes.push(styles['List--help-open']);

  return (
    <div className={classes.join(' ')} ref={listRef}>
      {todoList}
    </div>
  );
}
