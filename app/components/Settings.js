import React, { useRef, useEffect, useState } from 'react';
import styles from './Settings.css';
import KeyBoard from '../keyboard';
import { connect } from 'react-redux';
import * as filter from '../filter';
import { SettingsSchema } from '../store/Store';
import { initialSettings } from '../store/initial';

import { Validator } from 'jsonschema';

function Headers({ selected }) {
  return ['Integrations', 'Advanced'].map((a, i) => {
    const classes = [styles.Title];
    if (i === selected) classes.push(styles['Title--selected']);

    return (
      <span className={classes.join(' ')} key={i}>
        {a}
      </span>
    );
  });
}

function AdvancedSettings({
  save,
  onCancel,
  helpOpen,
  defaultValue,
  nextPage,
  prevPage
}) {
  const settingsRef = useRef();

  const validator = new Validator();

  const [validSettings, setValidSettings] = useState(defaultValue || {});
  const [error, setError] = useState(false);

  KeyBoard.bind({
    esc: onCancel,
    tab: nextPage,
    'shift+tab': prevPage,
    'command+,|ctrl+,': onCancel,
    'command+s|ctrl+s': () => {
      if (error || !validSettings) {
        if (settingsRef.current.value === '') {
          settingsRef.current.value = JSON.stringify(
            initialSettings,
            '\n',
            '\t'
          );

          save({ settings: initialSettings });
          setValidSettings(initialSettings);
          setError(null);
        }
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
        <Headers selected={1} />
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

function IntegrationSettings({
  onCancel,
  helpOpen,
  nextPage,
  prevPage,
  userId,
  integrations,
  verifyIntegrations
}) {
  KeyBoard.bind({
    esc: onCancel,
    tab: nextPage,
    'shift+tab': prevPage,
    'command+,|ctrl+,': onCancel
  });

  const classes = [styles.Settings];
  if (helpOpen) classes.push(styles['Settings--help-open']);

  const int = {
    telegram: '<not yet verified>',
    email: '<not yet verified>'
  };

  if (integrations) {
    integrations.forEach(i => {
      if (!i.name || !i.value) return;
      int[i.name] = i.value;
    });
  }

  return (
    <div className={classes.join(' ')}>
      <div className={styles.Header}>
        <Headers selected={0} />
      </div>
      <div className={styles.IntegrationSettings}>
        <div className={styles.Label}>Telegram:</div>
        <div className={styles.Value}>{int.telegram}</div>
        <div className={styles.Label}>Email:</div>
        <div className={styles.Value}>{int.email}</div>
        <div className={styles.Label}>ID:</div>
        <textarea
          readOnly
          className={[styles.Selectable, 'mousetrap'].join(' ')}
          value={userId ? `[${userId}]` : ''}
          onMouseDown={e => {
            e.target.setSelectionRange(0, e.target.value.length);
            e.target.focus();
            e.preventDefault();
            document.execCommand('copy');
          }}
          onKeyDown={e => {
            e.target.setSelectionRange(0, e.target.value.length);
            e.target.focus();
            e.preventDefault();
            document.execCommand('copy');
          }}
          onBlur={e => {
            window.getSelection().removeAllRanges();
            e.preventDefault();
          }}
        />
        <br />
        <a className={styles.Link} onClick={verifyIntegrations}>
          Verify Integrations
        </a>
      </div>
    </div>
  );
}

function Settings({
  save,
  onCancel,
  helpOpen,
  defaultValue,
  userId,
  integrations,
  verifyIntegrations
}) {
  const [currentPage, setCurrentPage] = useState(0);

  const changePage = () => {
    setCurrentPage((currentPage + 1) % 2);
  };

  return currentPage === 0 ? (
    <IntegrationSettings
      onCancel={onCancel}
      helpOpen={helpOpen}
      nextPage={changePage}
      prevPage={changePage}
      userId={userId}
      integrations={integrations}
      verifyIntegrations={verifyIntegrations}
    />
  ) : (
    <AdvancedSettings
      save={save}
      onCancel={onCancel}
      helpOpen={helpOpen}
      defaultValue={defaultValue}
      nextPage={changePage}
      prevPage={changePage}
    />
  );
}

export default connect(state => ({
  errors: state.errors
}))(Settings);
