/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  dialog,
  globalShortcut,
  shell
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

import { getBackgrounds } from './utils/background';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'reaalkhalil',
      repo: 'todo',
      vPrefixedTagName: false
    });

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: 'info',
        buttons: ['Restart Now', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
          'A new version of TodoApp has been downloaded. Restart the application to apply the updates.'
      };

      dialog.showMessageBox(dialogOpts, response => {
        if (response === 0) autoUpdater.quitAndInstall();
      });
    });

    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 900,
    height: 600,
    minHeight: 500,
    minWidth: 500,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.webContents.on(
    'console-message',
    (event, level, message, line, sourceId) => {
      console.log(
        ['LOG', 'WAR', 'ERR'][level] + `\t[${message} ${sourceId}] (${line})`
      );
    }
  );

  mainWindow.on('close', event => {
    if (app.quitting) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // TODO: not sure if any of:
  //     globalShortcut.register   new MenuBuilder   createUpdater
  //  should be done again on ready

  const ret = globalShortcut.register('Control+Space', () => {
    if (process.env.NODE_ENV === 'development') return;

    mainWindow.webContents.send('createTodo');
    mainWindow.show();
    mainWindow.focus();
  });

  if (!ret) {
    console.log('registration failed');
  }

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  let updateRetry = 0;
  function createUpdater() {
    try {
      new AppUpdater();
    } catch (ex) {
      console.log(ex);
      if (updateRetry++ > 100) return;
      setTimeout(createUpdater, Math.pow(2, updateRetry) * 10000);
    }
  }

  let backgroundRetry = 0;
  function downloadBackgrounds() {
    try {
      getBackgrounds();
    } catch (ex) {
      console.log(ex);
      if (backgroundRetry++ > 100) return;
      setTimeout(downloadBackgrounds, Math.pow(2, backgroundRetry) * 10000);
    }
  }

  setTimeout(() => downloadBackgrounds(), 0);
  setTimeout(() => createUpdater(), 0);
});

app.on('before-quit', () => {
  app.quitting = true;
});

app.on('activate', () => {
  mainWindow.show();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
