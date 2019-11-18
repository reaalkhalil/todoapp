import React, { useRef, useEffect, useState } from 'react';
import * as Mousetrap from 'mousetrap';
import * as filter from '../filter';
import CaretPositioning from '../caretpos';
import ContentEditable from 'react-contenteditable';

import styles from './EditSplit.css';

const replaceTags = s => s.replace('<', '&lt;').replace('>', '&gt;');

const filterToHTML = f => (f ? '<b>' + replaceTags(f) + '</b>' : '');

export default function EditSplit({
  splits,
  defaultSplit = {},
  defaultIndex,
  onUpdate,
  create,
  trigger,
  cancel
}) {
  const titleRef = useRef();
  const shortcutRef = useRef();
  const positionRef = useRef();
  const indexRef = useRef();
  const filtersRef = useRef();
  const sortRef = useRef();
  const defaultRef = useRef();

  const maxIndex = splits.length - (create ? 0 : 1);
  const maxPosition = (function() {
    let max = 0;
    splits.forEach(s => (max = Math.max(s.position, max)));
    return max + (create ? 1 : 0);
  })();

  useEffect(() => {
    const s = {
      title: '',
      shortcut: '',
      position: maxPosition,
      filters: '',
      sort: '',
      default: {},
      ...defaultSplit
    };

    if (!create) {
      s.oldIndex = defaultIndex;
      s.index = defaultIndex;
    }

    if (s.index === undefined) s.index = maxIndex;

    defaultSplit = s;
    onUpdate(defaultSplit);
    setSplit(defaultSplit);
  }, []);

  const [filtersHTML, setFiltersHTML] = useState(
    (function() {
      if (!defaultSplit || !defaultSplit.filters) return '';
      const { all } = filter.parseSearchQ(defaultSplit.filters);

      return all
        .filter(s => s && s.str)
        .map(s =>
          s.type === 'filter' ? filterToHTML(s.str) : replaceTags(s.str)
        )
        .map(s => s.replace('\n', ' '))
        .join(' ');
    })()
  );

  const [sortHTML, setSortHTML] = useState(
    (function() {
      if (!defaultSplit || !defaultSplit.sort) return '';
      const sort = filter.parseSort(defaultSplit.sort);
      return sort
        .filter(s => s && s.str)
        .map(s => (s.type === 'str' ? replaceTags(s.str) : filterToHTML(s.str)))
        .map(s => s.replace('\n', ' '))
        .join(' ');

      return '';
    })()
  );

  const [split, setSplit] = useState(defaultSplit);
  const [index, setIndex] = useState(
    defaultIndex === parseInt(defaultIndex) ? defaultIndex : maxIndex
  );

  const updateData = (field, value) => {
    const d = (function() {
      if (field !== 'default') return null;
      try {
        const res = new Function(`
         const a = JSON.stringify(${value})
         if (JSON.stringify(JSON.parse(a).constructor()) === '{}') return JSON.parse(a)
         return null
        `)();

        return res;
      } catch (e) {
        return value;
      }
    })();

    const newSplit = {
      ...split,
      [field]: field === 'default' ? d : value
    };

    setSplit(newSplit);
    onUpdate(newSplit);
  };

  const [fCaretPos, setFCaretPos] = useState({ start: 0, end: 0 });
  const [sCaretPos, setSCaretPos] = useState({ start: 0, end: 0 });

  useEffect(() => {
    CaretPositioning.restoreSelection(filtersRef.current, fCaretPos);
  }, [filtersHTML]);

  useEffect(() => {
    CaretPositioning.restoreSelection(sortRef.current, sCaretPos);
  }, [sortHTML]);

  const updateQuery = (e, t, q) => {
    if (t !== 'filters' && t !== 'sort') return;

    const endWhiteSpace =
      q.length > 0 && q[q.length - 1].trim() === '' ? q[q.length - 1] : '';

    let htmlQ = '';

    if (t === 'filters') {
      const { all } = filter.parseSearchQ(q);
      htmlQ = all
        ? all
            .filter(s => s && s.str)
            .map(s =>
              s.type === 'filter' ? filterToHTML(s.str) : replaceTags(s.str)
            )
            .map(s => s.replace('\n', ' '))
            .join(' ')
        : '';
    } else {
      const sort = filter.parseSort(q);
      htmlQ = sort
        ? sort
            .filter(s => s && s.str)
            .map(s =>
              s.type === 'str' ? replaceTags(s.str) : filterToHTML(s.str)
            )
            .map(s => s.replace('\n', ' '))
            .join(' ')
        : '';
    }

    let savedCaretPosition = CaretPositioning.saveSelection(
      t === 'filters' ? filtersRef.current : sortRef.current
    );

    if (t === 'filters') {
      setFCaretPos(savedCaretPosition);
      setFiltersHTML(htmlQ + endWhiteSpace);
    } else {
      setSCaretPos(savedCaretPosition);
      setSortHTML(htmlQ + endWhiteSpace);
    }

    updateData(t, q.replace('\n', ' '));
  };

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  return (
    <div className={styles.EditSplit}>
      <div className={styles.Header}>
        <span>{create ? 'Create Split' : 'Edit Split'}</span>
      </div>
      <table className={styles.Table}>
        <tbody>
          <tr>
            <td colSpan={3}>
              <span className={styles.Label}>Title:</span>
              <input
                ref={titleRef}
                className={['mousetrap', styles.TextInput].join(' ')}
                type="text"
                defaultValue={
                  defaultSplit && defaultSplit.title
                    ? defaultSplit.title.trim()
                    : ''
                }
                onChange={() => updateData('title', titleRef.current.value)}
                onKeyDown={e => {
                  if (e.keyCode === 9 && event.shiftKey) {
                    defaultRef.current.focus();
                    e.preventDefault();
                  }
                }}
              />
            </td>
            <td>
              <span className={styles.Label}>Position:</span>
              <input
                ref={positionRef}
                className={['mousetrap', styles.Number].join(' ')}
                type="number"
                step={1}
                defaultValue={
                  defaultSplit &&
                  (defaultSplit.position === 0 || defaultSplit.position)
                    ? defaultSplit.position
                    : maxPosition
                }
                onKeyPress={e => {
                  const v = positionRef.current.value;
                  let newV = null;
                  switch (e.key) {
                    case 'ArrowDown':
                    case 'j':
                      newV = Math.max(v - 1, 0);
                      e.preventDefault();
                      e.stopPropagation();
                      break;
                    case 'ArrowUp':
                    case 'k':
                      newV = Math.min(v + 1, maxPosition);
                      e.preventDefault();
                      e.stopPropagation();
                      break;
                  }

                  if (newV !== null) {
                    positionRef.current.value = newV;
                    updateData('position', newV);
                  }
                }}
                onChange={() => {
                  let v = parseInt(positionRef.current.value);
                  if (v !== v || typeof v !== 'number') v = 0;
                  if (v < 0) v = 0;
                  if (v > maxPosition) v = maxPosition;
                  positionRef.current.value = v;
                  updateData('position', v);
                }}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <span className={styles.Label}>Filters:</span>
              <ContentEditable
                html={filtersHTML}
                tagName="pre"
                innerRef={filtersRef}
                className={[
                  'mousetrap',
                  styles.TextInput,
                  styles.TagInput
                ].join(' ')}
                onChange={e =>
                  updateQuery(e, 'filters', filtersRef.current.innerText)
                }
                onFocus={() => {
                  const sel = window.getSelection();
                  sel.selectAllChildren(filtersRef.current);
                  sel.collapseToEnd();
                }}
              />
            </td>

            <td>
              <span className={styles.Label}>Index:</span>
              <input
                className={['mousetrap', styles.Number].join(' ')}
                ref={indexRef}
                type="number"
                step={1}
                defaultValue={
                  defaultSplit &&
                  defaultSplit.index === parseInt(defaultSplit.index)
                    ? defaultSplit.index
                    : defaultIndex
                }
                onKeyPress={e => {
                  let newIndex = null;
                  switch (e.key) {
                    case 'ArrowDown':
                    case 'j':
                      newIndex = Math.max(indexRef.current.value - 1, 0);
                      break;
                    case 'ArrowUp':
                    case 'k':
                      newIndex = Math.min(indexRef.current.value + 1, maxIndex);
                      break;
                  }

                  if (newIndex !== null) indexRef.current.value = newIndex;
                }}
                onChange={() => {
                  let v = parseInt(indexRef.current.value);
                  if (v !== v || typeof v !== 'number') v = 0;
                  if (v < 0) v = 0;
                  if (v > maxIndex) v = maxIndex;
                  indexRef.current.value = v;
                  updateData('index', v);
                }}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <span className={styles.Label}>Sort:</span>
              <ContentEditable
                html={sortHTML}
                tagName="pre"
                innerRef={sortRef}
                className={[
                  'mousetrap',
                  styles.TextInput,
                  styles.TagInput
                ].join(' ')}
                onChange={e =>
                  updateQuery(e, 'sort', sortRef.current.innerText)
                }
                onFocus={() => {
                  const sel = window.getSelection();
                  sel.selectAllChildren(sortRef.current);
                  sel.collapseToEnd();
                }}
              />
            </td>
            <td>
              <span className={styles.Label}>Shortcut:</span>
              <input
                type="text"
                ref={shortcutRef}
                defaultValue={
                  defaultSplit && defaultSplit.shortcut
                    ? defaultSplit.shortcut
                    : ''
                }
                className={[
                  'mousetrap',
                  styles.TextInput,
                  styles['TextInput--char']
                ].join(' ')}
                onChange={() => {
                  let v = shortcutRef.current.value;
                  v = v && v.trim() ? v.trim() : '';
                  v = v && v[v.length - 1];
                  shortcutRef.current.value = v;
                  updateData('shortcut', v);
                }}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <span className={styles.Label}>Default Todo:</span>
              <textarea
                ref={defaultRef}
                className={[styles.TextArea, styles.Content].join(' ')}
                defaultValue={
                  JSON.stringify(
                    defaultSplit && defaultSplit.default
                      ? defaultSplit.default
                      : {},
                    '\n',
                    '  '
                  ) || ''
                }
                onChange={() => {
                  updateData('default', defaultRef.current.value);
                }}
                onKeyDown={e => {
                  if (e.keyCode === 9 && !event.shiftKey) {
                    titleRef.current.focus();
                    e.preventDefault();
                  }

                  if (e.keyCode === 27) cancel();

                  if (e.keyCode === 13) {
                    if (e.metaKey) {
                      trigger();
                      return;
                    }
                    const self = defaultRef.current;
                    if (self.selectionStart == self.selectionEnd) {
                      var sel = self.selectionStart;
                      var text = self.value;
                      while (sel > 0 && text[sel - 1] != '\n') sel--;

                      var lineStart = sel;
                      while (text[sel] == ' ' || text[sel] == '\t') sel++;

                      if (sel > lineStart) {
                        document.execCommand(
                          'insertText',
                          false,
                          '\n' + text.substr(lineStart, sel - lineStart)
                        );

                        self.blur();
                        self.focus();
                        e.preventDefault();
                      }
                    }
                  }
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
