const ua = require('universal-analytics');
import Store from './store/Store';

const code = 'UA-148911079-1';
const uid = new Store().getUserId();

export const Categories = {
  USER_INTERACTION: 'User Interaction'
};

export const Actions = {
  TODO_CREATE: 'Todo: Create',
  TODO_EDIT: 'Todo: Edit',
  TODO_DELETE: 'Todo: Delete'
};

const usr = ua(code, uid);

export function trackEvent(category, action, label, value) {
  console.log('TRACK EVENT', category, action);
  usr
    .event({
      ec: category,
      ea: action,
      el: label,
      ev: value
    })
    .send();
}
