import cmdOrCtrl from '../utils/cmdctrl';
import { now, endOfDay } from '../utils';

export const initialTodos = [
  {
    id: 1,
    title: `1. Press [${cmdOrCtrl()}] + [?] to open the Help tab`,
    content: '',
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: null,
    due_at: endOfDay(),
    tags: []
  },
  {
    id: 2,
    title: '2. Press [tab] and [shift] + [tab] to navigate splits',
    content: '',
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: null,
    due_at: endOfDay(),
    tags: []
  },
  {
    id: 3,
    title: "3. Press [tab] to go to the 'Backlog' -->",
    content: '',
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: null,
    due_at: endOfDay(),
    tags: []
  },
  {
    id: 4,
    title: '4. Highlight this then press [space]',
    content: `Pressing [space] allows you to quickly view a todo and its notes.

You will notice that this todo has a document icon on the far right, this means it has notes attached.

Please read the notes attached to the rest of todos in the tutorial!

Now for the 'Backlog':

You should add your new todos here, unless they're urgent, in which case they should go right into 'Today'.

This way, each day you can move some todos from the 'Backlog' to 'Today' and stay focused as you smash your day!

You can press [space] again or [esc] to exit this view.`,
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: null,
    due_at: 0,
    tags: []
  },
  {
    id: 5,
    title: '5. Press [j] / [k] to move down / up in todos.',
    content: ``,
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: null,
    due_at: 0,
    tags: []
  },
  {
    id: 6,
    title: '6. Highlight this then press [enter]',
    content: `# Editing todos:

Edit the selected todo by pressing [enter].

Once in the edit screen, press [tab] / [shift] + [tab] to move to the next / previous input.

To save, hit [enter] - or if the Notes input is selected it's [cmd] + [enter].

To cancel editing hit [esc].

# Creating new todos:

When in list view, hit [c] to create a new todo.

Go ahead and exit the edit screen to create your first todo!
Try something like "Read 2 articles today.

# Delete todos:

To delete a todo, press [d] twice.
`,
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: null,
    due_at: 0,
    tags: []
  },
  {
    id: 7,
    title: '7. Read this after creating your first todo',
    content: `# Editing tags:

To edit a todo's tags you can either:
- Edit it by hitting [enter], and editing tags there.
- Or hit [l] and use the tag editor, this is faster.

Edit your first todo and give it a "reading" tag, then come back here!

# Split filtering

Your todo has now gone to the 'Reading List' split.

Splits can be configured to filter todos by various criteria; the 'Today' split, for example, only shows todos due by the end of today.

You can move todos in and out of 'Today' by hitting [t]. Try it out, move your new todo to 'Today'!

By the way, when a todo is overdue it turns red!`,
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: null,
    due_at: 0,
    tags: []
  },
  {
    id: 8,
    title: '8. Highlight your new todo and press [e] to mark it done',
    content: '',
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: null,
    due_at: endOfDay(),
    tags: []
  },
  {
    id: 9,
    title: '9. Press [g] then [d] to view your done todos',
    content: `You can press [e] on done todos to unmark them as done`,
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: null,
    due_at: endOfDay(),
    tags: []
  },
  {
    id: 10,
    title: '10. This is the done page',
    content: `The 'Done' page is an archive, so you won't spend too much time here.

A more useful page is the 'Standup' page, it shows your done todos from the past day.

Press [g] then [s] to go to there. Try it now!`,
    priority: 0,
    done: true,
    created_at: now(),
    updated_at: now(),
    done_at: now(-3600 * 1000),
    due_at: endOfDay(),
    tags: []
  },
  {
    id: 11,
    title: '11. This todo was marked done at noon yesterday',
    content: `# Standup page
    
The todos you marked as done between midnight today and midnight yesterday will appear here.

This page is very useful if you have standup meetings [https://en.wikipedia.org/wiki/Stand-up_meeting].

You can also configure your pages to change this duration!

Now hit [esc] twice to go back to 'Today'`,
    priority: 0,
    done: true,
    created_at: now(),
    updated_at: now(),
    done_at: endOfDay(-3600 * 36 * 1000),
    due_at: endOfDay(),
    tags: []
  },
  {
    id: 12,
    title: "12. Press [s] to edit a todo's priority",
    content: `High priority todos are displayed at the top of the list!`,
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    due_at: endOfDay(),
    tags: []
  },
  {
    id: 13,
    title: '13. Press [/] to search; [esc] to close search',
    content: ``,
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    done_at: endOfDay(-3600 * 24 * 1000),
    due_at: endOfDay(),
    tags: []
  },

  {
    id: 14,
    title: '14. Press [cmd] + [,] to set up integrations!',
    content: `You can add new todos by sending a telegram message or an email.

To get started you need to verify your Telegram account / email address.

Press [cmd] + [,] to open the Preferences page and follow the instructions to set it up.

# Telegram

Send a message to the TodoApp Telegram bot and it will be downloaded to your Backlog.

The first line of your message will be the todo title, the rest of the lines will constitute the notes.

# Email

Send an email to add@todoapp.cc and it will be downloaded to your Backlog.

The email subject will be the todo title and the email body will be the todo notes.
`,
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    due_at: endOfDay(),
    tags: []
  },

  {
    id: 15,
    title: '15. Thank you!',
    content: `Thank you for trying out TodoApp!

There are too many features to go through in this short tutorial, for more information read the Advanced Topics at bottom of the Help tab

TodoApp is still very much a work in progress, so your comments and feedback are tremendously appreciated!

Just scroll to the very bottom of the Help tab to submit feedback :)`,
    priority: 0,
    done: false,
    created_at: now(),
    updated_at: now(),
    due_at: endOfDay(),
    tags: []
  }
];

export const initialSettings = {
  splits: [
    {
      title: 'Today',
      shortcut: 'g',
      position: 0,
      filters: 'due_at<=eod done=false',
      sort: 'due_at<eod priority:desc due_at:desc created_at',
      default: {
        due_at: 0
      }
    },
    {
      title: 'Reading List',
      shortcut: 'r',
      position: 2,
      filters: 'tags=reading done=false',
      sort: 'priority:desc due_at created_at',
      default: {
        tags: ['reading']
      }
    },
    {
      title: 'Backlog',
      shortcut: 'b',
      position: 1,
      filters: 'done=false',
      sort: 'priority:desc due_at created_at',
      default: {}
    }
  ],
  pages: [
    {
      title: 'Done',
      shortcut: 'd',
      filters: 'done=true',
      sort: 'done_at:desc',
      default: {
        done: true
      }
    },
    {
      title: 'Standup',
      shortcut: 's',
      filters: 'done=true done_at<=eod-d done_at>=eod-2d',
      sort: 'priority DESC due_at created_at',
      default: {
        done: true
      }
    }
  ]
};
