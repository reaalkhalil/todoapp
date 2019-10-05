// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const SAVE_SETTINGS = 'SAVE_SETTINGS';
export const ADD_INTEGRATIONS = 'ADD_INTEGRATIONS';

export function save(data) {
  return {
    type: SAVE_SETTINGS,
    data
  };
}

function addIntegrations(data) {
  return {
    type: ADD_INTEGRATIONS,
    data
  };
}

export function verifyIntegrations() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { integrations, userId } = getState();

    fetch('https://todoapp.cc/server/pull/' + userId)
      .then(r => {
        r.json()
          .then(d => {
            const ii = [];

            if (
              d &&
              d.telegram &&
              d.telegram.length > 0 &&
              !integrations.find(i => i.name === 'telegram')
            ) {
              ii.push({ name: 'telegram', value: d.telegram });
            }

            if (
              d &&
              d.email &&
              d.email.length > 0 &&
              !integrations.find(i => i.name === 'email')
            ) {
              ii.push({ name: 'email', value: d.email });
            }

            dispatch(addIntegrations({ integrations: ii }));
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  };
}
