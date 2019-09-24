// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import TodoPage from './TodoPage';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <>
        <TodoPage
          splits={[
            {
              title: 'Todo',
              filters: [
                { field: 'done', op: 'EQUAL', value: false },
                { field: 'tags', op: 'NOT_CONTAINS', value: 'reading' }
              ]
            },
            {
              title: 'Done',
              filters: [{ field: 'done', op: 'EQUAL', value: true }]
            },
            {
              title: 'ReadingList',
              filters: [
                { field: 'done', op: 'EQUAL', value: false },
                { field: 'tags', op: 'CONTAINS', value: 'reading' }
              ]
            }
          ]}
        />
      </>
    );
  }
}
