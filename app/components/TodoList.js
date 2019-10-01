// @flow
import React, { useState, useEffect } from 'react';

import styles from './TodoList.css';

import Search from './Search';
import EditTodo from './EditTodo';
import { Splits, Page } from './Splits';
import List from './List';
import * as filter from '../filter';

import KeyBoard from '../keyboard';

import { ipcRenderer } from 'electron';
import ViewTodo from './ViewTodo';

const onMarkDoneTodo = (
  todos,
  selectedId,
  setSelectedId,
  editTodo,
  searchModal
) => {
  if (todos.length == 0) return;

  const t = todos.find(a => a.id === selectedId);
  if (!t) return;

  const toDoneStatus = !t.done;

  if (todos.length > 1) {
    let idx = todos.findIndex(t => t.id === selectedId) + 1;
    if (idx >= todos.length) idx = todos.length - (searchModal ? 1 : 2);
    setSelectedId(todos[idx].id);
  } else {
    setSelectedId(null);
  }

  editTodo({
    todo: {
      ...t,
      done: toDoneStatus,
      done_at: toDoneStatus ? new Date().getTime() : null
    }
  });
};

const onDueTodayTodo = (
  todos,
  selectedId,
  setSelectedId,
  editTodo,
  searchModal,
  endOfDay
) => {
  if (todos.length == 0) return;
  let ret = false;

  const t = todos.find(t => t.id === selectedId);
  if (!t) return;

  const dueToday = t.due_at !== endOfDay;

  if (todos.length > 1) {
    let idx = todos.findIndex(t => t.id === selectedId) + 1;
    if (idx >= todos.length) idx = todos.length - (searchModal ? 1 : 2);
    setSelectedId(todos[idx].id);
  } else {
    setSelectedId(null);
  }

  editTodo({
    todo: {
      ...t,
      due_at: dueToday ? endOfDay : null
    }
  });
};

const onDeleteTodo = (todos, selectedId, setSelectedId, deleteTodo) => {
  if (todos.length == 0) return;
  if (todos.length > 1) {
    let idx = todos.findIndex(t => t.id === selectedId) + 1;
    if (idx >= todos.length) idx = todos.length - 2;
    setSelectedId(todos[idx].id);
  } else {
    setSelectedId(null);
  }

  deleteTodo({ id: selectedId });
};

const onMoveSelectUp = (todos, selectedId, setSelectedId) => {
  if (todos.length > 1) {
    let idx = todos.findIndex(t => t.id === selectedId) - 1;
    if (idx < 0) idx = 0;
    setSelectedId(todos[idx].id);
  }
};

const onMoveSelectDown = (todos, selectedId, setSelectedId) => {
  if (todos.length > 1) {
    let idx = todos.findIndex(t => t.id === selectedId) + 1;
    if (idx >= todos.length) idx = todos.length - 1;
    setSelectedId(todos[idx].id);
  }
};

const endOfDay = function() {
  const a = new Date();
  a.setHours(23, 59, 59, 999);
  return a.getTime();
};

export default function TodoList({
  addTodo,
  deleteTodo,
  editTodo,
  todos,
  splits,
  pages,
  onHelp,
  onSettings,
  helpOpen
}) {
  const [selectedSplit, setSelectedSplit] = useState(0);
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedPage, setSelectedPage] = useState('');

  if (searchQuery === null) {
    if (!selectedPage) {
      todos = filter.applySplits(todos, splits, selectedSplit);
    } else {
      todos = filter.applyPage(todos, pages, selectedPage);
    }
  } else {
    todos = filter.search(todos, searchQuery);
  }

  const [selectedId, setSelectedId] = useState(
    todos && todos[0] ? todos[0].id : null
  );

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [viewTodo, setViewTodo] = useState(false);
  const [helpModal, setHelpModal] = useState(helpOpen);

  useEffect(() => {
    const f = () => {
      if (!editModal) setAddModal(!addModal);
    };

    ipcRenderer.addListener('createTodo', f);

    return () => {
      ipcRenderer.removeListener('createTodo', f);
    };
  }, []);

  if (selectedId !== null && (!todos || todos.length == 0)) setSelectedId(null);
  if (
    todos &&
    todos.length > 0 &&
    (selectedId === null || todos.filter(t => t.id === selectedId).length === 0)
  )
    setSelectedId(todos[0].id);

  const onExitSearch = () => {
    if (viewTodo) {
      setViewTodo(false);
      return;
    }
    setSearchModal(false);
    setSearchFocus(false);
    setSearchQuery(null);
  };

  const [todoToAdd, setTodoToAdd] = useState(null);
  const [todoToEdit, setTodoToEdit] = useState(null);

  const triggerAddorEdit = () => {
    if (addModal) {
      addTodo({ todo: todoToAdd });
      setAddModal(false);
    } else if (editModal) {
      editTodo({ todo: todoToEdit });
      setEditModal(false);
    }
  };

  const cancelAddorEdit = () => {
    if (addModal) {
      setAddModal(false);
    } else if (editModal) {
      setEditModal(false);
    }
  };

  if (addModal) {
    KeyBoard.bind({
      esc: () => setAddModal(false),
      enter: () => {
        addTodo({ todo: todoToAdd });
        setAddModal(false);
        // TODO: setSelectedId()   need to get ID of todo just created
      }
    });
  } else if (editModal) {
    KeyBoard.bind({
      esc: () => setEditModal(false),
      enter: () => {
        editTodo({ todo: todoToEdit });
        setEditModal(false);
      }
    });
  } else if (searchModal && searchFocus) {
    KeyBoard.bind({
      '/': onExitSearch,
      esc: onExitSearch,
      tab: onExitSearch,
      'shift+tab': onExitSearch,
      enter: () => setSearchFocus(false)
    });
  } else {
    // TODO: if user enters "|" in shortcut it'll mess this up

    const shortcuts = {};
    splits.forEach(s => {
      if (s.shortcut)
        shortcuts['g ' + s.shortcut] = () => {
          setSelectedPage('');
          setSelectedSplit(s.position);
        };
    });

    pages.forEach(p => {
      if (p.shortcut)
        shortcuts['g ' + p.shortcut] = () => setSelectedPage(p.shortcut);
    });

    KeyBoard.bind({
      ...shortcuts,
      tab: e => {
        if (searchModal) {
          setSearchFocus(true);
          e.preventDefault();
          return;
        }
        if (selectedPage) {
          setSelectedPage('');
          return;
        }
        setSelectedSplit(
          (selectedSplit + 1) % splits.filter(s => s.position >= 0).length
        );
      },
      'shift+tab': e => {
        if (searchModal) {
          setSearchFocus(true);
          e.preventDefault();
          return;
        }

        if (selectedPage) {
          setSelectedPage('');
          return;
        }
        setSelectedSplit(
          (splits.filter(s => s.position >= 0).length + selectedSplit - 1) %
            splits.filter(s => s.position >= 0).length
        );
      },

      c: e => {
        setAddModal(true);
        e.preventDefault();
      },
      space: () => {
        if (selectedId !== 0 && !selectedId && !viewTodo) return;
        if (selectedId) setViewTodo(!viewTodo);
      },
      s: () => {
        if (selectedId !== 0 && !selectedId) return;
        const t = todos.find(t => t.id === selectedId);
        if (!t) return;
        editTodo({ todo: { ...t, priority: ((t.priority || 0) + 1) % 3 } });
      },
      t: () => {
        onDueTodayTodo(
          todos,
          selectedId,
          setSelectedId,
          editTodo,
          searchModal,
          endOfDay()
        );
      },
      e: () =>
        onMarkDoneTodo(todos, selectedId, setSelectedId, editTodo, searchModal),
      'd d': () => onDeleteTodo(todos, selectedId, setSelectedId, deleteTodo),
      k: () => onMoveSelectUp(todos, selectedId, setSelectedId),
      j: () => onMoveSelectDown(todos, selectedId, setSelectedId),
      '?': () => {
        const h = !helpModal;
        setHelpModal(h);
        onHelp(h);
      },
      up: e => {
        onMoveSelectUp(todos, selectedId, setSelectedId);
        e.preventDefault();
      },
      down: e => {
        onMoveSelectDown(todos, selectedId, setSelectedId);
        e.preventDefault();
      },
      enter: e => {
        setEditModal(true);
        e.preventDefault();
      },
      esc: e => {
        if (viewTodo) {
          setViewTodo(false);
          return;
        }

        if (searchModal) {
          onExitSearch();
          return;
        }

        if (selectedPage !== '') {
          setSelectedPage('');
          return;
        }

        if (selectedSplit !== 0) setSelectedSplit(0);
      },

      'command+,|ctrl+,': e => onSettings(true),
      '/': e => {
        setSearchFocus(true);
        if (searchModal) return;

        setSearchModal(true);
        setSearchQuery('');
        e.preventDefault();
      }
    });
  }

  if (viewTodo && selectedId !== 0 && !selectedId) setViewTodo(false);

  if (addModal) {
    let initTodo = null;

    if (splits) {
      const s = splits.find(s => s.position === selectedSplit);
      if (s) initTodo = s.default || initTodo;
    }

    if (selectedPage !== '') {
      const page = pages.find(p => p.shortcut === selectedPage);
      if (page && page.default) {
        initTodo = page.default;
      }
    }

    return (
      <EditTodo
        helpOpen={helpModal}
        create={true}
        initTodo={initTodo}
        onUpdate={setTodoToAdd}
        trigger={triggerAddorEdit}
        cancel={cancelAddorEdit}
      />
    );
  }

  if (editModal)
    return (
      <EditTodo
        helpOpen={helpModal}
        onUpdate={setTodoToEdit}
        initTodo={todos.find(t => t.id === selectedId)}
        trigger={triggerAddorEdit}
        cancel={cancelAddorEdit}
      />
    );

  const listStyles = [styles.TodoList];
  if (helpModal) {
    listStyles.push(styles['TodoList--help-open']);
  }

  return (
    <div className={listStyles.join(' ')}>
      {searchModal ? (
        <Search
          helpOpen={helpModal}
          defaultQuery={searchQuery}
          onUpdate={setSearchQuery}
          onUpdateFocus={f => setSearchFocus(f)}
          hasFocus={searchFocus}
        />
      ) : selectedPage ? (
        <Page pages={pages} selectedPage={selectedPage} />
      ) : (
        <Splits
          helpOpen={helpModal}
          splits={splits}
          selectedSplit={selectedSplit}
        />
      )}

      <ViewTodo
        todo={todos.find(t => t.id === selectedId)}
        helpOpen={helpOpen}
        show={viewTodo}
      />

      <List
        helpOpen={helpModal}
        todos={todos}
        selectedId={searchFocus ? null : selectedId}
        onHover={a => {
          setSelectedId(a);
        }}
      />
    </div>
  );
}
