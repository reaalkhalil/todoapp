// @flow
import React, { useState, useEffect } from 'react';
import { ipcRenderer, clipboard, webFrame } from 'electron';

import ViewTodo from './ViewTodo';
import Search from './Search';
import EditTodo from './EditTodo';
import EditSplit from './EditSplit';
import List from './List';
import TagEditor from './TagEditor';
import { Splits, Page } from './Splits';

import addSplit from '../utils/settings';
import * as filter from '../filter';
import store from '../store/Store';
import KeyBoard from '../keyboard';
import { previewText, endOfDay, todoToText, textToTodos } from '../utils';

import styles from './TodoList.css';

const copyTodosToClipboard = (todos, setLastAction) => {
  if (!todos || todos.length === 0) return;
  const maxlen = Math.max(
    ...todos.map(t =>
      t.title ? t.title.length : 0 + t.priority ? 1 + t.priority : 0
    )
  );
  const text = todos.map(t => todoToText(t, maxlen)).join('\n');
  clipboard.writeText(text);
  if (todos.length === 1) setLastAction(`Copied 1 todo to clipboard`);
  else setLastAction(`Copied ${todos.length} todos to clipboard`);
};

const copyTodoToClipboard = (todo, setLastAction) => {
  if (!todo) return;
  clipboard.writeText(todoToText(todo));
  setLastAction(`Copied 1 todo to clipboard`);
};

const onMarkDoneTodo = (
  todos,
  selectedId,
  setSelectedId,
  editTodo,
  searchModal,
  setLastAction
) => {
  if (todos.length == 0) return;

  const t = todos.find(a => a.id === selectedId);
  if (!t) return;

  const toDoneStatus = !t.done;

  editTodo({
    todo: {
      ...t,
      done: toDoneStatus,
      done_at: toDoneStatus ? new Date().getTime() : null
    }
  });

  setLastAction(
    (toDoneStatus ? 'Done: ' : 'Not done: ') + previewText(t.title)
  );
};

const onDueTodayTodo = (
  todos,
  selectedId,
  setSelectedId,
  editTodo,
  searchModal,
  endOfDay,
  setLastAction
) => {
  if (todos.length == 0) return;
  let ret = false;

  const t = todos.find(t => t.id === selectedId);
  if (!t) return;

  const dueToday = t.due_at !== endOfDay;

  editTodo({
    todo: {
      ...t,
      due_at: dueToday ? endOfDay : null
    }
  });

  setLastAction(`Due ${dueToday ? 'today' : 'later'}: ` + previewText(t.title));
};

const onDeleteTodo = (
  todos,
  selectedId,
  setSelectedId,
  deleteTodo,
  setLastAction
) => {
  if (todos.length == 0) return;
  const i = todos.findIndex(t => t.id === selectedId);
  deleteTodo({ id: selectedId });
  setLastAction('Deleted: ' + previewText(todos[i].title));
};

const onMoveSelectUp = (todos, selectedId, setSelectedId, steps) => {
  if (todos.length > 1) {
    let idx = todos.findIndex(t => t.id === selectedId) - 1 * (steps || 1);
    if (idx < 0) idx = 0;
    setSelectedId(todos[idx].id);
  }
};

const onMoveSelectDown = (todos, selectedId, setSelectedId, steps) => {
  if (todos.length > 1) {
    let idx = todos.findIndex(t => t.id === selectedId) + 1 * (steps || 1);
    if (idx >= todos.length) idx = todos.length - 1;
    setSelectedId(todos[idx].id);
  }
};

export default function TodoList({
  addTodo,
  deleteTodo,
  editTodo,
  setLastAction,
  splits,
  pages,
  onToggleHelp,
  onSettings,
  settings,
  addSplit,
  editSplit,
  removeSplit,
  recentlyEditedId
}) {
  const [selectedSplit, setSelectedSplit] = useState(0);
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedPage, setSelectedPage] = useState('');

  const [allTodos, setAllTodos] = useState(null);

  useEffect(() => {
    if (
      recentlyEditedId &&
      todos.find(t => t.id === recentlyEditedId) &&
      selectedId !== recentlyEditedId
    )
      setSelectedId(recentlyEditedId);
  }, [allTodos]);

  useEffect(() => {
    const unsubscribe = store.subscribeToTodos(tt => {
      if (!tt) return;
      KeyBoard.activate();
      setAllTodos(tt);
    });

    return async () => (await unsubscribe)();
  }, []);

  let todos = allTodos || [];
  const tags = filter.getTags(todos);

  if (searchQuery === null) {
    if (!selectedPage) todos = filter.applySplits(todos, splits, selectedSplit);
    else todos = filter.applyPage(todos, pages, selectedPage);
  } else todos = filter.search(todos, searchQuery);

  const [selectedId, setSelectedId] = useState(
    todos && todos[0] ? todos[0].id : null
  );

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addSplitModal, setAddSplitModal] = useState(false);
  const [editSplitModal, setEditSplitModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [viewTodo, setViewTodo] = useState(false);
  const [pasteModal, setPasteModal] = useState(null);

  const [nextTodoToSelect, setNextTodoToSelect] = useState(null);

  useEffect(() => {
    let idx = todos.findIndex(t => t.id === selectedId);
    if (idx === -1) setSelectedId(nextTodoToSelect);
    else {
      if (todos.length - 1 === idx && idx > 0) {
        setNextTodoToSelect(todos[todos.length - 2].id);
      } else if (todos.length > idx + 1) setNextTodoToSelect(todos[idx + 1].id);
      else setNextTodoToSelect(null);
    }
  }, [selectedId]);

  useEffect(() => {
    const f = () => {
      if (!editModal) setAddModal(!addModal);
    };

    ipcRenderer.addListener('createTodo', f);

    return () => {
      ipcRenderer.removeListener('createTodo', f);
    };
  }, []);

  if (
    (selectedSplit !== 0 && !selectedSplit) ||
    splits.filter(s => s.position === selectedSplit).length === 0
  )
    setSelectedSplit(splits[0].position);

  // TODO: whats the deal here, how does nextTodoToSelect affect this?
  if (!pasteModal) {
    if (selectedId !== null && (!todos || todos.length == 0))
      setSelectedId(null);
    if (
      todos &&
      todos.length > 0 &&
      (selectedId === null ||
        todos.filter(t => t.id === selectedId).length === 0)
    ) {
      if (todos.filter(t => t.id === nextTodoToSelect).length > 0) {
        setSelectedId(nextTodoToSelect);
      } else {
        setSelectedId(todos[0].id);
      }
    }
  }

  // TODO: whats the deal here, how does nextTodoToSelect affect this?
  useEffect(() => {
    if (pasteModal && pasteModal.length > 0 && pasteModal[0]) {
      setSelectedId(pasteModal[0].id);
      return;
    }

    if (selectedId !== null && (!todos || todos.length == 0))
      setSelectedId(null);
    if (
      todos &&
      todos.length > 0 &&
      (selectedId === null ||
        todos.filter(t => t.id === selectedId).length === 0)
    )
      setSelectedId(todos[0].id);
  }, [pasteModal]);

  const onExitSearch = () => {
    if (viewTodo) {
      setViewTodo(false);
      return;
    }
    setSearchModal(false);
    setSearchFocus(false);
    setSearchQuery(null);
  };

  const [initTodo, setInitTodo] = useState(null);
  const [todoToAdd, setTodoToAdd] = useState(null);
  const [todoToEdit, setTodoToEdit] = useState(null);

  const [splitToAdd, setSplitToAdd] = useState(null);
  const [splitToEdit, setSplitToEdit] = useState(null);

  const triggerAddorEdit = () => {
    if (addModal) {
      if (!todoToAdd.title) return;

      addTodo({ todo: todoToAdd });
      setAllTodos(null);
      setAddModal(false);
      setLastAction('Created: ' + previewText(todoToAdd.title));
    } else if (editModal) {
      if (!todoToEdit.title) return;

      editTodo({ todo: todoToEdit });
      setEditModal(false);
      setLastAction('Edited: ' + previewText(todoToEdit.title));
    }
  };

  const triggerAddorEditSplit = () => {
    if (addSplitModal) {
      if (!splitToAdd.title) return;

      addSplit({
        index: Math.max(splitToAdd.index || 0, 0),
        split: (function() {
          let d = { ...splitToAdd };
          delete d.index;
          return d;
        })()
      });
      setSplitToAdd(null);
      setAddSplitModal(false);
      setLastAction('Created split: ' + previewText(splitToAdd.title));
    } else if (editSplitModal) {
      if (!splitToEdit.title) return;

      editSplit({
        index: Math.max(splitToEdit.index || 0, 0),
        oldIndex: splitToEdit.oldIndex,
        split: (function() {
          let d = { ...splitToEdit };
          delete d.index;
          delete d.oldIndex;
          return d;
        })()
      });
      setEditSplitModal(false);
      setLastAction('Edited split: ' + previewText(splitToEdit.title));
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
        if (!todoToAdd.title) return;

        addTodo({ todo: todoToAdd });
        setAllTodos(null);
        setAddModal(false);
        setLastAction('Created: ' + previewText(todoToAdd.title));
      },
      'command+/__ctrl+/': onToggleHelp
    });
  } else if (editModal) {
    KeyBoard.bind({
      esc: () => setEditModal(false),
      enter: () => {
        if (!todoToEdit.title) return;

        editTodo({ todo: todoToEdit });
        setEditModal(false);
        setLastAction('Edited: ' + previewText(todoToEdit.title));
      },
      'command+/__ctrl+/': onToggleHelp
    });
  } else if (addSplitModal) {
    KeyBoard.bind({
      esc: () => {
        setSplitToAdd(null);
        setAddSplitModal(false);
      },
      enter: () => {
        if (!splitToAdd.title) return;

        triggerAddorEditSplit();
        setAddSplitModal(false);
        setLastAction('Added split: ' + previewText(splitToAdd.title));
      },
      'command+/__ctrl+/': onToggleHelp
    });
  } else if (editSplitModal) {
    KeyBoard.bind({
      esc: () => setEditSplitModal(false),
      enter: () => {
        if (!splitToEdit.title) return;

        triggerAddorEditSplit();
        setEditSplitModal(false);
        setLastAction('Edited split: ' + previewText(splitToEdit.title));
      },
      'command+/__ctrl+/': onToggleHelp
    });
  } else if (tagModal) {
    KeyBoard.bind({
      esc: () => {
        setTagModal(false);
      },
      'command+/__ctrl+/': onToggleHelp
    });
  } else if (searchModal && searchFocus) {
    KeyBoard.bind({
      '/': onExitSearch,
      esc: onExitSearch,
      'tab__`': onExitSearch,
      'shift+tab__shift+`': onExitSearch,
      enter: () => setSearchFocus(false),
      'command+\\__ctrl+\\': e => {
        if (
          editSplitModal ||
          editModal ||
          addModal ||
          tagModal ||
          pasteModal ||
          (!selectedSplit && selectedSplit !== 0)
        )
          return;
        setSplitToAdd({
          title: searchQuery.length <= 12 ? searchQuery : 'New Split',
          filters: searchQuery
        });
        setAddSplitModal(true);
      },
      'command+/__ctrl+/': onToggleHelp
    });
  } else if (pasteModal) {
    todos = pasteModal;
    KeyBoard.bind({
      space: e => {
        e.preventDefault();
        if (!selectedId && !viewTodo) return;
        if (selectedId || selectedId === 0) setViewTodo(!viewTodo);
      },
      k__up: e => {
        onMoveSelectUp(todos, selectedId, setSelectedId);
        e.preventDefault();
      },
      j__down: e => {
        onMoveSelectDown(todos, selectedId, setSelectedId);
        e.preventDefault();
      },
      esc: () => setPasteModal(null),
      enter: () => {
        if (!pasteModal || pasteModal.length === 0) return;

        pasteModal.forEach(t => {
          if (!t.title) return;

          const todo = { ...t };
          delete todo.id;

          addTodo({
            todo: getDefaultTodo(
              todo,
              splits,
              selectedSplit,
              pages,
              selectedPage
            )
          });
        });

        setPasteModal(null);
      },
      'command+/__ctrl+/': onToggleHelp
    });
  } else {
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
      // UNDO / REDO
      'command+z__ctrl+z': e => {
        if (store.canUndo())
          (async function() {
            const d = await store.undo();
            setLastAction(`Undo: ${d}`);
          })();
        else setLastAction('Nothing to undo');

        e.preventDefault();
      },
      'command+shift+z__ctrl+shift+z': e => {
        if (store.canRedo())
          (async function() {
            const d = await store.redo();
            setLastAction(`Redo: ${d}`);
          })();
        else setLastAction('Nothing to redo');

        e.preventDefault();
      },

      // ZOOM IN / OUT
      'command+=__ctrl+=': () =>
        webFrame.setZoomFactor(webFrame.getZoomFactor() + 0.1),
      'command+-__ctrl+-': () =>
        webFrame.setZoomFactor(webFrame.getZoomFactor() - 0.1),
      'command+0__ctrl+0': () => webFrame.setZoomFactor(1),

      // COPY
      'command+c__ctrl+c': e => {
        if (viewTodo && !window.getSelection().isCollapsed) return;
        copyTodoToClipboard(
          todos.find(t => t.id === selectedId),
          setLastAction
        );
        e.preventDefault();
      },
      'command+x__ctrl+x': e => {
        copyTodoToClipboard(todos.find(t => t.id === selectedId), () => {});
        onDeleteTodo(todos, selectedId, setSelectedId, deleteTodo, () => {});

        setLastAction('Cut 1 todo');

        e.preventDefault();
      },
      'command+shift+c__ctrl+shift+c': () =>
        copyTodosToClipboard(todos, setLastAction),

      // PASTE
      'command+v__ctrl+v': e => {
        const pasted = clipboard.readText();
        if (!pasted || pasted === '') return;

        const tt = textToTodos(pasted).map((t, i) => ({ id: i, ...t }));

        if (tt.length === 0) return;

        if (tt.length === 1) {
          setInitTodo(tt[0]);
          setAddModal(true);
          setLastAction('Importing 1 todo');
        } else {
          setPasteModal(tt);
          setLastAction(`Importing ${tt.length} todos`);
        }

        e.preventDefault();
      },
      'command+shift+v__ctrl+shift+v': e => {
        const pasted = clipboard.readText();
        if (!pasted || pasted === '') return;

        const tt = textToTodos(pasted);

        if (tt.length === 0) return;

        e.preventDefault();
        tt.forEach(t =>
          addTodo({
            todo: getDefaultTodo(t, splits, selectedSplit, pages, selectedPage)
          })
        );

        setLastAction(
          tt.length === 1 ? 'Pasted 1 todo' : `Pasted ${tt.length} todos`
        );

        e.preventDefault();
      },

      'command+shift+backspace__ctrl+shift+backspace': e => {
        const idx = splits.findIndex(s => s.position === selectedSplit);
        if (idx > -1) {
          setSelectedSplit(splits[0].position);
          removeSplit({ index: idx });
        }
      },

      'command+shift+\\__ctrl+shift+\\': e => {
        if (
          addSplitModal ||
          searchModal ||
          editModal ||
          addModal ||
          tagModal ||
          searchFocus ||
          pasteModal ||
          (!selectedSplit && selectedSplit !== 0)
        )
          return;
        setEditSplitModal(true);
      },

      'command+\\__ctrl+\\': e => {
        if (
          editSplitModal ||
          searchModal ||
          editModal ||
          addModal ||
          tagModal ||
          searchFocus ||
          pasteModal ||
          (!selectedSplit && selectedSplit !== 0)
        )
          return;
        setAddSplitModal(true);
      },

      // NAV SPLITS
      'shift+tab__shift+`': e => {
        if (searchModal) {
          e.preventDefault();
          setSearchFocus(true);
          return;
        }

        if (selectedPage) {
          setSelectedPage('');
          return;
        }
        setSelectedSplit(
          selectedSplit <=
            splits.reduce(
              (acc, s) => Math.min(s.position, acc),
              Number.MAX_SAFE_INTEGER
            )
            ? splits.reduce((acc, s) => Math.max(s.position, acc), 0)
            : splits
                .filter(s => s.position <= selectedSplit - 1)
                .reduce((acc, s) => Math.max(s.position, acc), 0)
        );
      },
      'tab__`': e => {
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
          selectedSplit >=
            splits.reduce((acc, s) => Math.max(s.position, acc), 0)
            ? splits.reduce(
                (acc, s) => Math.min(s.position, acc),
                Number.MAX_SAFE_INTEGER
              )
            : splits
                .filter(s => s.position >= selectedSplit + 1)
                .reduce(
                  (acc, s) => Math.min(s.position, acc),
                  Number.MAX_SAFE_INTEGER
                )
        );
      },

      c: e => {
        setAddModal(true);
        e.preventDefault();
      },
      l: e => {
        e.preventDefault();
        if (viewTodo) setViewTodo(false);
        if (selectedId === null) return;

        setTagModal(true);
      },
      space: e => {
        e.preventDefault();
        if (!selectedId && !viewTodo) return;
        if (selectedId) setViewTodo(!viewTodo);
      },
      s: () => {
        if (!selectedId) return;
        const t = todos.find(t => t.id === selectedId);
        if (!t) return;

        editTodo({ todo: { ...t, priority: ((t.priority || 0) + 1) % 3 } });
        setLastAction('Changed priority: ' + previewText(t.title));
      },
      t: () => {
        onDueTodayTodo(
          todos,
          selectedId,
          setSelectedId,
          editTodo,
          searchModal,
          endOfDay(),
          setLastAction
        );
      },
      e: () =>
        onMarkDoneTodo(
          todos,
          selectedId,
          setSelectedId,
          editTodo,
          searchModal,
          setLastAction
        ),
      'd d': () =>
        onDeleteTodo(
          todos,
          selectedId,
          setSelectedId,
          deleteTodo,
          setLastAction
        ),
      'command+/__ctrl+/': onToggleHelp,
      k__up: e => {
        onMoveSelectUp(todos, selectedId, setSelectedId);
        e.preventDefault();
      },
      j__down: e => {
        onMoveSelectDown(todos, selectedId, setSelectedId);
        e.preventDefault();
      },
      'K__shift+up': e => {
        // TODO: add to help
        onMoveSelectUp(todos, selectedId, setSelectedId, 10);
        e.preventDefault();
      },
      'J__shift+down': e => {
        // TODO: add to help
        onMoveSelectDown(todos, selectedId, setSelectedId, 10);
        e.preventDefault();
      },
      enter: e => {
        if (viewTodo) setViewTodo(false);
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

      'command+,__ctrl+,': () => onSettings(true),
      '/__command+f__ctrl+f': e => {
        setSearchFocus(true);
        if (searchModal) {
          e.preventDefault();
          return;
        }

        if (viewTodo) setViewTodo(false);

        //   const filter = (function() {
        //     let filter = '';
        //     if (selectedPage !== '') {
        //       const p = pages.find(p => p.shortcut === selectedPage);
        //       filter = p && p.filters ? p.filters : '';
        //     }

        //     if (selectedSplit !== null && selectedSplit >= 0) {
        //       const s = splits.find(p => p.position === selectedSplit);
        //       filter = s && s.filters ? s.filters : '';
        //     }

        //     return filter;
        //   })();

        setSearchQuery(/*filter*/ '');
        setSearchModal(true);

        e.preventDefault();
      }
    });
  }

  if (viewTodo && !selectedId) setViewTodo(false);

  if (addModal) {
    const init = getDefaultTodo(
      initTodo,
      splits,
      selectedSplit,
      pages,
      selectedPage
    );

    return (
      <EditTodo
        create={true}
        defaultTodo={init}
        onUpdate={a => {
          setTodoToAdd(a);
          setInitTodo(null);
        }}
        trigger={a => {
          triggerAddorEdit(a);
          setInitTodo(null);
        }}
        cancel={a => {
          cancelAddorEdit(a);
          setInitTodo(null);
        }}
      />
    );
  }

  if (editModal)
    return (
      <EditTodo
        onUpdate={setTodoToEdit}
        defaultTodo={todos.find(t => t.id === selectedId)}
        trigger={triggerAddorEdit}
        cancel={cancelAddorEdit}
      />
    );

  if (editSplitModal)
    return (
      <EditSplit
        splits={splits}
        onUpdate={s => setSplitToEdit(s)}
        defaultSplit={splits.find(t => t.position === selectedSplit)}
        defaultIndex={splits.findIndex(t => t.position === selectedSplit)}
        trigger={triggerAddorEditSplit}
        cancel={() => setEditSplitModal(false)}
      />
    );

  if (addSplitModal)
    return (
      <EditSplit
        create={true}
        splits={splits}
        onUpdate={s => setSplitToAdd(s)}
        defaultSplit={splitToAdd}
        trigger={triggerAddorEditSplit}
        cancel={() => {
          setSplitToAdd(null);
          setAddSplitModal(false);
        }}
      />
    );

  if (pasteModal && pasteModal.length > 0)
    return (
      <>
        <span className={styles.Header}>Confirm Import Todos</span>

        <ViewTodo
          todo={pasteModal.find(t => t.id === selectedId)}
          show={viewTodo}
          onClick={() => setViewTodo(false)}
        />

        <List
          showImage={false}
          todos={pasteModal}
          selectedId={selectedId}
          onHover={id => setSelectedId(id)}
          onClick={id => {
            if (id !== selectedId) setSelectedId(id);
            setViewTodo(true);
          }}
        />
      </>
    );

  return (
    <div className={styles.TodoList}>
      {searchModal ? (
        <Search
          defaultQuery={searchQuery}
          onUpdate={setSearchQuery}
          onUpdateFocus={f => setSearchFocus(f)}
          hasFocus={searchFocus}
        />
      ) : selectedPage ? (
        <Page
          pages={pages}
          selectedPage={selectedPage}
          onClick={() => setSelectedPage('')}
        />
      ) : (
        <Splits
          splits={splits}
          selectedSplit={selectedSplit}
          onClick={setSelectedSplit}
        />
      )}

      {tagModal ? (
        <TagEditor
          onCancel={() => setTagModal(false)}
          allTags={tags}
          currentTags={
            (todos.find(t => t.id === selectedId) || { tags: [] }).tags
          }
          onExecute={(tag, remove) => {
            setTagModal(false);

            const t = todos.find(t => t.id === selectedId);
            let tags = [...t.tags];

            if (remove) tags = tags.filter(t => t !== tag);
            else tags.push(tag);

            editTodo({
              todo: {
                ...t,
                updated_at: new Date().getTime(),
                tags
              }
            });

            setLastAction('Updated tags: ' + previewText(t.title));
          }}
        />
      ) : null}

      <ViewTodo
        todo={todos.find(t => t.id === selectedId)}
        show={viewTodo}
        onClick={() => setViewTodo(false)}
      />

      <List
        showImage={!searchModal && !selectedPage && Array.isArray(allTodos)}
        todos={todos}
        selectedId={searchFocus ? null : selectedId}
        onHover={a => {
          setSelectedId(a);
        }}
        onClick={id => {
          if (id !== selectedId) setSelectedId(id);
          setViewTodo(true);
        }}
      />
    </div>
  );
}

function getDefaultTodo(initTodo, splits, selectedSplit, pages, selectedPage) {
  let init = initTodo ? { ...initTodo } : {};

  const initTags = init.tags ? init.tags : [];

  if (splits) {
    const s = splits.find(s => s.position === selectedSplit);
    if (s) {
      const def = filter.applyTimes(s.default);
      if (def)
        init = {
          ...init,
          ...def,
          tags: [...initTags, ...(def && def.tags ? def.tags : [])]
        };

      // Remove higher order tags from init
      init.tags = filter.higerOrderTags(init.tags, splits, selectedSplit);
    }
  }

  if (selectedPage !== '') {
    const p = pages.find(p => p.shortcut === selectedPage);
    if (p && p.default) {
      init = {
        ...init,
        ...p.default,
        tags: [
          ...initTags,
          ...(p.default && p.default.tags ? p.default.tags : [])
        ]
      };
    }
  }

  let defaultTodo = {
    title: '',
    notes: '',
    priority: 0,
    done: false,
    created_at: 0,
    updated_at: 0,
    done_at: null,
    due_at: null,
    tags: []
  };

  if (init) {
    defaultTodo = { ...defaultTodo, ...init };

    if (init.due_at === 0) defaultTodo.due_at = endOfDay();
    if (init.created_at) {
      defaultTodo.created_at = init.created_at;
    } else {
      defaultTodo.created_at = new Date().getTime();
    }
    if (!init.done) defaultTodo.done_at = null;
  }

  defaultTodo.tags = defaultTodo.tags.filter(
    (t, i) => defaultTodo.tags.indexOf(t) === i
  );

  return defaultTodo;
}
