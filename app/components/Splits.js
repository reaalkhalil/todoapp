import React, { useState, useEffect } from 'react';

import styles from './Splits.css';

export default function Splits({ splits, selectedSplit }) {
  const sortedSplits = [...splits].sort((a, b) => a.position > b.position);
  return (
    <div className={styles.Splits}>
      {sortedSplits.map(s => {
        const classes = [styles.Split];
        if (s.position === selectedSplit)
          classes.push(styles['Split--selected']);

        return (
          <span className={classes.join(' ')} key={s.position}>
            {s.title}
          </span>
        );
      })}
    </div>
  );
}
