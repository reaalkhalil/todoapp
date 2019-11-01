import React, { useRef, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import CaretPositioning from '../caretpos';
import * as filter from '../filter';

import styles from './Search.css';

const replaceTags = s => s.replace('<', '&lt;').replace('>', '&gt;');

const filterToHTML = f => (f ? '<b>' + replaceTags(f) + '</b>' : '');

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

  const [caretPos, setCaretPos] = useState({ start: 0, end: 0 });
  const [searchHTML, setSearchHTML] = useState(
    (function() {
      if (!defaultQuery) return '';
      const { queries, filters } = filter.parseSearchQ(defaultQuery);
      return [
        ...filters.map(filterToHTML),
        ...queries.map(q => replaceTags(q))
      ].join(' ');
    })()
  );

  useEffect(() => {
    if (hasFocus) searchRef.current.focus();
  }, [hasFocus]);

  useEffect(() => {
    CaretPositioning.restoreSelection(searchRef.current, caretPos);
  }, [searchHTML]);

  const updateQuery = (e, q) => {
    const { all } = filter.parseSearchQ(q);
    const endWhiteSpace = q.length > 0 && q[q.length - 1] === ' ' ? ' ' : '';

    const htmlQ = all
      .filter(s => s && s.str)
      .map(s =>
        s.type === 'filter' ? filterToHTML(s.str) : replaceTags(s.str)
      )
      .map(s => s.replace('\n', ' ').trim())
      .join(' ');

    let savedCaretPosition = CaretPositioning.saveSelection(searchRef.current);

    setCaretPos(savedCaretPosition);
    setSearchHTML(htmlQ + endWhiteSpace);

    onUpdate(q.replace('\n', ' ').trim());
  };

  const classes = [styles.Search];
  if (hasFocus) classes.push(styles['Search--focus']);
  if (helpOpen) classes.push(styles['Search--help-open']);

  return (
    <div className={classes.join(' ')}>
      <i className={['fas fa-search', styles.Search__Icon].join(' ')}></i>
      <ContentEditable
        html={searchHTML}
        innerRef={searchRef}
        tagName="pre"
        className={['mousetrap', styles.Search__Input].join(' ')}
        autoFocus={hasFocus}
        onFocus={() => onUpdateFocus(true)}
        onBlur={() => onUpdateFocus(false)}
        onChange={e => updateQuery(e, searchRef.current.innerText)}
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
