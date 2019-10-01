import React, { useState } from 'react';
import { app } from 'electron';

import styles from './Help.css';

const sections = [
  {
    header: 'Todo List',
    keys: [
      [['?'], 'Toggle Help'],
      [['tab'], 'Next Split'],
      [['shift', 'tab'], 'Prev Split'],
      [['g', '!then shortcut'], 'Goto Split/Page'],
      [['space'], 'View Todo'],
      [['c'], 'Create'],
      [['t'], '(Un)Set Due Today'],
      [['e'], '(Un)Mark Done'],
      [['d', '!twice'], 'Delete'],
      [['s'], 'Toggle Priority'],
      [['enter'], 'Edit'],
      [['k'], 'Up'],
      [['j'], 'Down'],
      [['/'], 'Search'],
      [['cmd', ','], 'Preferences']
    ]
  },
  {
    header: 'Global Shortcuts',
    keys: [[['ctrl', 'space'], 'Create Todo']]
  },
  {
    header: 'Create Todo',
    keys: [
      [['tab'], 'Next Field'],
      [['shift', 'tab'], 'Prev Field'],
      [['enter'], 'Confirm Create'],
      [['esc'], 'Cancel Create']
    ]
  },
  {
    header: 'Edit Todo',
    keys: [
      [['tab'], 'Next Field'],
      [['shift', 'tab'], 'Prev Field'],
      [['enter'], 'Confirm Edit'],
      [['esc'], 'Cancel Edit']
    ]
  },
  {
    header: 'Search',
    keys: [
      [['enter'], 'Focus to Todos'],
      [['/'], 'Focus to Search'],
      [['esc'], 'Cancel Search']
    ]
  },
  {
    header: 'Preferences',
    keys: [[['cmd', 's'], 'Save Preferences'], [['esc'], 'Cancel']]
  }
];

export default function Help({ show }) {
  const classes = [styles.Help];
  if (show) classes.push(styles['Help--show']);

  return (
    <div className={classes.join(' ')}>
      {sections.map(s => (
        <div key={s.header}>
          <div className={styles.Header}>{s.header}</div>
          <br />
          {s.keys.map((k, i) => (
            <div className={styles.Key} key={i}>
              <span className={styles.Key__Label}>{k[1]}</span>
              <span className={styles.Key__Buttons}>
                {k[0].map((k, j) =>
                  k[0] === '!' ? (
                    <span key={j} className={styles.Key__KeyHelper}>
                      {k.slice(1)}
                    </span>
                  ) : (
                    <span key={j} className={styles.Key__Button}>
                      {k}
                    </span>
                  )
                )}
              </span>
            </div>
          ))}
        </div>
      ))}
      <br />
      <br />
      <br />
      <a
        tabIndex={-1}
        className={styles.Link}
        href="mailto:?subject=Todo App&body=Try this out!%0Ahttps://rea.al/todoapp/"
      >
        Share with a Friend
      </a>
      <a
        tabIndex={-1}
        className={styles.Link}
        href="mailto:reaalkhalil@gmail.com?subject=Todo App Feedback"
      >
        Submit Feedback
      </a>
    </div>
  );
}
