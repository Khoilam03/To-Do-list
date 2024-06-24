import React, { Component } from "react";


export default class GettingToDo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],       // Array to hold todo items
      isLoading: true, // Loading state indicator
      error: null      // Error state for handling fetch errors
    };
  }

  componentDidMount() {
    this.fetchTodos();
  }
  fetchTodos() {
    fetch('/api/json')
      .then(response => {
        if (!response.ok) { // Check if response went through
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => this.setState({ todos: data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {
    const { todos, isLoading, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h1>Todo List</h1>
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              {todo.title} - {todo.completed ? 'Completed' : 'Pending'}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
