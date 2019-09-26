// @flow
import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import Help from '../components/Help';
import SettingsPage from './SettingsPage';
import TodoPage from './TodoPage';

type Props = {};

class HomePage extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.state = { helpOpen: false, settingsOpen: false };
  }

  render() {
    let splits = [
      {
        title: 'Done',
        shortcut: 'd',
        position: 2,
        filters: [{ field: 'done', op: 'EQUAL', value: true }],
        sort: ['done_at']
      },
      {
        title: 'Reading List',
        shortcut: 'r',
        position: 1,
        filters: [{ field: 'tags', op: 'CONTAINS', value: 'reading' }],
        sort: ['priority', 'created_at']
      },
      {
        title: 'Todo',
        shortcut: 't',
        position: 0,
        filters: [],
        sort: ['priority', 'created_at']
      }
    ];

    if (
      this.props.settings &&
      this.props.settings.splits &&
      this.props.settings.splits.length > 0
    ) {
      console.log('USING CUSTOM SPLITS');
      splits = this.props.settings.splits;
    }
    console.log('this.props.settings', this.props.settings);

    return (
      <>
        {this.state.settingsOpen ? (
          <SettingsPage
            defaultValue={{ ...this.props.settings, splits: splits }}
            helpOpen={this.state.helpOpen}
            onCancel={() => this.setState({ settingsOpen: false })}
            onSave={d => console.log(d)}
          />
        ) : (
          <TodoPage
            helpOpen={this.state.helpOpen}
            onHelp={h => this.setState({ helpOpen: h })}
            onSettings={s => this.setState({ settingsOpen: s })}
            splits={splits}
          />
        )}
        <Help show={this.state.helpOpen} />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings
  };
}

export default connect(mapStateToProps)(HomePage);
