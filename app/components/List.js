import React, { Component, useState, useRef, useEffect } from 'react';
import { shell } from 'electron';

import { validURL, now, endOfDay } from '../utils';

import styles from './List.css';

const imageIds = [
  104,
  106,
  112,
  121,
  118,
  127,
  128,
  129,
  134,
  136,
  139,
  140,
  142,
  146,
  151,
  152,
  153,
  154,
  155,
  162,
  164,
  165,
  166,
  167,
  170,
  173,
  177,
  179,
  184,
  185,
  186,
  188,
  190,
  200,
  217,
  235,
  236,
  253
];

export default function List({
  todos,
  startIndex,
  selectedId,
  onHover,
  onClick,
  helpOpen,
  showImage
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
    ? todos.map((t, tIdx) => {
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
            key={t.id === 0 || t.id ? t.id : tIdx}
            className={classes.join(' ')}
            onMouseMoveCapture={() => {
              if (t.id !== hoverId) {
                setHoverId(t.id);
                onHover(t.id);
              }
            }}
            onClick={e => onClick(t.id, e.metaKey)}
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
              onClick={e => {
                if (e.metaKey && isLink) shell.openExternal(t.title);
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
      <div
        style={{
          backgroundImage: `url(${imageURL()})`
        }}
        className={[
          styles.ListBGImage,
          showImage && todoList && todoList.length === 0
            ? styles['ListBGImage--show']
            : ''
        ].join(' ')}
      />

      {todoList && todoList.length > 0 ? todoList : null}
    </div>
  );
}

function imageURL() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);

  const id = imageIds[day % imageIds.length];

  return `https://picsum.photos/id/${id}/2000/2000`;
}
