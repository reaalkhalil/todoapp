// @flow
import React, { Component, useState } from 'react';
import Help from '../components/Help';
import Settings from '../components/Settings';
import TodoPage from './TodoPage';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.state = { helpOpen: false, settingsOpen: false };
  }
  render() {
    return (
      <>
        {this.state.settingsOpen ? (
          <Settings
            helpOpen={this.state.helpOpen}
            onCancel={() => this.setState({ settingsOpen: false })}
            onUpdate={() => this.setState({ settingsOpen: false })}
          />
        ) : (
          <TodoPage
            helpOpen={this.state.helpOpen}
            onHelp={h => this.setState({ helpOpen: h })}
            onSettings={s => this.setState({ settingsOpen: s })}
            splits={[
              {
                position: 2,
                title: 'Done',
                filters: [{ field: 'done', op: 'EQUAL', value: true }]
              },
              {
                position: 1,
                title: 'Reading List',
                filters: [{ field: 'tags', op: 'CONTAINS', value: 'reading' }]
              },
              {
                position: 0,
                title: 'Todo',
                filters: [{ field: 'done', op: 'EQUAL', value: false }]
              }
            ]}
          />
        )}
        <Help show={this.state.helpOpen} />
      </>
    );
  }
}
