import React, { useState } from 'react';

import styles from './Help.css';

const sections = [
  {
    header: 'Todo List',
    keys: [
      [['?'], 'Toggle Help'],
      [['tab'], 'Next Split'],
      [['shift+tab'], 'Prev Split'],
      [['g', 't'], 'Goto Todos'],
      [['g', 'd'], 'Goto Done'],
      [['c'], 'Create'],
      [['e'], '(Un)Mark Done'],
      [['d'], 'Delete'],
      [['p'], 'Edit Priority'],
      [['enter'], 'Edit'],
      [['k'], 'Up'],
      [['j'], 'Down'],
      [['/'], 'Search']
    ]
  },
  {
    header: 'Create Todo',
    keys: [
      [['tab'], 'Next Field'],
      [['shift+tab'], 'Prev Field'],
      [['enter'], 'Confirm Create'],
      [['esc'], 'Cancel Create']
    ]
  },
  {
    header: 'Edit Todo',
    keys: [
      [['tab'], 'Next Field'],
      [['shift+tab'], 'Prev Field'],
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
              {k[0].map(k => (
                <span className={styles.Key__Button}>{k}</span>
              ))}
              <span className={styles.Key__Label}>{k[1]}</span>
            </div>
          ))}
        </>
      ))}
      <br />
      <br />
      <br />

      <a className={styles.Link} onClick={() => {}}>
        Refer to a Friend
      </a>
      <br />
      <a className={styles.Link} onClick={() => {}}>
        Submit Feedback
      </a>
    </div>
  );
}
