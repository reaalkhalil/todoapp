import React, { useRef, useEffect, useState } from 'react';

import styles from './TagEditor.css';

import * as filter from '../filter';

export default function TagEditor({
  allTags,
  currentTags,
  onCancel,
  onExecute
}) {
  const inputRef = useRef();

  const tagListRef = useRef();
  const tagRef = useRef();

  const [tagQuery, setTagQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const [hoverId, setHoverId] = useState(null);

  useEffect(() => {
    if (!tagRef) return;

    const l = tagListRef.current.getBoundingClientRect();
    if (!tagRef.current) return;
    const t = tagRef.current.getBoundingClientRect();

    if (l.bottom + 20 < t.bottom) {
      tagListRef.current.scrollTop += l.height / 2;
      return;
    }

    if (t.top + 20 < l.top) {
      tagListRef.current.scrollTop -= l.height / 2;
      return;
    }
  }, [selectedTag]);

  let sortedCurrentTags = [];

  let tags = allTags
    .filter(t => !(tagQuery && tagQuery !== '') || filter.match(tagQuery, t))
    .filter(t => {
      if (currentTags.indexOf(t) !== -1) {
        sortedCurrentTags.push({ tag: t, current: true });
        return false;
      }
      return true;
    })
    .map(t => ({ tag: t, current: false }));

  tags = [...sortedCurrentTags, ...tags];

  if (tagQuery != '' && !tags.find(t => t.tag === tagQuery))
    tags.push({ tag: tagQuery, current: false, create: true });

  if (
    tags.length > 0 &&
    (selectedTag === '' || !tags.find(t => t.tag === selectedTag))
  )
    setSelectedTag(tags[0].tag);

  const moveSelection = up => {
    if (selectedTag === '' || tags.length < 2) return;
    const idx = tags.findIndex(t => t.tag === selectedTag);
    if (idx === -1 || (up && idx <= 0) || (!up && idx >= tags.length - 1))
      return;

    setSelectedTag(tags[idx + (up ? -1 : 1)].tag);
  };

  return (
    <>
      <div key="bg" className={styles['TagEditor__BG']}></div>

      <div className={styles.TagEditor}>
        <input
          autoFocus={true}
          ref={inputRef}
          className={[
            styles.Tag__Input,
            'mousetrap' /* TODO: idk if this is ok like this */
          ].join(' ')}
          onChange={() => {
            const v = inputRef.current.value.trim().split(/\s+/)[0];
            inputRef.current.value = v;
            setTagQuery(v);
          }}
          onKeyDown={e => {
            if (e.keyCode === 13 || e.keyCode === 9) {
              e.preventDefault();
              e.stopPropagation();
              if (selectedTag !== '') {
                const tag = tags.find(t => t.tag === selectedTag);
                if (!tag) return;
                onExecute(tag.tag, tag.current);
              }
              return;
            }

            if (e.keyCode === 27 || (e.keyCode === 8 && tagQuery === '')) {
              onCancel();
              e.preventDefault();
              e.stopPropagation();
              return;
            }

            if (e.keyCode === 38 || e.keyCode === 40) {
              moveSelection(e.keyCode === 38);
              e.preventDefault();
              e.stopPropagation();
              return;
            }

            if (e.ctrlKey && (e.keyCode === 74 || e.keyCode === 75)) {
              moveSelection(e.keyCode === 75);
              e.preventDefault();
              e.stopPropagation();
              return;
            }
          }}
        />
        <div className={styles.TagList} ref={tagListRef}>
          {tags
            ? tags.map(t => {
                const classes = [styles.TagList__Tag];
                if (t.tag === selectedTag)
                  classes.push(styles['TagList__Tag--focus']);
                return (
                  <div
                    ref={t.tag === selectedTag ? tagRef : null}
                    className={classes.join(' ')}
                    key={t.tag}
                    onMouseMoveCapture={() => {
                      if (t.tag !== hoverId) {
                        setHoverId(t.tag);
                        setSelectedTag(t.tag);
                      }
                    }}
                    onClick={() => onExecute(t.tag, t.current)}
                  >
                    {t.tag === selectedTag ? (
                      <div className={styles.TagList__Tag__highlight} />
                    ) : null}

                    {t.create ? 'Create New Tag ' : ''}
                    <span className={styles.TagList__Tag__Title}>{t.tag}</span>

                    {t.current ? (
                      <div className={styles.TagList__Tag__Current}>
                        <i className="fas fa-check"></i>
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}
          {tags.length === 0 ? (
            <div className={styles.NoTags}>Start typing to add a tag</div>
          ) : null}
        </div>
      </div>
    </>
  );
}
