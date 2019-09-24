const eStore = require('electron-store');

// new fields here
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
}

// const schema = {
//   todos: {
//     type: 'array',
//     items: {
//       type: 'object',
//       properties: {
//         id: { type: 'number' },
//         done: { type: 'boolean' },
//         title: { type: 'string' },
//         prioriry: { type: 'number' },
//         labels: {
//           type: 'array',
//           items: { type: 'string' }
//         },
//         due: { type: 'Date' }
//       }
//     }
//   },
//   splits: {
//     type: 'array',
//     items: {
//       type: 'object',
//       properties: {
//         name: { type: 'string' },
//         filter: { type: 'string' }
//       }
//     }
//   }
// };

// export default class Store {
//   constructor() {
//     this.store = new eStore({ schema });
//     this.todos = this.store.get('todos', []);
//     this.splits = this.store.get('splits', []);
//   }

//   saveTodos() {
//     this.store.set('todos', this.todos);
//   }

//   saveSplits() {
//     this.store.set('splits', this.splits);
//   }

//   getTodos() {
//     return this.todos;
//   }
//   addTodo(todo) {
//     this.todos.push(todo);
//     this.saveTodos();
//   }
//   removeTodo(id) {
//     this.todos = this.todos.filter(t => t.id !== id);
//     this.saveTodos();
//   }
// }
