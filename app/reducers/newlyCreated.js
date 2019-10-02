import { ADD_TODO, DESELECT_NEWLY_CREATED } from '../actions/todos';

export default function newlyCreated(newlyCreatedId, action) {
  console.log('ssssssssssssssssssssssssssssss', newlyCreatedId, action);
  switch (action.type) {
    case ADD_TODO:
      return action.data.todo.id;
    case DESELECT_NEWLY_CREATED:
      return null;
    default:
      return null;
  }
}
