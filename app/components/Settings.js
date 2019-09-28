import React, { useRef, useEffect, useState } from 'react';
import styles from './Settings.css';
import KeyBoard from '../keyboard';
import { connect } from 'react-redux';
import * as filter from '../filter';
import { SettingsSchema } from '../store/Store';

import { Validator } from 'jsonschema';

function Settings({ save, onCancel, helpOpen, defaultValue }) {
  const settingsRef = useRef();

  const validator = new Validator();

  const [validSettings, setValidSettings] = useState(defaultValue || {});
  const [error, setError] = useState(false);

  KeyBoard.bind({
    esc: onCancel,
    'command+,|ctrl+,': onCancel,
    'command+s|ctrl+s': () => {
      if (error || !validSettings) {
        console.error('ERROR saving');
      } else {
        console.info('saving');

        save({ settings: validSettings });
        settingsRef.current.value = JSON.stringify(validSettings, '\n', '\t');
      }
    }
  });

  const updateSettings = q => {
    try {
      const res = new Function(`
       const a = JSON.stringify(${q})
       if (JSON.stringify(JSON.parse(a).constructor()) === '{}') return JSON.parse(a)
       return null
      `)();

      const v = validator.validate(res, SettingsSchema);
      const errors =
        v.errors && v.errors.length > 0
          ? v.errors.map(e => `${e.instance} ${e.message}`)
          : null;

      if (errors && errors.length > 0) {
        setError(errors[0]);
      } else {
        setError(null);

        setValidSettings(res);
      }
    } catch (e) {
      setError('Not valid JSON');
    }
  };

  const classes = ['mousetrap', styles.Settings];
  if (helpOpen) classes.push(styles['Settings--help-open']);

  return (
    <div className={classes.join(' ')}>
      <div className={styles.Header}>
        <span className={styles.Title}>Preferences</span>
        {error ? (
          <div className={styles.Settings__Error}>
            <span className={styles.Settings__ErrorMessage}>{error}</span>
            <i className="fas fa-times-circle"></i>
          </div>
        ) : validSettings ? (
          <div className={styles.Settings__Success}>
            <i className="fas fa-check-circle"></i>
          </div>
        ) : null}
      </div>

      <textarea
        autoFocus={true}
        defaultValue={
          defaultValue ? JSON.stringify(defaultValue, '\n', '\t') : '{\n\t\n}'
        }
        ref={settingsRef}
        className={['mousetrap', styles.Settings__TextArea].join(' ')}
        type="text"
        onChange={() => updateSettings(settingsRef.current.value)}
        onKeyDown={e => {
          const self = settingsRef.current;

          if (e.keyCode === 13) {
            if (self.selectionStart == self.selectionEnd) {
              var sel = self.selectionStart;
              var text = self.value;
              while (sel > 0 && text[sel - 1] != '\n') sel--;

              var lineStart = sel;
              while (text[sel] == ' ' || text[sel] == '\t') sel++;

              if (sel > lineStart) {
                document.execCommand(
                  'insertText',
                  false,
                  '\n' + text.substr(lineStart, sel - lineStart)
                );

                self.blur();
                self.focus();
                e.preventDefault();
              }
            }
          }

          if (e.keyCode === 9) {
            e.preventDefault();

            if (self.selectionStart == self.selectionEnd) {
              if (!e.shiftKey) {
                document.execCommand('insertText', false, '\t');
              } else {
                var text = self.value;
                if (
                  self.selectionStart > 0 &&
                  text[self.selectionStart - 1] == '\t'
                ) {
                  document.execCommand('delete');
                }
              }
            } else {
              var selStart = self.selectionStart;
              var selEnd = self.selectionEnd;
              var text = self.value;
              while (selStart > 0 && text[selStart - 1] != '\n') selStart--;
              while (
                selEnd > 0 &&
                text[selEnd - 1] != '\n' &&
                selEnd < text.length
              )
                selEnd++;

              var lines = text.substr(selStart, selEnd - selStart).split('\n');

              for (var i = 0; i < lines.length; i++) {
                if (i == lines.length - 1 && lines[i].length == 0) continue;

                if (e.shiftKey) {
                  if (lines[i].startsWith('\t')) lines[i] = lines[i].substr(1);
                  else if (lines[i].startsWith('    '))
                    lines[i] = lines[i].substr(4);
                } else lines[i] = '\t' + lines[i];
              }
              lines = lines.join('\n');

              self.value =
                text.substr(0, selStart) + lines + text.substr(selEnd);
              self.selectionStart = selStart;
              self.selectionEnd = selStart + lines.length;
            }
          }
        }}
      />
    </div>
  );
}

export default connect(state => ({
  errors: state.errors
}))(Settings);
