// @flow
import type { GetState, Dispatch } from '../reducers/types';
import { insertSplit } from '../utils/settings';

export const SAVE_SETTINGS = 'SAVE_SETTINGS';
export const ADD_INTEGRATIONS = 'ADD_INTEGRATIONS';
export const ADD_SPLIT = 'ADD_SPLIT';
export const EDIT_SPLIT = 'EDIT_SPLIT';
export const REMOVE_SPLIT = 'REMOVE_SPLIT';

function addSplitAction(data) {
  return {
    type: ADD_SPLIT,
    data
  };
}

function editSplitAction(data) {
  return {
    type: EDIT_SPLIT,
    data
  };
}

function removeSplitAction(data) {
  return {
    type: REMOVE_SPLIT,
    data
  };
}

export function removeSplit(data) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { settings } = getState();
    let splits = [];
    if (settings && settings.splits && settings.splits.length > 0)
      splits.push(...settings.splits);

    data.splits = splits.filter((s, i) => i !== data.index);
    dispatch(removeSplitAction(data));
  };
}

export function addSplit(data) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { settings } = getState();
    let splits = [];
    if (settings && settings.splits && settings.splits.length > 0)
      splits.push(...settings.splits);

    data.splits = insertSplit(splits, data.split, data.index);

    dispatch(addSplitAction(data));
  };
}

export function editSplit(data) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { settings } = getState();
    let splits = [];
    if (settings && settings.splits && settings.splits.length > 0)
      splits.push(...settings.splits);

    data.splits = insertSplit(splits, data.split, data.index, data.oldIndex);

    dispatch(editSplitAction(data));
  };
}

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

    fetch('https://todoapp.cc/server/get_user/' + userId)
      .then(r => {
        r.json()
          .then(d => {
            const ii = [];

            if (d && d.telegram && d.telegram.length > 0) {
              ii.push({ name: 'telegram', value: d.telegram });
            }

            if (d && d.email && d.email.length > 0) {
              ii.push({ name: 'email', value: d.email });
            }

            dispatch(addIntegrations({ integrations: ii }));
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  };
}
