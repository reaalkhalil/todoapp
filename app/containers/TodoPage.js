import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import TodoList from '../components/TodoList';
import * as TodoActions from '../actions/todos';
import * as SettingsActions from '../actions/settings';

import { initialTodos } from '../store/initial';

const mapStateToProps = state => ({
  settings: state.settings,
  todos: state.todos.present,
  newlyCreatedId: state.newlyCreatedId,
  canUndo: state.todos.past.length > 0,
  canRedo: state.todos.future.length > 0
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { ...TodoActions, ...UndoActionCreators, ...SettingsActions },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
