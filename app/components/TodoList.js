// @flow
import React, { useState, useEffect } from 'react';
import { ipcRenderer, clipboard, webFrame } from 'electron';

import Search from './Search';
import EditTodo from './EditTodo';
import { Splits, Page } from './Splits';
import TagEditor from './TagEditor';
import List from './List';
import * as filter from '../filter';

import KeyBoard from '../keyboard';
import { previewText, endOfDay, todoToText, textToTodos } from '../utils';

import ViewTodo from './ViewTodo';

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
  if (todos.length === 1) setLastAction(`Copied 1 Todo to Clipboard`);
  else setLastAction(`Copied ${todos.length} Todos to Clipboard`);
};

const copyTodoToClipboard = (todo, setLastAction) => {
  if (!todo) return;
  clipboard.writeText(todoToText(todo));
  setLastAction(`Copied 1 Todo to Clipboard`);
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

  setLastAction(
    (toDoneStatus ? 'Done: ' : 'Not Done: ') + previewText(t.title)
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

  setLastAction(
    (dueToday ? 'Moved to Today: ' : 'Moved out of Today: ') +
      previewText(t.title)
  );
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
  if (todos.length > 1) {
    let idx = i + 1;
    if (idx >= todos.length) idx = todos.length - 2;
    setSelectedId(todos[idx].id);
  } else {
    setSelectedId(null);
  }

  deleteTodo({ id: selectedId });
  setLastAction('Deleted: ' + previewText(todos[i].title));
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

export default function TodoList({
  addTodo,
  deleteTodo,
  editTodo,
  setLastAction,
  todos,
  splits,
  pages,
  onHelp,
  onSettings,
  helpOpen,
  deselectNewlyCreated,
  newlyCreatedId,
  canUndo,
  undo,
  canRedo,
  redo
}) {
  const [selectedSplit, setSelectedSplit] = useState(0);
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedPage, setSelectedPage] = useState('');

  const tags = filter.getTags(todos);

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

  useEffect(() => {
    if (
      (newlyCreatedId === 0 || newlyCreatedId) &&
      todos.find(t => t.id === newlyCreatedId)
    ) {
      setSelectedId(newlyCreatedId);
    }
  }, [newlyCreatedId]);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [viewTodo, setViewTodo] = useState(false);
  const [helpModal, setHelpModal] = useState(helpOpen);
  const [pasteModal, setPasteModal] = useState(null);

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

  const [initTodo, setInitTodo] = useState(null);
  const [todoToAdd, setTodoToAdd] = useState(null);
  const [todoToEdit, setTodoToEdit] = useState(null);

  const triggerAddorEdit = () => {
    if (addModal) {
      addTodo({ todo: todoToAdd });
      setAddModal(false);
      setLastAction('Created: ' + previewText(todoToAdd.title));
    } else if (editModal) {
      editTodo({ todo: todoToEdit });
      setEditModal(false);
      setLastAction('Edited: ' + previewText(todoToEdit.title));
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
        setLastAction('Created: ' + previewText(todoToAdd.title));
      }
    });
  } else if (editModal) {
    KeyBoard.bind({
      esc: () => setEditModal(false),
      enter: () => {
        editTodo({ todo: todoToEdit });
        setEditModal(false);
        setLastAction('Edited: ' + previewText(todoToEdit.title));
      }
    });
  } else if (tagModal) {
    KeyBoard.bind({
      esc: () => {
        setTagModal(false);
      }
    });
  } else if (searchModal && searchFocus) {
    KeyBoard.bind({
      '/': onExitSearch,
      esc: onExitSearch,
      'tab|`': onExitSearch,
      'shift+tab|shift+`': onExitSearch,
      enter: () => setSearchFocus(false)
    });
  } else if (pasteModal) {
    KeyBoard.bind({
      esc: () => setPasteModal(null),
      enter: () => {
        if (!pasteModal || pasteModal.length === 0) return;

        pasteModal.forEach(t => {
          addTodo({
            todo: getDefaultTodo(t, splits, selectedSplit, pages, selectedPage)
          });
        });

        setPasteModal(null);
      }
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
      // UNDO / REDO
      'command+z|ctrl+z': e => {
        if (canUndo) {
          undo();
          setLastAction('Undo');
        } else setLastAction('Nothing to Undo');

        e.preventDefault();
      },
      'command+shift+z|ctrl+shift+z': e => {
        if (canRedo) {
          redo();
          setLastAction('Redo');
        } else setLastAction('Nothing to Redo');

        e.preventDefault();
      },

      // ZOOM IN / OUT
      'command+=': () => webFrame.setZoomFactor(webFrame.getZoomFactor() + 0.1),
      'command+-': () => webFrame.setZoomFactor(webFrame.getZoomFactor() - 0.1),
      'command+0': () => webFrame.setZoomFactor(1),

      // COPY
      'command+c': e => {
        copyTodoToClipboard(
          todos.find(t => t.id === selectedId),
          setLastAction
        );
        e.preventDefault();
      },
      'command+x': e => {
        copyTodoToClipboard(todos.find(t => t.id === selectedId), () => {});
        onDeleteTodo(todos, selectedId, setSelectedId, deleteTodo, () => {});

        setLastAction('Cut 1 Todo');

        e.preventDefault();
      },
      'command+shift+c': () => copyTodosToClipboard(todos, setLastAction),

      // PASTE
      'command+v': e => {
        const pasted = clipboard.readText();
        if (!pasted || pasted === '') return;

        const tt = textToTodos(pasted);

        if (tt.length === 0) return;

        if (tt.length === 1) {
          setInitTodo(tt[0]);
          setAddModal(true);
          setLastAction('Pasted 1 Todo');
        } else {
          setPasteModal(tt);
          setLastAction(`Pasted ${tt.length} Todos`);
        }

        e.preventDefault();
      },
      'command+shift+v': e => {
        const pasted = clipboard.readText();
        if (!pasted || pasted === '') return;

        const tt = textToTodos(pasted);

        if (tt.length === 0) return;

        e.preventDefault();
        tt.forEach(t => {
          addTodo({
            todo: getDefaultTodo(t, splits, selectedSplit, pages, selectedPage)
          });
        });

        setLastAction(
          tt.length === 1 ? 'Pasted 1 Todo' : `Pasted ${tt.length} Todos`
        );

        e.preventDefault();
      },

      // NAV SPLITS
      'shift+tab|shift+`': e => {
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
      'tab|`': e => {
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

      c: e => {
        setAddModal(true);
        e.preventDefault();
      },
      l: e => {
        e.preventDefault();
        if (selectedId === null) return;

        setTagModal(true);
      },
      space: e => {
        e.preventDefault();
        if (selectedId !== 0 && !selectedId && !viewTodo) return;
        if (selectedId) setViewTodo(!viewTodo);
      },
      s: () => {
        if (selectedId !== 0 && !selectedId) return;
        const t = todos.find(t => t.id === selectedId);
        if (!t) return;
        editTodo({ todo: { ...t, priority: ((t.priority || 0) + 1) % 3 } });
        setLastAction('Changed Priority: ' + previewText(t.title));
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

      'command+,|ctrl+,': () => onSettings(true),
      '/|command+f|ctrl+f': e => {
        setSearchFocus(true);
        if (searchModal) return;

        if (viewTodo) setViewTodo(false);
        setSearchModal(true);

        setSearchQuery('');
        e.preventDefault();
      }
    });
  }

  if (viewTodo && selectedId !== 0 && !selectedId) setViewTodo(false);

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
        helpOpen={helpModal}
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
        helpOpen={helpModal}
        onUpdate={setTodoToEdit}
        defaultTodo={todos.find(t => t.id === selectedId)}
        trigger={triggerAddorEdit}
        cancel={cancelAddorEdit}
      />
    );

  if (pasteModal && pasteModal.length > 0)
    return (
      <>
        <span className={styles.Header}>Confirm Import Todos</span>

        <List
          showImage={false}
          helpOpen={helpModal}
          todos={pasteModal}
          selectedId={null}
        />
      </>
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
        <Page
          pages={pages}
          selectedPage={selectedPage}
          onClick={() => setSelectedPage('')}
        />
      ) : (
        <Splits
          helpOpen={helpModal}
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
            let tags = t.tags;

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
        helpOpen={helpOpen}
        show={viewTodo}
        onClick={() => setViewTodo(false)}
      />

      <List
        showImage={!searchModal}
        helpOpen={helpModal}
        todos={todos}
        selectedId={searchFocus ? null : selectedId}
        onHover={a => {
          setSelectedId(a);
        }}
        onClick={(id, meta) => {
          if (id !== selectedId) {
            setSelectedId(id);
          }
          if (!meta) setViewTodo(true);
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
      if (s.default)
        init = {
          ...init,
          ...s.default,
          tags: [
            ...initTags,
            ...(s.default && s.default.tags ? s.default.tags : [])
          ]
        };

      // Remove higher order tags from init
      // TODO: does this need to be smarter? maybe worry about it when query language is improved
      const higherOrderSplits = [];
      splits.some(s => {
        if (s.position === selectedSplit) {
          return true;
        } else {
          higherOrderSplits.push(s);
        }
      });
      const tags = [];
      higherOrderSplits.forEach(s => {
        if (s.filters && s.filters.length > 0) {
          s.filters.forEach(f => {
            if (f.field === 'tags' && f.op === 'CONTAINS') tags.push(f.value);
          });
        }
      });

      init.tags = init.tags.filter(t => tags.indexOf(t) === -1);
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
    content: '',
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
