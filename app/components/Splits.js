import React, { useState, useEffect, useRef } from 'react';
import useWindowDimensions from '../window';

import styles from './Splits.css';

export function Splits({ splits, selectedSplit, helpOpen }) {
  const sortedSplits = [...splits].sort((a, b) => a.position > b.position);

  const classes = [styles.Splits];
  if (helpOpen) classes.push(styles['Splits--helpOpen']);

  const splitsRef = useRef();
  const splitRef = useRef();
  const lastSplitRef = useRef();

  const [squeezed, setSqueezed] = useState();

  // TODO: fix this
  //   const { width } = useWindowDimensions();

  //   useEffect(() => {
  //     const last = (
  //       lastSplitRef.current || splitRef.current
  //     ).getBoundingClientRect();

  //     const w = width - (helpOpen ? 330 : 30);
  //     setSqueezed(last.x + last.width > w);
  //   }, [width, selectedSplit]);

  let hitSelected = false;

  return (
    <div className={classes.join(' ')} ref={splitsRef}>
      {sortedSplits.map((s, i) => {
        const classes = [styles.Split];
        if (s.position === selectedSplit) {
          hitSelected = true;
          classes.push(styles['Split--selected']);
        }

        if (squeezed && !hitSelected) return null;

        const last = i === sortedSplits.length - 1;
        return (
          <span
            className={classes.join(' ')}
            key={s.position}
            ref={
              s.position === selectedSplit
                ? splitRef
                : last
                ? lastSplitRef
                : null
            }
          >
            {s.title}
          </span>
        );
      })}
    </div>
  );
}

export function Page({ pages, selectedPage, helpOpen }) {
  const classes = [styles.Splits];
  if (helpOpen) classes.push(styles['Splits--helpOpen']);

  const page = pages.find(p => p.shortcut === selectedPage);
  const title = (page ? page.title : '') || '[Page Not Found]';

  return (
    <div className={classes.join(' ')}>
      <span className={[styles.Split, styles['Split--selected']].join(' ')}>
        {title}
      </span>
    </div>
  );
}
