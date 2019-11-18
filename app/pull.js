const initInterval = 60 * 1000;
const maxInterval = 3600 * 1000;

class TodoPuller {
  constructor(delay = initInterval) {
    this.userId = '';
    this.integrations = [];
    this.addFunc = () => {};
    this.lastActionFunc = () => {};
    this.delay = delay;
    this.interval = setInterval(() => this.checkForTodos(), delay);
  }

  init(initData) {
    const { userId, addFunc, lastActionFunc, integrations } = initData;

    if (this.userId === '') {
      this.userId = userId;
      this.addFunc = addFunc;
      this.lastActionFunc = lastActionFunc;
    }

    if (
      this.integrations.length !== integrations.length ||
      (this.integrations.length > 0 &&
        JSON.stringify(this.integrations) !== JSON.stringify(integrations))
    ) {
      this.clearBackOff();
      this.integrations = integrations;
    }
  }

  addTodos(tt) {
    if (!tt || tt.length === 0) return;

    tt.forEach(t => {
      this.addFunc({
        title: t.title || t.Title,
        notes: t.content || t.Content,
        priority: 0,
        done: false,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        done_at: null,
        due_at: null,
        tags: []
      });
    });

    this.lastActionFunc(tt.length);
  }

  backOff() {
    console.info('backOff()', this.delay);

    if (this.delay >= maxInterval) return;
    this.delay = Math.round(this.delay * 1.5);

    clearInterval(this.interval);
    this.interval = setInterval(() => this.checkForTodos(), this.delay);
  }

  clearBackOff() {
    console.info('clearBackOff()', this.delay);

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
        r.json()
          .then(d => {
            console.info('checkForTodos()', d);

            this.clearBackOff();
            if (d.todos && d.todos.length > 0) this.addTodos(d.todos);
          })
          .catch(e => this.backOff());
      })
      .catch(e => this.backOff());
  }
}

const pull = new TodoPuller();

export default pull;
