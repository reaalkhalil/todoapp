import { LAST_ACTION } from '../actions/todos';

export default function lastAction(lastAction = '', action) {
  return action.type === LAST_ACTION ? action.data : '';
}
