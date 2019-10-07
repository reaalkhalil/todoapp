import React, { useState } from 'react';
import { app } from 'electron';

import styles from './Help.css';

const sections = [
  {
    header: 'Todo List',
    keys: [
      [['shift', '?'], 'Toggle Help'],
      [['tab'], 'Next Split'],
      [['shift', 'tab'], 'Prev Split'],
      [['space'], 'View Todo'],
      [['c'], 'Create'],
      [['t'], '(Un)Set Due Today'],
      [['e'], '(Un)Mark Done'],
      [['d', 'd'], 'Delete'],
      [['s'], 'Toggle Priority'],
      [['enter'], 'Edit'],
      [['k'], 'Up'],
      [['j'], 'Down'],
      [['/'], 'Search'],
      [['cmd', 'c'], 'Copy Todo'],
      [['cmd shift', 'c'], 'Copy List'],
      [['cmd', 'x'], 'Cut Todo'],
      [['cmd', 'v'], 'Import Todo(s)'],
      [['cmd shift', 'v'], 'Paste Todo(s)'],
      [['cmd', 'z'], 'Undo'],
      [['cmd', 'shift', 'z'], 'Redo'],
      [['cmd', ','], 'Preferences']
    ]
  },
  {
    header: 'Import Multiple',
    keys: [[['enter'], 'Confirm'], [['esc'], 'Cancel']]
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
      [['cmd', 'enter'], 'or (in Notes)'],
      [['esc'], 'Cancel Create']
    ]
  },
  {
    header: 'Edit Todo',
    keys: [
      [['tab'], 'Next Field'],
      [['shift', 'tab'], 'Prev Field'],
      [['enter'], 'Confirm Edit'],
      [['cmd', 'enter'], 'or (in Notes)'],
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
    keys: [
      [['esc'], 'Cancel'],
      [['tab'], 'Next Tab'],
      [['shift', 'tab'], 'Prev Tab'],
      [['cmd', 's'], 'Save Preferences']
    ]
  }
];

export default function Help({ show, settings }) {
  const classes = [styles.Help];
  if (show) classes.push(styles['Help--show']);

  let ss = [
    {
      header: 'Split Shortcuts',
      keys: settings.splits
        .filter(s => !!s.shortcut)
        .map(s => [['g', s.shortcut], s.title]) // [[[s.shortcut], s.title]]
    },
    {
      header: 'Page Shortcuts',
      keys: settings.pages
        .filter(p => !!p.shortcut)
        .map(p => [['g', p.shortcut], p.title]) // [[[p.shortcut], p.title]]
    }
  ];

  if (sections.length >= 1) {
    ss = [sections[0], ...ss, ...sections.filter((_, i) => i > 0)];
  }
  return (
    <div className={classes.join(' ')}>
      {ss.map(s => (
        <div key={s.header}>
          <div className={styles.Header}>{s.header}</div>
          <br />
          {s.keys.map((k, i) => (
            <div className={styles.Key} key={i}>
              <span className={styles.Key__Label}>{k[1]}</span>
              <span className={styles.Key__Buttons}>
                {k &&
                  k[0].map((k, j) =>
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
        href="mailto:?subject=Todo App&body=Try this out!%0Ahttps://todoapp.cc/"
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
