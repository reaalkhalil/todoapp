import Store from './store/Store';

const ua = require('universal-analytics');
const isDev = require('electron-is-dev');

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
  if (isDev) {
    console.log('TRACK EVENT', {
      category,
      action,
      label,
      value
    });
    return;
  }
  usr
    .event({
      ec: category,
      ea: action,
      el: label,
      ev: value
    })
    .send();
}

window.onerror = function(msg, src, line, col, err) {
  const error = `${err.message}: ${err.stack}`;
  if (!isDev) usr.exception({ exDescription: error, exFatal: false }).send();
  return false;
};

window.onunhandledrejection = function(e) {
  const error = `${e.reason.message}: ${e.reason.stack}`;
  if (!isDev) usr.exception({ exDescription: error, exFatal: false }).send();
  return false;
};

// TODO: use this
export function pageView(page) {
  if (isDev) {
    console.log('TRACK PAGEVIEW', page);
    return;
  }

  usr.pageview(page).send();
}
