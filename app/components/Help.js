import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import useWindowDimensions from '../window';
import { app } from 'electron';

import shortcuts from './Help/shortcuts';
import pages from './Help/pages';

import styles from './Help.css';

export default function Help({ show, settings }) {
  const { width } = useWindowDimensions();

  const [helpPage, setHelpPage] = useState(null);

  const classes = [styles.Help];
  if (show) classes.push(styles['Help--show']);

  let ss = [
    {
      header: 'Split Shortcuts',
      keys: settings.splits
        .filter(s => !!s.shortcut)
        .map(s => [['g', s.shortcut], s.title])
    },
    {
      header: 'Page Shortcuts',
      keys: settings.pages
        .filter(p => !!p.shortcut)
        .map(p => [['g', p.shortcut], p.title])
    }
  ];

  if (shortcuts.length >= 1)
    ss = [shortcuts[0], ...ss, ...shortcuts.filter((_, i) => i > 0)];

  return (
    <Resizable
      className={classes.join(' ')}
      enable={{
        left: true,
        top: false,
        right: false,
        bottom: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      }}
      minWidth={350}
      maxWidth={width - 180}
      defaultSize={{
        width: 400,
        height: '100vh'
      }}
    >
      <div className={styles.Help__wrapper}>
        <div className={styles.Header}>Keyboard Shortcuts</div>
        {ss.map(s => (
          <div key={s.header}>
            <div className={styles.Header2}>{s.header}</div>
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
        <div className={styles.Header}>Advanced Topics</div>
        <br />
        {pages.map((h, i) => {
          return (
            <div
              key={i}
              className={styles.AdvancedTopic}
              onClick={() => {
                setHelpPage(i);
              }}
            >
              <span className={styles.Key__Label}>{h.title}</span>
              <i
                className="fas fa-arrow-right"
                style={{
                  display: 'block',
                  float: 'right',
                  marginRight: '40px',
                  lineHeight: '36px'
                }}
              ></i>
              <br clear="both" style={{ fontSize: 0 }} />
            </div>
          );
        })}

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

      {helpPage !== null ? (
        <div className={styles.HelpPage}>
          <div className={styles.Header}>{pages[helpPage].title}</div>
          <br />

          <div
            className={styles.AdvancedTopic}
            onClick={() => setHelpPage(null)}
          >
            <i className="fas fa-arrow-left"></i>{' '}
            <span className={styles.Key__Label}>Back</span>
          </div>

          {pages[helpPage].content}
        </div>
      ) : null}
    </Resizable>
  );
}
