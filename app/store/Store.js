const eStore = require('electron-store');

const schema = {
  todos: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        priority: { type: 'number' },
        done: { type: 'boolean' },
        tags: { type: 'array', items: { type: 'string' } }
      }
    }
  },
  settings: {
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
  }
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
}
