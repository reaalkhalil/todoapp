import SettingsStore from './SettingsStore';
import TodoStore from './TodoStore';

import { analytics, Categories, Actions } from '../utils/analytics';

class Store {
  constructor() {
    this.settingsStore = new SettingsStore();
    analytics.init(this.settingsStore.getUserId());

    this.todoStore = new TodoStore();
    this.todoStore.init();
  }

  /*           [ todo methods ]             */

  async subscribeToTodos(fn) {
    return await this.todoStore.subscribeToTodos(fn);
  }

  async todoExists(id) {
    return await this.todoStore.exists(id);
  }

  async removeTodo(id) {
    analytics.event(Categories.USER_INTERACTION, Actions.TODO_DELETE);

    await this.todoStore.removeTodo(id);
  }

  async addTodo(t) {
    analytics.event(Categories.USER_INTERACTION, Actions.TODO_CREATE);

    await this.todoStore.addTodo(t);
  }

  async editTodo(t) {
    analytics.event(Categories.USER_INTERACTION, Actions.TODO_EDIT);

    await this.todoStore.editTodo(t);
  }

  canUndo() {
    return this.todoStore.canUndo();
  }

  canRedo() {
    return this.todoStore.canRedo();
  }

  async undo() {
    return await this.todoStore.undo();
  }

  async redo() {
    return await this.todoStore.redo();
  }

  /*          [ settings methods ]           */

  saveSettings(settings) {
    this.settingsStore.saveSettings(settings);
  }

  getSettings() {
    return this.settingsStore.getSettings();
  }

  getUserId() {
    return this.settingsStore.getUserId();
  }

  getIntegrations() {
    return this.settingsStore.getIntegrations();
  }

  setIntegrations(integrations) {
    this.settingsStore.setIntegrations(integrations);
  }
}

const store = new Store();
export default store;
