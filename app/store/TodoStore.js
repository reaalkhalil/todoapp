import getDatabase from './tododb';
import RxDB from 'rxdb';
RxDB.plugin(require('pouchdb-adapter-idb'));

import { previewText } from '../utils';
import { initialTodos } from './initial';

const newError = str => ({
  type: 'error',
  message: str
});

const ok = val => val && !(val.type && val.type === 'error');

let _doneLoading;
let _loading = new Promise(r => {
  _doneLoading = r;
});

export default class TodoStore {
  async init() {
    this._db = await getDatabase('todosdb', 'idb');
    this._past = [];
    this._future = [];

    const tt = await this._db.todos.find().exec();

    if (!tt || !tt.length) await this._db.todos.bulkInsert(initialTodos);

    _doneLoading();
  }

  async subscribeToTodos(fn) {
    await _loading;

    if (!fn) return newError('subscribe function not provided');

    const sub = this._db.todos
      .find()
      .sort({
        id: 1
      })
      .$.subscribe(tt => {
        fn(
          tt.map(t => {
            const newT = t.toJSON();
            delete newT._rev;
            return newT;
          })
        );
      });

    return () => sub.unsubscribe();
  }

  async _getTodoJSON(id) {
    await _loading;

    const todo = await this._db.todos.findOne(id).exec();
    return todo ? await todo.toJSON() : newError('could not find todo');
  }

  async _removeTodo(id) {
    await _loading;

    const t = await this._db.todos.findOne(id).exec();
    if (!t) return;
    t.remove();
  }

  async exists(id) {
    await _loading;

    const todo = await this._db.todos.findOne(id).exec();
    return !!todo;
  }

  async _addTodo(t) {
    await _loading;

    await this._db.todos.insert({
      id: t.id,
      title: t.title,
      notes: t.notes || '',
      priority: t.priority || 0,
      tags: t.tags || [],
      done: t.done || false,
      created_at: t.created_at || new Date().getTime(),
      updated_at: t.updated_at || new Date().getTime(),
      due_at: t.due_at || null,
      done_at: t.done_at || null
    });
  }

  async _editTodo(newT) {
    await _loading;

    const t = await this._db.todos.findOne(newT.id).exec();
    if (!t) return;

    await t.update({
      $set: {
        title: newT.title,
        notes: newT.notes || '',
        priority: newT.priority || 0,
        tags: newT.tags || [],
        done: newT.done || false,
        created_at: newT.created_at || new Date().getTime(),
        updated_at: newT.updated_at || new Date().getTime(),
        due_at: newT.due_at || null,
        done_at: newT.done_at || null
      }
    });
  }

  async removeTodo(id) {
    const t = await this._getTodoJSON(id);
    if (!ok(t)) return;

    await this._removeTodo(id);

    this._past.push({
      description: `Delete: ${previewText(t.title)}`,
      re: async () => await this._removeTodo(id),
      un: async () => await this._addTodo(t)
    });

    this._future = [];
  }

  async addTodo(t) {
    await this._addTodo(t);

    this._past.push({
      description: `Create: ${previewText(t.title)}`,
      re: async () => await this._addTodo(t),
      un: async () => await this._removeTodo(t.id)
    });

    this._future = [];
  }

  async editTodo(t) {
    const oldT = await this._getTodoJSON(t.id);
    if (!ok(oldT)) return;

    await this._editTodo({ ...t });

    this._past.push({
      description: `Edit: ${previewText(t.title)}`,
      re: async () => await this._editTodo({ ...t }),
      un: async () => await this._editTodo({ ...oldT, id: t.id })
    });

    this._future = [];
  }

  canUndo() {
    return this._past.length > 0 && this._past[this._past.length - 1];
  }

  canRedo() {
    return this._future.length > 0 && this._future[this._future.length - 1];
  }

  async undo() {
    const p = this._past.pop();
    if (!p || !p.un) return;

    this._future.push(p);

    await p.un();

    return p.description;
  }

  async redo() {
    const f = this._future.pop();
    if (!f || !f.re) return;

    this._past.push(f);

    await f.re();

    return f.description;
  }
}
