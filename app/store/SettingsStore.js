import { initialSettings } from './initial';

const ElectronStore = require('electron-store');
const uuid = require('uuid/v4');

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
  settings: SettingsSchema,
  __migration: { type: 'string' }
};

/*
const migrationStore = new ElectronStore();
const m = migrationStore.get('__migration');
if (!m || m !== '0.2.0') {
  migrationStore.delete('settings');
  migrationStore.set('__migration', '0.2.0');
}
*/

export default class SettingsStore {
  constructor() {
    this.store = new ElectronStore({ schema });

    if (!this.store.get('integrations')) this.store.set('integrations', []);

    if (!this.store.get('settings'))
      this.store.set('settings', initialSettings);

    const uid = this.store.get('user_id');
    if (uid && uid.length === 36) return;

    this.store.set('todos', initialTodos); // TODO remove
    this.store.set('user_id', uuid());
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
