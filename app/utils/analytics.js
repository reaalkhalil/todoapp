const ua = require('universal-analytics');
const isDev = require('electron-is-dev');

const code = 'UA-148911079-1';

export const Categories = {
  USER_INTERACTION: 'User Interaction'
};

export const Actions = {
  TODO_CREATE: 'Todo: Create',
  TODO_EDIT: 'Todo: Edit',
  TODO_DELETE: 'Todo: Delete',
  TODO_DOWNLOAD: 'Todo: Download'
};

class Analytics {
  constructor() {
    this._usr = null;
  }

  init(id) {
    this._usr = ua(code, id);
  }

  event(category, action, label, value) {
    if (isDev) {
      console.log('TRACK EVENT', {
        category,
        action,
        label,
        value
      });
      return;
    }
    if (this._usr)
      this._usr
        .event({
          ec: category,
          ea: action,
          el: label,
          ev: value
        })
        .send();
  }

  pageView(page) {
    if (isDev) {
      console.log('TRACK PAGEVIEW', page);
      return;
    }

    if (this._usr) this._usr.pageview(page).send();
  }

  exception(error, fatal) {
    if (!isDev && this._usr)
      this._usr.exception({ exDescription: error, exFatal: false }).send();
  }
}

export const analytics = new Analytics();

window.onerror = function(msg, src, line, col, err) {
  const error = `${err.message}: ${err.stack}`;
  if (!isDev) analytics(error, false);
  return false;
};

window.onunhandledrejection = function(e) {
  const error = `${e.reason.message}: ${e.reason.stack}`;
  if (!isDev) analytics(error, false);
  return false;
};
