// @flow
import React, { Component, useState } from 'react';
import Help from '../components/Help';
import TodoPage from './TodoPage';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.state = { helpOpen: false };
  }
  render() {
    return (
      <>
        <TodoPage
          onHelp={h => {
            this.setState({ helpOpen: h });
            console.log('on help ', h);
          }}
          splits={[
            {
              title: 'Todo',
              filters: [
                { field: 'done', op: 'EQUAL', value: false },
                { field: 'tags', op: 'NOT_CONTAINS', value: 'reading' }
              ]
            },
            {
              title: 'Reading List',
              filters: [
                { field: 'done', op: 'EQUAL', value: false },
                { field: 'tags', op: 'CONTAINS', value: 'reading' }
              ]
            },
            {
              title: 'Done',
              filters: [{ field: 'done', op: 'EQUAL', value: true }]
            }
          ]}
        />
        <Help show={this.state.helpOpen} />
      </>
    );
  }
}
