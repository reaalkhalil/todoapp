const initInterval = 60 * 1000;
const maxInterval = 3600 * 1000;

class TodoPuller {
  constructor(delay = initInterval) {
    console.log('new TodoPuller');
    this.userId = '';
    this.integrations = [];
    this.addFunc = () => {};
    this.delay = delay;
    this.interval = setInterval(() => this.checkForTodos(), delay);
  }

  setUserId(id) {
    this.userId = id;
  }

  setIntegrations(integrations) {
    if (integrations.length > this.integrations.length) this.clearBackOff();
    this.integrations = integrations;
  }

  setAddFunc(addFunc) {
    this.addFunc = addFunc;
  }

  addTodos(tt) {
    tt.forEach(t => {
      this.addFunc({
        title: t.title || t.Title,
        content: t.content || t.Content,
        priority: 0,
        done: false,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        done_at: null,
        due_at: null,
        tags: []
      });
    });
  }

  backOff() {
    console.log('backOff()', this.delay);

    if (this.delay >= maxInterval) return;
    this.delay = Math.round(this.delay * 1.5);

    clearInterval(this.interval);
    this.interval = setInterval(() => this.checkForTodos(), this.delay);
  }

  clearBackOff() {
    console.log('clearBackOff()', this.delay);

    if (this.delay === initInterval) return;
    this.delay = initInterval;

    clearInterval(this.interval);
    this.interval = setInterval(() => this.checkForTodos(), this.delay);
  }

  checkForTodos() {
    if (
      !this.userId ||
      !this.integrations ||
      this.integrations.length === 0 ||
      !this.addFunc
    )
      return;

    fetch('https://todoapp.cc/server/pull/' + this.userId)
      .then(r => {
        r.json().then(d => {
          console.log('checkForTodos()', d);

          this.clearBackOff();
          if (d.todos && d.todos.length > 0) this.addTodos(d.todos);
        });
      })
      .catch(e => this.backOff());
  }
}

const pull = new TodoPuller();

export default pull;
