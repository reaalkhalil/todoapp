import * as Mousetrap from 'mousetrap';

class KB {
  bind(handlers) {
    Mousetrap.reset();

    for (let k of Object.keys(handlers))
      if (typeof k === 'string' && typeof handlers[k] === 'function')
        Mousetrap.bind(k, handlers[k]);
  }

  reset() {
    Mousetrap.reset();
  }
}

const KeyBoard = new KB();

export default KeyBoard;
