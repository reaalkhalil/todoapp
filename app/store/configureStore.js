// @flow
import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';

const selectedConfigureStore =
  process.env.NODE_ENV === 'production'
    ? configureStoreProd
    : configureStoreProd;

export const { configureStore } = selectedConfigureStore;

export const { history } = selectedConfigureStore;
