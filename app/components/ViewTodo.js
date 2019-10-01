import React, { useState, useEffect } from 'react';

import styles from './ViewTodo.css';

export default function ViewTodo({ todo, show }) {
  const todoClasses = [styles.Todo];
  const bgClasses = [styles.Todo__BG];
  if (show) {
    todoClasses.push(styles['Todo--show']);
    bgClasses.push(styles['Todo__BG--show']);
  }

  return (
    <>
      <div className={bgClasses.join(' ')}></div>
      <div className={todoClasses.join(' ')}>
        {todo ? (
          <>
            <span className={styles.Todo__Content}>
              <span className={styles.Todo__Title}>{todo.title}</span>
              {todo.content
                ? todo.content.split('\n').map(s => (
                    <>
                      {s}
                      <br />
                    </>
                  ))
                : null}
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
