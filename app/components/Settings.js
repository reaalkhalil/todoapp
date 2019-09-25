import React, { useRef, useEffect, useState } from 'react';
import styles from './Settings.css';
import KeyBoard from '../keyboard';

import * as filter from '../filter';

export default function Settings({ onCancel, onSave, helpOpen, defaultValue }) {
  const settingsRef = useRef();

  //   const [settings, setSettings] = useState({});

  KeyBoard.bind({
    esc: onCancel,
    'command+,': onCancel,
    'command+s': onSave
  });

  const updateSettings = q => {
    try {
      const res = new Function(`
       const a = JSON.stringify(${q})
       if (JSON.stringify(JSON.parse(a).constructor()) === '{}') return a
       return null
      `)();

      console.log('res', res);
    } catch (e) {
      console.log('err');
    }
  };

  const classes = ['mousetrap', styles.Settings];
  if (helpOpen) classes.push(styles['Settings--help-open']);

  return (
    <div className={classes.join(' ')}>
      <div className={styles.Header}>
        <span>Preferences</span>
      </div>
      <textarea
        autoFocus={true}
        defaultValue={defaultValue || '{\n\t\n}'}
        ref={settingsRef}
        className={['mousetrap', styles.Settings__TextArea].join(' ')}
        type="text"
        onChange={() => updateSettings(settingsRef.current.value)}
        onKeyDown={e => {
          // Escape key toggles tab on/off

          const self = settingsRef.current;

          // Enter Key?
          if (e.keyCode === 13) {
            // selection?
            if (self.selectionStart == self.selectionEnd) {
              // find start of the current line
              var sel = self.selectionStart;
              var text = self.value;
              while (sel > 0 && text[sel - 1] != '\n') sel--;

              var lineStart = sel;
              while (text[sel] == ' ' || text[sel] == '\t') sel++;

              if (sel > lineStart) {
                // Insert carriage return and indented text
                document.execCommand(
                  'insertText',
                  false,
                  '\n' + text.substr(lineStart, sel - lineStart)
                );

                // Scroll caret visible
                self.blur();
                self.focus();
                e.preventDefault();
              }
            }
          }

          // Tab key?
          if (e.keyCode === 9) {
            e.preventDefault();

            // selection?
            if (self.selectionStart == self.selectionEnd) {
              // These single character operations are undoable
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
              // Block indent/unindent trashes undo stack.
              // Select whole lines
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

              // Get selected text
              var lines = text.substr(selStart, selEnd - selStart).split('\n');

              // Insert tabs
              for (var i = 0; i < lines.length; i++) {
                // Don't indent last line if cursor at start of line
                if (i == lines.length - 1 && lines[i].length == 0) continue;

                // Tab or Shift+Tab?
                if (e.shiftKey) {
                  if (lines[i].startsWith('\t')) lines[i] = lines[i].substr(1);
                  else if (lines[i].startsWith('    '))
                    lines[i] = lines[i].substr(4);
                } else lines[i] = '\t' + lines[i];
              }
              lines = lines.join('\n');

              // Update the text area
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
/*
function keydown(e) =>{
  // Escape key toggles tab on/off

  // Enter Key?
  if (e.keyCode === 13) {
    // selection?
    if (this.selectionStart == this.selectionEnd) {
      // find start of the current line
      var sel = this.selectionStart;
      var text = this.value;
      while (sel > 0 && text[sel - 1] != '\n') sel--;

      var lineStart = sel;
      while (text[sel] == ' ' || text[sel] == '\t') sel++;

      if (sel > lineStart) {
        // Insert carriage return and indented text
        document.execCommand(
          'insertText',
          false,
          '\n' + text.substr(lineStart, sel - lineStart)
        );

        // Scroll caret visible
        this.blur();
        this.focus();
        return false;
      }
    }
  }

  // Tab key?
  if (e.keyCode === 9) {
    console.log('tab');
    // selection?
    if (this.selectionStart == this.selectionEnd) {
      // These single character operations are undoable
      if (!e.shiftKey) {
        document.execCommand('insertText', false, '\t');
      } else {
        var text = this.value;
        if (this.selectionStart > 0 && text[this.selectionStart - 1] == '\t') {
          document.execCommand('delete');
        }
      }
    } else {
      // Block indent/unindent trashes undo stack.
      // Select whole lines
      var selStart = this.selectionStart;
      var selEnd = this.selectionEnd;
      var text = this.value;
      while (selStart > 0 && text[selStart - 1] != '\n') selStart--;
      while (selEnd > 0 && text[selEnd - 1] != '\n' && selEnd < text.length)
        selEnd++;

      // Get selected text
      var lines = text.substr(selStart, selEnd - selStart).split('\n');

      // Insert tabs
      for (var i = 0; i < lines.length; i++) {
        // Don't indent last line if cursor at start of line
        if (i == lines.length - 1 && lines[i].length == 0) continue;

        // Tab or Shift+Tab?
        if (e.shiftKey) {
          if (lines[i].startsWith('\t')) lines[i] = lines[i].substr(1);
          else if (lines[i].startsWith('    ')) lines[i] = lines[i].substr(4);
        } else lines[i] = '\t' + lines[i];
      }
      lines = lines.join('\n');

      // Update the text area
      this.value = text.substr(0, selStart) + lines + text.substr(selEnd);
      this.selectionStart = selStart;
      this.selectionEnd = selStart + lines.length;
    }

    return false;
  }

  return true;
}
*/
