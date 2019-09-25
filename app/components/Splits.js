import React, { useState, useEffect } from 'react';

import styles from './Splits.css';

export default function Splits({ splits, selectedSplit }) {
  return (
    <div className={styles.Splits}>
      {splits.map((s, i) => {
        const classes = [styles.Split];
        if (i === selectedSplit) classes.push(styles['Split--selected']);

        return (
          <span className={classes.join(' ')} key={i}>
            {s.title}
          </span>
        );
      })}
    </div>
  );
}
