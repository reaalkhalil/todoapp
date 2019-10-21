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

const IntegrationsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      value: { type: 'string' }
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
          sort: { type: 'string' },
          filters: { type: 'string' }
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
          sort: { type: 'string' },
          filters: { type: 'string' }
        }
      }
    }
  }
};

const schema = {
  user_id: {
    type: 'string'
  },
  integrations: IntegrationsSchema,
  todos: {
    type: 'array',
    items: TodoSchema
  },
  settings: SettingsSchema,
  __migration: { type: 'string' }
};

const migrationStore = new eStore();
const m = migrationStore.get('__migration');
if (!m || m !== '0.2.0') {
  migrationStore.delete('settings');
  migrationStore.set('__migration', '0.2.0');
}

export default class Store {
  constructor() {
    this.store = new eStore({ schema });

    if (!this.store.get('integrations')) this.store.set('integrations', []);

    if (!this.store.get('settings'))
      this.store.set('settings', initialSettings);

    let uid = this.store.get('user_id');
    if (uid && uid.length === 36) return;

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

  getIntegrations() {
    return this.store.get('integrations');
  }

  setIntegrations(integrations) {
    return this.store.set('integrations', integrations);
  }
}
