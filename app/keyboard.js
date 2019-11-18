import * as Mousetrap from 'mousetrap';

class KB {
  constructor() {
    this._activated = false;
  }

  activate() {
    this._activated = true;
  }

  bind(handlers) {
    Mousetrap.reset();

    for (let k of Object.keys(handlers))
      if (typeof k === 'string' && typeof handlers[k] === 'function') {
        const h = e => this._activated && handlers[k](e);
        const split = k.split('__');

        if (split.length > 1) Mousetrap.bind(split, h);
        else Mousetrap.bind(k, h);
      }
  }

  reset() {
    Mousetrap.reset();
  }
}

const KeyBoard = new KB();

export default KeyBoard;
