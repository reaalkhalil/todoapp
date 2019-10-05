class TodoPuller {
  constructor(interval = 60 * 1000) {
    console.log('new TodoPuller');
    this.userId = '';
    this.integrations = [];
    this.addFunc = () => {};
    this.interval = setInterval(() => this.checkForTodos(), interval);
  }

  setUserId(id) {
    this.userId = id;
  }

  setIntegrations(integrations) {
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

  checkForTodos() {
    if (
      !this.userId ||
      !this.integrations ||
      this.integrations.length === 0 ||
      !this.addFunc
    )
      return;

    console.log('checkForTodos()');

    fetch('https://todoapp.cc/server/pull/' + this.userId)
      .then(r => {
        r.json().then(d => {
          console.log(d);
          if (d.todos && d.todos.length > 0) this.addTodos(d.todos);
        });
      })
      .catch(e => console.log(e));
  }
}

const pull = new TodoPuller();

export default pull;
