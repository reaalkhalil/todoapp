const [now, endOfDay] = (function() {
  const a = new Date();
  const b = new Date();
  b.setHours(23, 59, 59, 999);
  return [a.getTime(), b.getTime()];
})();

export const initialTodos = [
  {
    id: 1,
    title: "1. Type '?' to open the Help tab",
    content: '',
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: null,
    due_at: endOfDay,
    tags: ['help']
  },
  {
    id: 2,
    title: "2. Use 'tab' and 'shift' + 'tab' to navigate splits",
    content: '',
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: null,
    due_at: endOfDay,
    tags: ['help']
  },
  {
    id: 3,
    title: "3. Press 'tab' to go to 'Backlog' --> --> --> -->",
    content: '',
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: null,
    due_at: endOfDay,
    tags: ['help']
  },
  {
    id: 4,
    title: "4. Highlight this then press 'space'",
    content: `Pressing 'space' allows you to quickly view a todo and it's contents.

You will notice that this todo has a document icon on the far right, this means it has notes attached.
Please read the notes attached to the rest of todos in the tutorial!

Now for the 'Backlog':
Any new todos you have should be added here. If the todo is urgent, then it goes right to 'Today'.
This way, each day you can move some todos from the 'Backlog' to 'Today' and stay focused as you smash your day!

You can press 'space' again or 'esc' to exit this view.`,
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: null,
    due_at: 0,
    tags: ['help']
  },
  {
    id: 5,
    title: "5. Use 'j' and 'k' to move down and up in todos.",
    content: ``,
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: null,
    due_at: 0,
    tags: ['help']
  },
  {
    id: 6,
    title: "6. Highlight this then press 'enter'",
    content: `Pressing 'enter' allows you to edit a todo.
Once you're editing a todo, use 'tab' and 'shift' + 'tab' to navigate inputs.
Hit 'enter' again to save (or 'cmd' + 'enter' if the Notes input is selected), and 'esc' to cancel editing.

When in list view, use 'c' to create a new todo.  Go ahead and exit the edit screen to create your first todo!
Try something like "Read 2 articles today".
`,
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: null,
    due_at: 0,
    tags: ['help']
  },
  {
    id: 7,
    title: '7. After you create your first todo, read this',
    content: `Your first todo deserves a tag! Edit it and give it a "reading" tag, then come back here!

Your todo has now gone to the 'Reading List' split. Splits can be configured to filter todos by various criteria.

You can move todos in and out of 'Today' by hitting 't'. Try it out, move your new todo to 'Today'!
By the way, when a todo is overdue it turns red!`,
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: null,
    due_at: 0,
    tags: ['help']
  },
  {
    id: 8,
    title: "8. Highlight your new todo and press 'e' to mark it done",
    content: '',
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: null,
    due_at: endOfDay,
    tags: ['help']
  },
  {
    id: 9,
    title: "9. Press 'g' then 'd' to view your done todos",
    content: `You can press 'e' on done todos to unmark them as done`,
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: null,
    due_at: endOfDay,
    tags: ['help']
  },
  {
    id: 10,
    title: '10. This is the done page',
    content: `The done page is an archive, so you won't spend too much time here.

If you usually look at your done todos to track progress over a day/week etc. then here's an easier alternative:

Use 'g' then 's' to go to the 'Standup' page; where you can view your done todos from the past day.

Try it now!`,
    priority: 0,
    done: true,
    created_at: now,
    updated_at: now,
    done_at: endOfDay - 3600 * 24 * 1000,
    due_at: endOfDay,
    tags: ['help']
  },
  {
    id: 11,
    title: '11. This is the standup page',
    content: `This page filters your todos that have been done between midnight today and midnight yesterday.

[https://en.wikipedia.org/wiki/Stand-up_meeting]

You can also configure your pages to change this duration!

Now hit 'esc' twice to go back to 'Today'`,
    priority: 0,
    done: true,
    created_at: now,
    updated_at: now,
    done_at: endOfDay - 3600 * 24 * 1000,
    due_at: endOfDay,
    tags: ['help']
  },
  {
    id: 12,
    title: "12. Use 's' to edit a todo's priority",
    content: `High priority todos are displayed at the top of the list!`,
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: endOfDay - 3600 * 24 * 1000,
    due_at: endOfDay,
    tags: ['help']
  },
  {
    id: 13,
    title: "13. Press '/' to search; 'esc' to close search",
    content: ``,
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: endOfDay - 3600 * 24 * 1000,
    due_at: endOfDay,
    tags: ['help']
  },

  {
    id: 14,
    title: "14. Press 'cmd' + ',' to open preferences",
    content: `Preferences give you a lot of power to change your layout. It is available to edit in JSON format.
    
Note: This is geared towards more advanced users, so if you don't think you will want to get too involved then this isn't worth reading.

The most important thing to remember about preferences is: if you mess anything up, erase the whole thing and save ('cmd' + 's'), this will reset to the default preferences.

In preferences you can configure both your splits (always displayed) and pages (displayed when you type their shortcuts).
Both splits and pages share the following configurables:
- Filters: Rules on how to filter todos
- Sort: Rules on how to sort todos
- Default: The default todo created when the page/split is open
- Shortcut: The shortcut key, you need to type 'g' before the shortcut key

Splits have an extra field: 'position'; where the split appears in the top bar.

To use the filters, sort, and default fields, you must know the structure of a todo:

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

Filters are in the form:
{
   field:   string
   op:      string
   value:   string, number, boolean
},

Fields can be any one of a todo's fields:
"title", "content", "priority", "done", "created_at", "updated_at", "done_at", "due_at", "tags"

Ops can be one of:
"EQUAL", "NOT_EQUAL"
   Which compare the todo's field to the given value
"CONTAINS", "NOT_CONTAINS"
   Which check if the value is a substring of / an element of the todo's field
"BEFORE_EOD", "AFTER_EOD"
   Which compares the field to the upcoming midnight, value here is an offset (in milliseconds) applied to midnight
BEFORE_NOW, AFTER_NOW
   Which compares the field to the current time, value here is an offset (in milliseconds) as before

The Sort setting is in the form of an array of string. Todos are sorted by each criteria in the order provided.

For example, a sort value of:
[
   "priority DESC",
   "due_at",
   "created_at"
]

Will sort todos by descending priority, then by ascending due date (more urgent todos at the top), and lastly by ascending creation date (older todos at the top)

The default todo setting makes it easy to:
   - Create todos due for today directly from the 'Today' split:
      { "due_at": 0 } here, a value of 0 is automatically converted to the upcoming midnight
   - Create todos with the "reading" tag from the 'Reading List' split
      { "tags": ["reading"] }

`,
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: endOfDay - 3600 * 24 * 1000,
    due_at: endOfDay,
    tags: ['help']
  },

  {
    id: 15,
    title: '15. Thank you!',
    content: `Thank you for using TodoApp!

If you have any comments or feedback - or if you would like to share TodoApp - please scroll to the bottom of the help Tab.`,
    priority: 0,
    done: false,
    created_at: now,
    updated_at: now,
    done_at: endOfDay - 3600 * 24 * 1000,
    due_at: endOfDay,
    tags: ['help']
  }
];

export const initialSettings = {
  splits: [
    {
      title: 'Today',
      shortcut: 'g',
      position: 0,
      filters: [
        {
          field: 'due_at',
          op: 'BEFORE_EOD',
          value: 0
        },
        {
          field: 'done',
          op: 'EQUAL',
          value: false
        }
      ],
      sort: ['due_at', 'priority DESC', 'created_at'],
      default: {
        due_at: 0
      }
    },
    {
      title: 'Reading List',
      shortcut: 'r',
      position: 2,
      filters: [
        {
          field: 'tags',
          op: 'CONTAINS',
          value: 'reading'
        },
        {
          field: 'done',
          op: 'EQUAL',
          value: false
        }
      ],
      sort: ['priority DESC', 'due_at', 'created_at'],
      default: {
        tags: ['reading']
      }
    },
    {
      title: 'Backlog',
      position: 1,
      filters: [
        {
          field: 'done',
          op: 'EQUAL',
          value: false
        }
      ],
      sort: ['priority DESC', 'due_at', 'created_at'],
      default: {}
    }
  ],
  pages: [
    {
      title: 'Done',
      shortcut: 'd',
      filters: [
        {
          field: 'done',
          op: 'EQUAL',
          value: true
        }
      ],
      sort: ['done_at DESC'],
      default: {
        done: true
      }
    },
    {
      title: 'Standup',
      shortcut: 's',
      filters: [
        {
          field: 'done',
          op: 'EQUAL',
          value: true
        },
        {
          field: 'done_at',
          op: 'BEFORE_EOD',
          value: -86400000
        },
        {
          field: 'done_at',
          op: 'AFTER_EOD',
          value: -172800000
        }
      ],
      sort: ['priority DESC', 'due_at', 'created_at'],
      default: {
        done: true
      }
    }
  ]
};
