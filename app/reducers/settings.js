// @flow
import { SAVE_SETTINGS, ADD_INTEGRATIONS } from '../actions/settings';
import type { Action } from './types';

export function settings(state: Settings = {}, action: Action) {
  if (action.type === SAVE_SETTINGS && action.data.settings) {
    return action.data.settings;
  }

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
