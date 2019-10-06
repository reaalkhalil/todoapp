import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Settings from '../components/Settings';
import * as SettingsActions from '../actions/settings';
import * as TodoActions from '../actions/todos';

function mapStateToProps(state) {
  return {
    settings: state.settings,
    integrations: state.integrations,
    userId: state.userId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...SettingsActions, ...TodoActions }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
