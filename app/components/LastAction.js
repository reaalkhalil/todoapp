import React, { useRef, useEffect, useState } from 'react';

import styles from './LastAction.css';

export default function LastAction({ lastAction }) {
  const [show, setShow] = useState(false);
  const [lastTimeout, setLastTimeout] = useState(null);

  useEffect(() => {
    if (!!lastAction && lastAction !== '') setShow(true);
    else return;

    if (lastTimeout !== null) clearTimeout(lastTimeout);

    setLastTimeout(
      setTimeout(() => {
        setShow(false);
        setLastTimeout(null);
      }, 5000)
    );
  }, [lastAction]);

  const classes = [styles.LastAction];
  if (show) classes.push(styles['LastAction--show']);

  return lastAction ? (
    <div className={classes.join(' ')}>{lastAction.text}</div>
  ) : null;
}
