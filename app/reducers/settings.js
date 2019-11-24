// @flow
import {
  SAVE_SETTINGS,
  ADD_INTEGRATIONS,
  EDIT_SPLIT,
  ADD_SPLIT,
  REMOVE_SPLIT
} from '../actions/settings';
import type { Action } from './types';
import { formatSplits } from '../utils/settings';

export function settings(state: Settings = {}, action: Action) {
  if (
    (action.type === EDIT_SPLIT ||
      action.type === ADD_SPLIT ||
      action.type === REMOVE_SPLIT) &&
    action.data.splits
  )
    return { ...state, splits: formatSplits(action.data.splits) };

  if (action.type === SAVE_SETTINGS && action.data.settings)
    return {
      ...action.data.settings,
      splits: formatSplits(action.data.settings.splits)
    };

  return state;
}

export function integrations(state = [], action) {
  if (action.type === ADD_INTEGRATIONS) {
    return action.data && action.data.integrations
      ? [...state, ...action.data.integrations]
      : state;
  }

  return state;
}

export function userId(state = '', action) {
  return state;
}
