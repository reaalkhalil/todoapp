import RxDB from 'rxdb';
RxDB.plugin(require('pouchdb-adapter-http'));

const todosSchema = {
  title: 'todos schema',
  description: 'describes a simple todo',
  version: 0,
  type: 'object',
  properties: {
    id: { type: 'string', primary: true },

    title: { type: 'string' },

    notes: { type: 'string' },

    priority: { type: 'number' },

    tags: { type: 'array', items: { type: 'string' } },

    done: { type: 'boolean' },

    created_at: { type: 'number' },

    updated_at: { type: 'number' },

    done_at: { type: ['number', 'null'] },

    due_at: { type: ['number', 'null'] }
  },
  required: ['id', 'title']
};

let _getDatabase; // cached
export default function getDatabase(name, adapter) {
  try {
    if (!_getDatabase) _getDatabase = createDatabase(name, adapter);
    return _getDatabase;
  } catch (e) {
    console.error('===', e);
  }
}

async function createDatabase(name, adapter) {
  const db = await RxDB.create({
    name,
    adapter
  });

  console.log('creating todo-collection..');
  await db.collection({
    name: 'todos',
    schema: todosSchema
  });

  return db;
}
