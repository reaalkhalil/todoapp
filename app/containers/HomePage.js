// @flow
import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Help from '../components/Help';
import SettingsPage from './SettingsPage';
import TodoPage from './TodoPage';
import * as TodoActions from '../actions/todos';

import pull from '../pull';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TodoActions, dispatch);
}

type Props = {};

class HomePage extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.state = { helpOpen: false, settingsOpen: false };
  }

  render() {
    pull.setUserId(this.props.userId);
    pull.setIntegrations(this.props.integrations);
    pull.setAddFunc(todo => {
      console.log(
        'ADD_TODO_FROM_PULL \n\n\n++++++++++++++================',
        todo
      );
      this.props.addTodo({ todo });
    });

    return (
      <>
        {this.state.settingsOpen ? (
          <SettingsPage
            defaultValue={{ ...this.props.settings }}
            helpOpen={this.state.helpOpen}
            onCancel={() => this.setState({ settingsOpen: false })}
          />
        ) : (
          <TodoPage
            helpOpen={this.state.helpOpen}
            onHelp={h => this.setState({ helpOpen: h })}
            onSettings={s => this.setState({ settingsOpen: s })}
            splits={this.props.settings.splits}
            pages={this.props.settings.pages}
          />
        )}
        <Help settings={this.props.settings} show={this.state.helpOpen} />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    integrations: state.integrations,
    userId: state.userId
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
