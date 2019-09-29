const [now, endOfDay] = (function() {
  const a = new Date();
  const b = new Date();
  b.setHours(23, 59, 59, 999);
  return [a.getTime(), b.getTime()];
})();

// TODO: create tutorial with todos
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
      filters: [],
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
      sort: ['done_at DESC'],
      default: {
        done: true
      }
    }
  ]
};

/*
,
				{
					"field": "due_at",
					"op": "AFTER_EOD",
					"value": -86400000
				}
*/
