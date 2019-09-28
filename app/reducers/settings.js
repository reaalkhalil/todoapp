// @flow
import { SAVE_SETTINGS } from '../actions/settings';
import type { Action, Todo } from './types';

export default function settings(state: Settings = {}, action: Action) {
  if (action.type === SAVE_SETTINGS && action.data.settings) {
    return action.data.settings;
  }

  return state;
}
