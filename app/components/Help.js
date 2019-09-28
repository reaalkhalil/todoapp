import React, { useState } from 'react';

import styles from './Help.css';

const sections = [
  {
    header: 'Todo List',
    keys: [
      [['?'], 'Toggle Help'],
      [['tab'], 'Next Split'],
      [['shift', 'tab'], 'Prev Split'],
      [['g', '!then split shortcut'], 'Goto Split'],
      [['c'], 'Create'],
      [['T'], 'Set Due Today'],
      [['e'], 'Mark Done'],
      [['E'], 'Unmark Done'],
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
        <>
          <div className={styles.Header} key={s.header}>
            {s.header}
          </div>
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
        </>
      ))}
      <br />
      <br />
      <br />

      <a
        tabIndex={-1}
        className={styles.Link}
        href="mailto:?subject=Todo App&body=Try this out!%0Ahttps://rea.al/todoapp/"
      >
        Refer to a Friend
      </a>
      <br />
      <a
        tabIndex={-1}
        className={styles.Link}
        href="mailto:reaalkhalil@gmail.com"
      >
        Submit Feedback
      </a>
      <br />
      <br />
    </div>
  );
}
