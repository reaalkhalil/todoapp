import React, { useRef, useEffect, useState } from 'react';

import styles from './Search.css';

import * as filter from '../filter';

export default function Search({
  onUpdate,
  onUpdateFocus,
  hasFocus,
  defaultQuery,
  helpOpen
}) {
  const searchRef = useRef();
  const priorityRef = useRef();
  const tagsRef = useRef();

  const [searchQuerty, setSearchQuery] = useState('');

  useEffect(() => {
    if (hasFocus) searchRef.current.focus();
  }, [hasFocus]);

  const updateQuery = q => {
    setSearchQuery(q);
    onUpdate(q);
  };

  const classes = [styles.Search];
  if (hasFocus) classes.push(styles['Search--focus']);
  if (helpOpen) classes.push(styles['Search--help-open']);

  return (
    <div className={classes.join(' ')}>
      <i className={['fas fa-search', styles.Search__Icon].join(' ')}></i>
      <input
        ref={searchRef}
        className={['mousetrap', styles.Search__Input].join(' ')}
        type="text"
        defaultValue={defaultQuery}
        autoFocus={hasFocus}
        onFocus={() => onUpdateFocus(true)}
        onBlur={() => onUpdateFocus(false)}
        onChange={() => updateQuery(searchRef.current.value)}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            searchRef.current.blur();
            e.stopPropagation();
          }
        }}
      />
    </div>
  );
}
