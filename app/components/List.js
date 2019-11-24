import React, { Component, useState, useRef, useEffect } from 'react';
import { shell } from 'electron';

import { validURL, now, endOfDay } from '../utils';
import { getBackgroundPath } from '../utils/background';

import styles from './List.css';

export default function List({
  todos,
  startIndex,
  selectedId,
  onHover,
  showImage,
  onClick
}) {
  const listRef = useRef();
  const todoRef = useRef();

  useEffect(() => {
    if (!todoRef || !todoRef.current) return;

    const l = listRef.current.getBoundingClientRect();
    const t = todoRef.current.getBoundingClientRect();

    if (todos[todos.length - 1].id === selectedId) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
      return;
    }

    const distance = l.height / 2 + 10;

    if (l.bottom + 28 <= t.bottom) {
      listRef.current.scrollTop += distance;
    } else if (l.bottom < t.bottom) {
      listRef.current.scrollTop += t.bottom - l.bottom;
    } else if (t.top + 28 <= l.top) {
      listRef.current.scrollTop -= distance;
    } else if (t.top < l.top) {
      listRef.current.scrollTop -= l.top - t.top;
    }
  }, [selectedId]);

  const [hoverId, setHoverId] = useState(null);
  const todoList = todos
    ? todos.map((t, tIdx) => {
        const classes = [styles.TodoItem];
        if (t.id === selectedId) classes.push(styles['TodoItem--selected']);
        if (t.done) classes.push(styles['TodoItem--done']);
        if (!!t.due_at && t.due_at < now() && !t.done)
          classes.push(styles['TodoItem--overdue']);

        const dueToday =
          !t.done &&
          !!t.due_at &&
          (t.due_at < now() || t.due_at === endOfDay());

        const hasTags = t.tags && t.tags.length > 0;

        const tagsClasses = [styles.TodoItem__Tags];

        const titleClasses = [styles.TodoItem__Title];
        const isLink = validURL(t.title);
        if (isLink) titleClasses.push(styles['TodoItem__Title--link']);
        if (!hasTags) titleClasses.push(styles['TodoItem__Title--no-tags']);

        if (!dueToday) {
          if (hasTags)
            tagsClasses.push(styles['TodoItem__Tags--no-duetoday-icon']);
          else titleClasses.push(styles['TodoItem__Title--no-duetoday-icon']);
          if (!t.notes || t.notes === '') {
            if (hasTags)
              tagsClasses.push(styles['TodoItem__Tags--no-notes-icon']);
            else titleClasses.push(styles['TodoItem__Title--no-notes-icon']);
            if (!t.done) {
              if (hasTags)
                tagsClasses.push(styles['TodoItem__Tags--no-done-icon']);
              else titleClasses.push(styles['TodoItem__Title--no-done-icon']);
            }
          }
        }

        return (
          <div
            ref={t.id === selectedId ? todoRef : null}
            key={t.id === 0 || t.id ? t.id : tIdx}
            className={classes.join(' ')}
            onMouseMoveCapture={() => {
              if (t.id !== hoverId && !!onHover) {
                setHoverId(t.id);
                onHover(t.id);
              }
            }}
            onClick={e => {
              if (e.metaKey && isLink) {
                shell.openExternal(isLink);
              } else if (onClick) onClick(t.id);
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

            {!!t.notes && t.notes !== '' ? (
              <span className={styles.TodoItem__HasContent}>
                <i className="fas fa-file-alt" />
              </span>
            ) : null}

            {dueToday ? (
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

            <span className={titleClasses.join(' ')}>{t.title}</span>

            {t.tags && t.tags.length > 0 ? (
              <div className={tagsClasses.join(' ')}>
                {t.tags.map(g => (
                  <span key={g}>{g}</span>
                ))}
              </div>
            ) : null}
          </div>
        );
      })
    : null;

  return (
    <div className={styles.List} ref={listRef}>
      <div
        style={{
          backgroundImage: `url(${getBackgroundPath()})`
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
