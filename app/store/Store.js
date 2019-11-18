import SettingsStore from './SettingsStore';
import TodoStore from './TodoStore';

class Store {
  constructor() {
    this.settingsStore = new SettingsStore();
    this.todoStore = new TodoStore();
    this.todoStore.init();
  }

  /*           [ todo methods ]             */

  async countTodos() {
    return await this.todoStore.count();
  }

  async subscribeToTodos(fn) {
    return await this.todoStore.subscribeToTodos(fn);
  }

  async todoExists(id) {
    return await this.todoStore.exists(id);
  }

  async removeTodo(id) {
    await this.todoStore.removeTodo(id);
  }

  async addTodo(t) {
    await this.todoStore.addTodo(t);
  }

  async editTodo(t) {
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
