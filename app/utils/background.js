import { app, remote } from 'electron';

const https = require('https');
const fs = require('fs');
const async = require('async');
const p = require('path');

const ids = [
  104,
  106,
  112,
  121,
  118,
  127,
  128,
  129,
  134,
  136,
  139,
  140,
  142,
  146,
  151,
  152,
  153,
  154,
  155,
  162,
  164,
  165,
  166,
  167,
  170,
  173,
  177,
  179,
  184,
  185,
  186,
  188,
  190,
  200,
  217,
  235,
  236,
  253
];

export function getBackgrounds() {
  const path = p.join((app || remote.app).getPath('userData'), 'backgrounds');
  if (!fs.existsSync(path)) fs.mkdirSync(path);
  else if (!fs.statSync(path).isDirectory()) {
    fs.unlinkSync(path);
    fs.mkdirSync(path);
  }

  if (fs.readdirSync(path).length !== ids.length)
    async.eachOfSeries(
      ids,
      async (id, i) =>
        await new Promise((res, rej) => {
          try {
            const file = fs.createWriteStream(`${path}/${i}.jpg`);
            https.get(`https://picsum.photos/id/${id}/2000/2000`, resp => {
              resp.pipe(file);
              file.on('close', () => {
                res();
              });
            });
          } catch (ex) {
            rej(ex);
          }
        })
    );
}

export function getBackgroundPath() {
  const path = p.join(remote.app.getPath('userData'), 'backgrounds');

  if (!fs.existsSync(path)) getBackgrounds();

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const id = Math.floor(diff / oneDay) % ids.length;

  return `file://${p.join(path, `${id}.jpg`).replace(' ', '%20')}`;
}
