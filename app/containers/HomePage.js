// @flow
import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Help from '../components/Help';
import LastAction from '../components/LastAction';
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
      console.log('ADD_TODO_FROM_PULL', todo);
      // TODO: shouldn't be undo-able
      this.props.addTodo({ todo });
    });
    pull.setLastActionFunc(n =>
      this.props.setLastAction(`Downloaded ${n} Todo` + (n > 1 ? 's' : ''))
    );

    return (
      <>
        {this.state.settingsOpen ? (
          <SettingsPage
            onToggleHelp={() =>
              this.setState({ helpOpen: !this.state.helpOpen })
            }
            defaultValue={{ ...this.props.settings }}
            onCancel={() => this.setState({ settingsOpen: false })}
          />
        ) : (
          <TodoPage
            onToggleHelp={() =>
              this.setState({ helpOpen: !this.state.helpOpen })
            }
            onSettings={s => this.setState({ settingsOpen: s })}
            splits={this.props.settings.splits}
            pages={this.props.settings.pages}
          />
        )}
        <Help settings={this.props.settings} show={this.state.helpOpen} />
        <LastAction lastAction={this.props.lastAction} />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    integrations: state.integrations,
    userId: state.userId,
    lastAction: state.lastAction
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
