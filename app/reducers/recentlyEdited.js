import { SET_RECENT_EDIT } from '../actions/todos';

export default function recentlyEdited(recentlyEditedId, action) {
  switch (action.type) {
    case SET_RECENT_EDIT:
      return action.data.id;
    default:
      return null;
  }
}
