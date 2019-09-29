const eStore = require('electron-store');
const uuid = require('uuid/v4');

import { initialTodos, initialSettings } from './initial';

// ADDFIELDS:
const TodoSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    content: { type: 'string' },
    priority: { type: 'number' },
    done: { type: 'boolean' },
    created_at: { type: 'number' },
    updated_at: { type: 'number' },
    done_at: { type: ['number', 'null'] },
    due_at: { type: ['number', 'null'] },
    tags: { type: 'array', items: { type: 'string' } }
  }
};

const filters = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      field: { type: 'string' },
      op: { type: 'string' },
      value: { type: ['string', 'number', 'boolean'] }
    }
  }
};

export const SettingsSchema = {
  type: 'object',
  properties: {
    splits: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: { type: 'number' },
          title: { type: 'string' },
          shortcut: { type: 'string' },
          sort: { type: 'array', items: { type: 'string' } },
          filters: filters
        }
      }
    },
    pages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: { type: 'number' },
          title: { type: 'string' },
          shortcut: { type: 'string' },
          sort: { type: 'array', items: { type: 'string' } },
          filters: filters
        }
      }
    }
  }
};

const schema = {
  user_id: {
    type: 'string'
  },
  todos: {
    type: 'array',
    items: TodoSchema
  },
  settings: SettingsSchema
};

export default class Store {
  constructor() {
    this.store = new eStore({ schema });
    let uid = this.store.get('user_id');
    if (uid && uid.length === 36) return;

    this.store.set('settings', initialSettings);
    this.store.set('todos', initialTodos);
    this.store.set('user_id', uuid());
  }

  saveTodos(todos) {
    this.store.set('todos', todos);
  }

  getTodos() {
    return this.store.get('todos', []);
  }

  saveSettings(settings) {
    this.store.set('settings', settings);
  }

  getSettings() {
    return this.store.get('settings', {});
  }

  getUserId() {
    return this.store.get('user_id');
  }
}
