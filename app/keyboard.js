import * as Mousetrap from 'mousetrap';

class KB {
  bind(handlers) {
    Mousetrap.reset();

    for (let k of Object.keys(handlers))
      if (typeof k === 'string' && typeof handlers[k] === 'function') {
        const split = k.split('|');
        if (split.length > 1) {
          Mousetrap.bind(split, handlers[k]);
          continue;
        }

        Mousetrap.bind(k, handlers[k]);
      }
  }

  reset() {
    Mousetrap.reset();
  }
}

const KeyBoard = new KB();

export default KeyBoard;
