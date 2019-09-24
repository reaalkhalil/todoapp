// @flow
import React, { useState } from 'react';

import styles from './TodoList.css';

import EditTodo from './EditTodo';
import List from './List';
import * as filter from '../filter';

import KeyBoard from '../keyboard';

export default function TodoList({
  addTodo,
  deleteTodo,
  editTodo,
  todos,
  splits
}) {
  const [selectedSplit, setSelectedSplit] = useState(0);

  todos = filter.apply(todos, ...splits[selectedSplit].filters);

  const [selectedId, setSelectedId] = useState(
    todos && todos[0] ? todos[0].id : null
  );

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  if (selectedId !== null && (!todos || todos.length == 0)) setSelectedId(null);
  if (
    todos &&
    todos.length > 0 &&
    (selectedId === null || todos.filter(t => t.id === selectedId).length === 0)
  )
    setSelectedId(todos[0].id);

  const onMarkDoneTodo = (todos, selectedId, setSelectedId) => {
    // console.log('e', selectedId);
    if (todos.length == 0) return;
    if ((todos.find(t => t.id === selectedId) || { done: true }).done) return;

    if (todos.length > 1) {
      let idx = todos.findIndex(t => t.id === selectedId) + 1;
      if (idx >= todos.length) idx = todos.length - 2;
      setSelectedId(todos[idx].id);
    } else {
      setSelectedId(null);
    }

    const t = todos.find(t => t.id === selectedId);
    if (!t) return;

    editTodo({ todo: { ...t, done: true } });
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
  } else {
    KeyBoard.bind({
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
      up: () => onMoveSelectUp(todos, selectedId, setSelectedId),
      down: () => onMoveSelectDown(todos, selectedId, setSelectedId),
      enter: e => {
        setEditModal(true);
        e.preventDefault();
      },
      tab: () => setSelectedSplit((selectedSplit + 1) % splits.length),
      'shift+tab': () =>
        setSelectedSplit((splits.length + selectedSplit - 1) % splits.length)
    });
  }

  if (addModal)
    return (
      <EditTodo
        initTodo={{ title: '', priority: 0, done: false, tags: [] }}
        onUpdate={setTodoToAdd}
      />
    );
  if (editModal)
    return (
      <EditTodo
        onUpdate={setTodoToEdit}
        initTodo={todos.find(t => t.id === selectedId)}
      />
    );

  const splitsList = splits.map((s, i) => (
    <span
      key={i}
      style={{
        color: i === selectedSplit ? 'yellow' : 'white',
        padding: '0 10px'
      }}
    >
      {s.title}
    </span>
  ));

  return (
    <div>
      <div className={styles.btnGroup}>
        ### [{splitsList}]
        <br />
        <br />
        <div>
          {[
            '[c] Create Todo',
            '[e] Mark Done',
            '[p] Edit Priority',
            '[k] Up',
            '[j] Down'
          ].map((k, i) => (
            <div key={i} style={{ float: 'left', padding: '0 10px 0 10px' }}>
              {k}
            </div>
          ))}
        </div>
      </div>

      <List
        todos={todos}
        selectedId={selectedId}
        onHover={a => {
          setSelectedId(a);
        }}
      />
    </div>
  );
}
