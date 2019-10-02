import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TodoList from '../components/TodoList';
import * as TodoActions from '../actions/todos';

import { initialTodos } from '../store/initial';

function mapStateToProps(state) {
  return {
    todos: state.todos,
    newlyCreatedId: state.newlyCreatedId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TodoActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
