export default function cmdOrCtrl() {
  return process.platform === 'darwin' ? 'cmd' : 'ctrl';
}
