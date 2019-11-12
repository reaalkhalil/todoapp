import React from 'react';

import styles from '../Help.css';

function c(a) {
  return <span className={styles.q}>{a}</span>;
}

const pages = [
  {
    title: 'General',
    content: (
      <>
        <div className={styles.Header2}>Undo and Redo</div>
        <p>
          You can undo and redo using the standard shortcuts {c('cmd')} +{' '}
          {c('z')} and {c('cmd')} + {c('shift')} + {c('z')}.
          <br />
          <br /> At the moment these only apply to actions relating to todos
          (create / edit todo etc.) but not split settings or integrations.
        </p>
        <div className={styles.Header2}>Copy, Paste, etc.</div>
        <p>
          You can cut and copy todos; using the standard shortcuts: {c('cmd')} +
          {c('x')} and
          {c('cmd')} + {c('c')}.
          <br />
          To copy all the todos displayed in a list use the shortcut {c(
            'cmd'
          )}{' '}
          + {c('shift')} + {c('c')}.
        </p>
        <p>
          There are two ways to paste todos:
          <br />
          {c('cmd')} + {c('v')}, called import, prompts you for edits before
          adding the todos.
          <br />
          {c('cmd')} + {c('shift')} + {c('v')}, called paste, adds them without
          any prompts.
        </p>

        <div className={styles.Header2}>Into and out of the Clipboard</div>
        <p>
          When copied to the clipboard a todo is converted into text format:
          <br />
          <br />
          {c(
            <>
              - ! title #tag #tag2
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;notes go here <br />
              &nbsp;&nbsp;&nbsp;&nbsp;and more notes...
            </>
          )}
        </p>
        <p>
          Todos marked done have a {c('+')} instead of a {c('-')} at the start.
          The number of exclamation marks indicates the priority, and is
          followed by the title then the tags. Notes are on the next set of
          lines, preceded by a tab on every line.
        </p>
        <p>
          When pasting text into TodoApp, it will be parsed according to that
          format (the {c('-')} at the front is optional).
          <br />
          <br />
          Pasting the following will produce 3 todos:
          <br />
          <br />
          {c(
            <>
              todo1
              <br />
              todo2
              <br />
              todo3
            </>
          )}
          <br />
          <br />
          Pasting the following will produce 2 todos with content:
          <br />
          <br />
          {c(
            <>
              todo1
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;content1
              <br />
              todo2
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;content2
            </>
          )}
          <br />
        </p>
      </>
    )
  },
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
          filters you provide. So, for example, a query of {c('green trousers')}{' '}
          will match with todos that have both keywords, anywhere in the title,
          in any order. And a query of {c('running done=true')} will match with
          todos that are both done and have "running" in the title.
        </p>
        <div className={styles.Header2}>Starts with</div>
        <p>
          Add a {c('^')} before a keyword in your query to match todos with
          titles starting with that keyword.
          <br />
          So the query {c('^remove')} will show only todos with titles that
          start with "remove".
        </p>
        <div className={styles.Header2}>Ends with</div>
        <p>
          Add a {c('$')} after a keyword in your query to match todos with
          titles ending with that keyword.
          <br />
          So the query {c('apple$')} will show only todos with titles ending
          with "apple".
        </p>
        <div className={styles.Header2}>Done</div>
        <p>
          {c('done')} or {c('done=1')} or {c('done=true')} will show only todos
          that have been marked done.
          <br />
          <br />
          {c('done=0')} or {c('done=false')} will show only todos that have not
          been marked done.
        </p>
        <div className={styles.Header2}>Quotes</div>
        <p>
          Wrapping a filter with quotes forces it to be interpreted as a keyword
          rather than a filter. So {c('"done=false"')} will filter for todos
          that have "done=false" in their title, instead of todos that are not
          done.
        </p>
        <div className={styles.Header2}>Notes</div>
        <p>
          {c('notes=javascript')} matches with todos that have the word
          "javascript" in their notes.
          <br />
          <br />
          {c('notes=javascript,sql,golang')} matches with todos where <i>any</i>{' '}
          of the words "javascript" "sql" "golang" appear in the notes.
          <br />
          <br />
          {c('notes>javascript,sql,golang')} matches with todos where <i>all</i>{' '}
          of the words "javascript" "sql" "golang" appear anywhere in the notes
          in any order.
        </p>
        <div className={styles.Header2}>Priority</div>
        <p>
          {c('priority=1')} matches todos with a priority of 1.
          <br />
          <br />
          {c('priority>0')} matches todos with a priority greater than 0.
          <br />
          <br />
          {c('priority=0,2')} matches todos with a priority of 0 or 2.
        </p>
        <div className={styles.Header2}>Tags</div>
        <p>
          {c('tags=app,ana')} matches todos where any of the tags match either
          of "app" or "ana". This includes todos with tags like "app", "apple",
          "analytics", "banana".
          <br />
          <br />
          {c('tags=^app$,^ana')} matches todos with either an "app" tag or a tag
          that starts with "ana".
          <br />
          <br />
          {c('tags>tag1,tag2,tag3')} matches todos which have for all of "tag1",
          "tag2", and "tag3", at least 1 matching tag.
          <br />
          <br />
          {c('tags<tag1,tag2')} matches todos which have no tags matching any of
          "tag1" and "tag2".
        </p>
        <div className={styles.Header2}>Time Filters</div>
        <p>
          There are 4 time related properties on a todo:
          <br />
          <br />
          {c('created_at')} and {c('updated_at')}: Every todo has both a
          created_at and an updated_at timestamp, which are set when the todo
          was first created. Whenever a todo is edited, its updated_at time is
          updated.
          <br />
          <br />
          {c('done_at')}: A todo's done_at timestamp is set to when it was
          marked as done. Todos that are not done won't match with any filters
          on done_at.
          <br />
          <br />
          {c('due_at')}: If a todo is in 'Backlog', then its due_at will not be
          set, so it won't match with any filters on due_at. If a todo is in
          Today, then its due_at will be the end of the current day, at
          midnight. When the current time is greater than a todo's due_at, it
          becomes overdue and is displayed in red.
        </p>
        <p>
          To filter by these properties, you need to compare them to a base
          time: Such as {c('eod')}, end of day (midnight), or {c('now')}, the
          current time.
        </p>
        <p>
          {c('due_at>=eod')} filters for todos that are due for or after
          midnight.
        </p>
        <p>
          You can also use time durations in the filter: {c('min')} minute,{' '}
          {c('h')} hour, {c('d')} day, {c('w')} week, {c('m')} month.
        </p>
        <p>
          {c('due_at<eod+w')} filters for todos that are due any time prior to
          midnight a week from now.
          <br />
          <br />
          {c('created_at<=now-2d')} filters for todos that were created at this
          time 2 days ago or anytime before that.
        </p>
        <div className={styles.Header2}>A Full Example</div>
        <p>
          {c('done=true done_at<=eod-d done_at>=eod-2d')} filters for todos that
          are done and have been marked done between the last midnight and the
          midnight before that.
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
          {c('due_at')} sorts todos by increasing due date, so larger due dates
          (the ones furthest in the future) will appear at the bottom.
        </p>
        <div className={styles.Header2}>Sort Direction</div>
        <p>
          Add {c(':asc')} or {c(':desc')} after a sort criteria to specify the
          order:
        </p>
        <p>
          {c('priority:desc')} sorts todos by decreasing priority, so higher
          priority todos appear at the top.
        </p>
        <div className={styles.Header2}>Multiple Sort Critera</div>

        <p>Just like filters, you can combine multiple sorting expressions:</p>
        <p>
          {c('priority:desc due_at')} sorts todos by decreasing priority first
          then by increasing due date.
        </p>

        <div className={styles.Header2}>Filters in Sort</div>

        <p>You can use filter expressions inside sort expressions:</p>
        <p>
          {c('due_at<eod')} sorts todos by whether or not their due date is
          before midnight.
        </p>
      </>
    )
  },

  {
    title: 'Splits and Pages',
    content: (
      <>
        <div className={styles.Header2}>Shortcuts, Filters and Sort</div>
        <p>
          Splits and pages both have shortcuts, filters and a sort expression.
          <br />
          <br />A shortcut is a single character; press {c('g')} then the
          shortcut key to activate it.
          <br />
          <br />
          Before displaying todos in a split/page they are filtered and sorted,
          read more about filtering and sorting in the other advanced topics.
          <br />
        </p>
        <div className={styles.Header2}>Splits vs. Pages</div>
        <p>
          Splits and pages differ in one main way:
          <br />
          A page filters through all your todos. <br />
          So the Done page with a filter of {c('done')}, displays all your done
          todos.
          <br />
          <br />
          Whereas a split doesn't show any todos that appear in any previous
          splits.
          <br />
          So with the two splits Today and Backlog, if a todo appears in Today
          it will not appear in Backlog.
          <br />
        </p>
        <div className={styles.Header2}>Splits: Position and Index</div>
        <p>
          Due to this, splits have two properties on top of those in pages:
          position and index.
        </p>
        <p>
          Index determines which split is <i>first</i> in terms of filtering.
          With the three default splits (Today, Backlog, Reading List) the
          indexes are {c('0')}, {c('2')}, {c('1')} respectively.
          <br />
          <br />
          This means all todos that match Today's filters will appear in Today.
          <br />
          Todos that don't match Today but match Reading List will appear in
          Reading List.
          <br />
          And only todos that don't match Today or Reading List can appear in
          Backlog.
        </p>
        <p>
          Position is a much simpler property, it just determines the order the
          splits are displayed in.
        </p>
        <div className={styles.Header2}>Splits: Create & Edit</div>
        <p>
          To create a new split use {c('cmd')} + {c('\\')}, to edit the current
          split use {c('cmd')} + {c('shift')} + {c('\\')}
        </p>
        <p>
          If you have a search query opened you can save it to a split using{' '}
          {c('cmd')} + {c('\\')}.
        </p>
        <div className={styles.Header2}>Default Todo</div>
        <p>
          Both splits and pages have a default todo property: {c('default')}.
        </p>
        <p>
          When a new todo is created in that split/page it will have initial
          values from the default todo.
        </p>
        <p>
          When you copy or paste todos from one split to another, values from
          the default todo are used to edit it automatically.{' '}
        </p>
        <p>
          For example if you copy a todo from Today to Reading List, it will
          automatically be given a {c('reading')} tag.
        </p>
      </>
    )
  }
];

export default pages;
