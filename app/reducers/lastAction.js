import { LAST_ACTION } from '../actions/todos';

export default function lastAction(lastAction = null, action) {
  return action.type === LAST_ACTION
    ? { text: action.data, date: new Date().getTime() }
    : lastAction;
}
