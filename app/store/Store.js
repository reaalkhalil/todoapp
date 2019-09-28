const eStore = require('electron-store');
const uuid = require('uuid/v4');

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
          filters: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                op: { type: 'string' },
                value: { type: ['string', 'number', 'boolean'] }
              }
            }
          }
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
  }

  saveTodos(todos) {
    this.store.set('todos', todos);
  }

  getTodos() {
    return this.store.get('todos', []);
  }

  saveSettings(settings) {
    console.log('SAVE SETTINGS', settings);
    this.store.set('settings', settings);
  }

  getSettings() {
    const a = this.store.get('settings', {});
    console.log('getSettings() => ', a);
    return a;
  }

  getUserId() {
    let uid = this.store.get('user_id') || uuid();
    this.store.set('user_id', uid);
    return uid;
  }
}
