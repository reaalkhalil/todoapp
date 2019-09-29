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
    //  if (
    //    this.props.settings &&
    //    this.props.settings.splits &&
    //    this.props.settings.splits.length > 0
    //  ) {
    //    splits = this.props.settings.splits;
    //  }

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
