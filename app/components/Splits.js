import React, { useState, useEffect, useRef } from 'react';
import useWindowDimensions from '../window';

import styles from './Splits.css';

export function Splits({ splits, selectedSplit, helpOpen, onClick }) {
  const sortedSplits = [...splits].sort((a, b) => a.position > b.position);

  return (
    <div className={styles.Splits}>
      {sortedSplits.map((s, i) => {
        const classes = [styles.Split];
        if (s.position === selectedSplit)
          classes.push(styles['Split--selected']);

        return (
          <span
            className={classes.join(' ')}
            key={s.position}
            onClick={() => onClick(s.position)}
          >
            {s.title}
          </span>
        );
      })}
    </div>
  );
}

export function Page({ pages, selectedPage, helpOpen, onClick }) {
  const classes = [styles.Splits];
  if (helpOpen) classes.push(styles['Splits--helpOpen']);

  const page = pages.find(p => p.shortcut === selectedPage);
  const title = (page ? page.title : '') || '[Page Not Found]';

  return (
    <div className={classes.join(' ')}>
      <span
        className={[styles.Split, styles['Split--selected']].join(' ')}
        onClick={onClick}
      >
        {title}
      </span>
    </div>
  );
}
