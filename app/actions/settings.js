// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const SAVE_SETTINGS = 'SAVE_SETTINGS';

export function save(data) {
  return {
    type: SAVE_SETTINGS,
    data
  };
}
