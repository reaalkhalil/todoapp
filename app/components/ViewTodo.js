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
            <span className={styles.Todo__Title}>{todo.title}</span>
            {todo.content ? (
              <span className={styles.Todo__Content}>
                {todo.content.split('\n').map(s => (
                  <>
                    {s}
                    <br />
                  </>
                ))}
              </span>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}
