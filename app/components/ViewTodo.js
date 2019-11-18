import React, { useState, useEffect } from 'react';
import { shell } from 'electron';
import { validURL } from '../utils';

import styles from './ViewTodo.css';

export default function ViewTodo({ todo, show, onClick }) {
  const todoClasses = [styles.Todo];
  const bgClasses = [styles.Todo__BG];
  if (show) {
    todoClasses.push(styles['Todo--show']);
    bgClasses.push(styles['Todo__BG--show']);
  }

  const titleClasses = [styles.Todo__Title];
  const isLink = todo && todo.title ? validURL(todo.title) : false;
  if (isLink) titleClasses.push(styles['Todo__Title--link']);

  return (
    <>
      <div key="bg" className={bgClasses.join(' ')} onClick={onClick}></div>
      <div key="todo" className={todoClasses.join(' ')}>
        {todo ? (
          <>
            <span className={styles.Todo__Content}>
              <span
                className={titleClasses.join(' ')}
                onClick={() => {
                  if (isLink) shell.openExternal(isLink);
                }}
              >
                {todo.title}
              </span>
              {todo.notes}
            </span>
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
          </>
        ) : null}
      </div>
    </>
  );
}
