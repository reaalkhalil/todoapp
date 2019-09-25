// @flow
import React, { useState, useEffect } from 'react';

import styles from './TodoList.css';

import Search from './Search';
import EditTodo from './EditTodo';
import Splits from './Splits';
import List from './List';
import * as filter from '../filter';

import KeyBoard from '../keyboard';

import { ipcRenderer } from 'electron';

export default function TodoList({
  addTodo,
  deleteTodo,
  editTodo,
  todos,
  splits,
  onHelp
}) {
  const [selectedSplit, setSelectedSplit] = useState(0);
  const [searchQuery, setSearchQuery] = useState(null);

  if (searchQuery === null) {
    todos = filter.apply(todos, ...splits[selectedSplit].filters);
  } else {
    todos = filter.apply(todos, {
      field: 'title',
      op: 'CONTAINS',
      value: searchQuery
    });
  }

  const [selectedId, setSelectedId] = useState(
    todos && todos[0] ? todos[0].id : null
  );

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  useEffect(() => {
    if (helpModal) ipcRenderer.send('openSideBar');
    else ipcRenderer.send('closeSideBar');
  }, [helpModal]);

  if (selectedId !== null && (!todos || todos.length == 0)) setSelectedId(null);
  if (
    todos &&
    todos.length > 0 &&
    (selectedId === null || todos.filter(t => t.id === selectedId).length === 0)
  )
    setSelectedId(todos[0].id);

  const onMarkDoneTodo = (todos, selectedId, setSelectedId) => {
    let toDoneStatus = true;
    // console.log('e', selectedId);
    if (todos.length == 0) return;
    if ((todos.find(t => t.id === selectedId) || { done: true }).done)
      toDoneStatus = false;

    if (todos.length > 1) {
      let idx = todos.findIndex(t => t.id === selectedId) + 1;
      if (idx >= todos.length) idx = todos.length - 2;
      setSelectedId(todos[idx].id);
    } else {
      setSelectedId(null);
    }

    const t = todos.find(t => t.id === selectedId);
    if (!t) return;

    editTodo({ todo: { ...t, done: toDoneStatus } });
  };

  const onDeleteTodo = (todos, selectedId, setSelectedId) => {
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

  const onExitSearch = () => {
    setSearchModal(false);
    setSearchFocus(false);
    setSearchQuery(null);
  };

  const [todoToAdd, setTodoToAdd] = useState(null);
  const [todoToEdit, setTodoToEdit] = useState(null);

  if (addModal) {
    KeyBoard.bind({
      esc: () => setAddModal(false),
      enter: () => {
        addTodo({ todo: todoToAdd });
        setAddModal(false);
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
    KeyBoard.bind({
      tab: () => setSelectedSplit((selectedSplit + 1) % splits.length),
      'shift+tab': () =>
        setSelectedSplit((splits.length + selectedSplit - 1) % splits.length),
      'g t': () => {
        setSelectedSplit(0);
      },
      'g d': () => {
        setSelectedSplit(splits.length - 1);
      },
      c: e => {
        setAddModal(true);
        e.preventDefault();
      },
      p: () => {
        if (selectedId !== 0 && !selectedId) return;
        const t = todos.find(t => t.id === selectedId);
        if (!t) return;
        editTodo({ todo: { ...t, priority: (t.priority + 1) % 3 } });
      },
      e: () => onMarkDoneTodo(todos, selectedId, setSelectedId),
      d: () => onDeleteTodo(todos, selectedId, setSelectedId),
      k: () => onMoveSelectUp(todos, selectedId, setSelectedId),
      j: () => onMoveSelectDown(todos, selectedId, setSelectedId),
      '?': () => {
        const h = !helpModal;
        setHelpModal(h);
        onHelp(h);
      },
      up: () => onMoveSelectUp(todos, selectedId, setSelectedId),
      down: () => onMoveSelectDown(todos, selectedId, setSelectedId),
      enter: e => {
        setEditModal(true);
        e.preventDefault();
      },
      esc: e => {
        if (searchModal) onExitSearch();
      },
      '/': e => {
        setSearchFocus(true);
        if (searchModal) return;

        setSearchModal(true);
        setSearchQuery('');
        e.preventDefault();
      }
    });
  }

  if (addModal)
    return (
      <EditTodo helpOpen={helpModal} initTodo={null} onUpdate={setTodoToAdd} />
    );

  if (editModal)
    return (
      <EditTodo
        helpOpen={helpModal}
        onUpdate={setTodoToEdit}
        initTodo={todos.find(t => t.id === selectedId)}
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
      ) : (
        <div className={styles.btnGroup}>
          {<Splits splits={splits} selectedSplit={selectedSplit} />}
        </div>
      )}

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
