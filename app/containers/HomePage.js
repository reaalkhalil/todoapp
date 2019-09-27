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
        position: 3,
        filters: [
          {
            field: 'done',
            op: 'EQUAL',
            value: true
          }
        ],
        sort: ['done_at DESC'],
        default: {
          done: true
        }
      },
      {
        title: 'Reading List',
        shortcut: 'r',
        position: 2,
        filters: [
          {
            field: 'tags',
            op: 'CONTAINS',
            value: 'reading'
          }
        ],
        sort: ['priority DESC', 'due_at', 'created_at'],
        default: {
          tags: ['reading']
        }
      },
      {
        title: 'Today',
        shortcut: 'g',
        position: 0,
        filters: [
          {
            field: 'due_at',
            op: 'BEFORE_EOD'
          }
        ],
        sort: ['due_at', 'priority DESC', 'created_at'],
        default: {
          due_at: 0
        }
      },
      {
        title: 'Backlog',
        position: 1,
        filters: [],
        sort: ['priority DESC', 'due_at', 'created_at'],
        default: {}
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
