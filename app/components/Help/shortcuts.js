const shortcuts = [
  {
    header: 'Todo List',
    keys: [
      [['cmd', '/'], 'Toggle Help'],
      [['tab'], 'Next Split'],
      [['shift', 'tab'], 'Prev Split'],
      [['space'], 'View Todo'],
      [['c'], 'Create'],
      [['t'], '(Un)Set Due Today'],
      [['e'], '(Un)Mark Done'],
      [['d', 'd'], 'Delete'],
      [['s'], 'Toggle Priority'],
      [['l'], 'Edit Tags'],
      [['enter'], 'Edit'],
      [['k'], 'Up'],
      [['j'], 'Down'],
      [['shift', 'k'], '10 Todos Up'],
      [['shift', 'j'], '10 Todos Down'],
      [['/'], 'Search'],
      [['cmd', 'c'], 'Copy Todo'],
      [['cmd', 'shift', 'c'], 'Copy List'],
      [['cmd', 'x'], 'Cut Todo'],
      [['cmd', 'v'], 'Import Todo(s)'],
      [['cmd', 'shift', 'v'], 'Paste Todo(s)'],
      [['cmd', 'z'], 'Undo'],
      [['cmd', 'shift', 'z'], 'Redo'],
      [['cmd', '\\'], 'New Split'],
      [['cmd', 'shift', '\\'], 'Edit Split'],
      [['cmd', 'shift', 'backspace'], 'Delete Split'],
      [['cmd', ','], 'Preferences']
    ]
  },
  {
    header: 'Import Multiple',
    keys: [[['enter'], 'Confirm'], [['esc'], 'Cancel']]
  },
  {
    header: 'Global Shortcuts',
    keys: [[['ctrl', 'space'], 'Create Todo']]
  },
  {
    header: 'Create Todo',
    keys: [
      [['tab'], 'Next Field'],
      [['shift', 'tab'], 'Prev Field'],
      [['enter'], 'Confirm Create'],
      [['cmd', 'enter'], 'Confirm Create (in Notes)'],
      [['esc'], 'Cancel Create']
    ]
  },
  {
    header: 'Edit Todo',
    keys: [
      [['tab'], 'Next Field'],
      [['shift', 'tab'], 'Prev Field'],
      [['enter'], 'Confirm Edit'],
      [['cmd', 'enter'], 'Confirm Edit (in Notes)'],
      [['esc'], 'Cancel Edit']
    ]
  },
  {
    header: 'Search',
    keys: [
      [['enter'], 'Focus to Todos'],
      [['/'], 'Focus to Search'],
      [['cmd', '\\'], 'New Split from Search Query'],
      [['esc'], 'Cancel Search']
    ]
  },
  {
    header: 'Preferences',
    keys: [
      [['esc'], 'Cancel'],
      [['tab'], 'Next Tab'],
      [['shift', 'tab'], 'Prev Tab'],
      [['cmd', 's'], 'Save Preferences']
    ]
  }
];

export default shortcuts;
