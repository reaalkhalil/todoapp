import React from 'react';

import styles from '../Help.css';

const pages = [
  //   {
  //     title: 'General',
  //     content: 'copy, copy all, paste, import, cut, undo, redo'
  //   },
  {
    title: 'Filters',
    content: (
      <>
        <p>Filters can be used in search queries and in splits.</p>
        <p>
          In your search query you can use a mix of keywords and filters:
          Keywords are matched to todo titles and filters allow you to match by
          other, more specific, criteria.
        </p>
        <div className={styles.Header2}>Multiple keywords/filters</div>
        <p>
          The search query will filter for todos that match all the keywords and
          filters you provide. So, for example, a query of{' '}
          <span className={styles.q}>green trousers</span> will match with todos
          that have both keywords, anywhere in the title, in any order. And a
          query of <span className={styles.q}>running done=true</span> will
          match with todos that are both done and have "running" in the title.
        </p>
        <div className={styles.Header2}>Starts with</div>
        <p>
          Add a <span className={styles.q}>^</span> before a keyword in your
          query to match todos with titles starting with that keyword.
          <br />
          So the query <span className={styles.q}>^remove</span> will show only
          todos with titles that start with "remove".
        </p>
        <div className={styles.Header2}>Ends with</div>
        <p>
          Add a <span className={styles.q}>$</span> after a keyword in your
          query to match todos with titles ending with that keyword.
          <br />
          So the query <span className={styles.q}>apple$</span> will show only
          todos with titles ending with "apple".
        </p>
        <div className={styles.Header2}>Done</div>
        <p>
          <span className={styles.q}>done</span> or{' '}
          <span className={styles.q}>done=1</span> or{' '}
          <span className={styles.q}>done=true</span> will show only todos that
          have been marked done.
          <br />
          <br />
          <span className={styles.q}>done=0</span> or{' '}
          <span className={styles.q}>done=false</span> will show only todos that
          have not been marked done.
        </p>
        <div className={styles.Header2}>Quotes</div>
        <p>
          Wrapping a filter with quotes forces it to be interpreted as a keyword
          rather than a filter. So{' '}
          <span className={styles.q}>"done=false"</span> will filter for todos
          that have "done=false" in their title, instead of todos that are not
          done.
        </p>
        <div className={styles.Header2}>Notes</div>
        <p>
          <span className={styles.q}>notes=javascript</span> matches with todos
          that have the word "javascript" in their notes.
          <br />
          <br />
          <span className={styles.q}>notes=javascript,sql,golang</span> matches
          with todos where <i>any</i> of the words "javascript" "sql" "golang"
          appear in the notes.
          <br />
          <br />
          <span className={styles.q}>notes>javascript,sql,golang</span> matches
          with todos where <i>all</i> of the words "javascript" "sql" "golang"
          appear anywhere in the notes in any order.
        </p>
        <div className={styles.Header2}>Priority</div>
        <p>
          <span className={styles.q}>priority=1</span> matches todos with a
          priority of 1.
          <br />
          <br />
          <span className={styles.q}>priority>0</span> matches todos with a
          priority greater than 0.
          <br />
          <br />
          <span className={styles.q}>priority=0,2</span> matches todos with a
          priority of 0 or 2.
        </p>
        <div className={styles.Header2}>Tags</div>
        <p>
          <span className={styles.q}>tags=app,ana</span> matches todos where any
          of the tags match either of "app" or "ana". This includes todos with
          tags like "app", "apple", "analytics", "banana".
          <br />
          <br />
          <span className={styles.q}>tags=^app$,^ana</span> matches todos with
          either an "app" tag or a tag that starts with "ana".
          <br />
          <br />
          <span className={styles.q}>tags&gt;tag1,tag2,tag3</span> matches todos
          which have for all of "tag1", "tag2", and "tag3", at least 1 matching
          tag.
          <br />
          <br />
          <span className={styles.q}>tags&lt;tag1,tag2</span> matches todos
          which have no tags matching any of "tag1" and "tag2".
        </p>
        <div className={styles.Header2}>Time Filters</div>
        <p>
          There are 4 time related properties on a todo:
          <br />
          <br />
          <span className={styles.q}>created_at</span> and{' '}
          <span className={styles.q}>updated_at</span>: Every todo has both a
          created_at and an updated_at timestamp, which are set when the todo
          was first created. Whenever a todo is edited, its updated_at time is
          updated.
          <br />
          <br />
          <span className={styles.q}>done_at</span>: A todo's done_at timestamp
          is set to when it was marked as done. Todos that are not done won't
          match with any filters on done_at.
          <br />
          <br />
          <span className={styles.q}>due_at</span>: If a todo is in 'Backlog',
          then its due_at will not be set, so it won't match with any filters on
          due_at. If a todo is in 'Today', then its due_at will be the end of
          the current day, at midnight. When the current time is greater than a
          todo's due_at, it becomes overdue and is displayed in red.
        </p>
        <p>
          To filter by these properties, you need to compare them to a base
          time: Such as <span className={styles.q}>eod</span>, end of day
          (midnight), or <span className={styles.q}>now</span>, the current
          time.
        </p>
        <p>
          <span className={styles.q}>due_at>=eod</span> filters for todos that
          are due for or after midnight.
        </p>
        <p>
          You can also use time durations in the filter:{' '}
          <span className={styles.q}>min</span> minute,{' '}
          <span className={styles.q}>h</span> hour,{' '}
          <span className={styles.q}>d</span> day,{' '}
          <span className={styles.q}>w</span> week,{' '}
          <span className={styles.q}>m</span> month.
        </p>
        <p>
          <span className={styles.q}>due_at&lt;eod+w</span> filters for todos
          that are due any time prior to midnight a week from now.
          <br />
          <br />
          <span className={styles.q}>created_at&lt;=now-2d</span> filters for
          todos that were created at this time 2 days ago or anytime before
          that.
        </p>
        <div className={styles.Header2}>A Full Example</div>
        <p>
          <span className={styles.q}>
            done=true done_at&lt;=eod-d done_at&gt;=eod-2d
          </span>{' '}
          filters for todos that are done and have been marked done between the
          last midnight and the midnight before that.
        </p>
      </>
    )
  },

  {
    title: 'Sort',
    content: (
      <>
        <p>
          You can customise the sorting order of todos in each split. For
          example:
        </p>
        <p>
          <span className={styles.q}>due_at</span> sorts todos by increasing due
          date, so larger due dates (the ones furthest in the future) will
          appear at the bottom.
        </p>
        <p>
          Add <span className={styles.q}>:asc</span> or{' '}
          <span className={styles.q}>:desc</span> after a sort criteria to
          specify the order:
        </p>
        <p>
          <span className={styles.q}>priority:desc</span> sorts todos by
          decreasing priority, so higher priority todos appear at the top.
        </p>
        <p>Just like filters, you can combine multiple sorting expressions:</p>
        <p>
          <span className={styles.q}>priority:desc due_at</span> sorts todos by
          decreasing priority first then by increasing due date.
        </p>
        <p>You can use filter expressions inside sort expressions:</p>
        <p>
          <span className={styles.q}>due_at&lt;eod</span> sorts todos by whether
          or not their due date is before midnight.
        </p>

        {/*
        
{
    title:      string
    content:    string
    priority:   number [0, 1, 2]
    done:       boolean
    created_at: number (unix timestamp)
    updated_at: number (unix timestamp)
    done_at:    number (unix timestamp)
    due_at:     number (unix timestamp)
    tags:       string[]
}
 
         */}
      </>
    )
  },

  {
    title: 'Splits: Basics',
    content: 'position, index, create & edit splits'
  },

  {
    title: 'Splits: Default Todos',
    content: 'position, index'
  },

  {
    title: 'Advanced Preferences',
    content: '__'
  }
];

export default pages;
