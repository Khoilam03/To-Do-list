import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
export default class CreateToDo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "", // Title of the todo item
      completed: false, // Completion status
      todos: [], // Array to hold todo items
      isLoading: true, // Loading state indicator
      error: null, // Error state for handling fetch errors
      editId: null, // ID of the todo item being edited
      editTitle: "", // Title of the todo item being edited
      editCompleted: false, // Completion status of the todo item being edited
      showDeleteButtons: false, // State to control the visibility of delete buttons
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCompletedChange = this.handleCompletedChange.bind(this);
    this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
    this.handleDeleteButtonPressed = this.handleDeleteButtonPressed.bind(this);
    this.handleEditButtonPressed = this.handleEditButtonPressed.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    this.handleEditTitleChange = this.handleEditTitleChange.bind(this);
    this.handleEditCompletedChange = this.handleEditCompletedChange.bind(this);
    this.deleteButtons = this.deleteButtons.bind(this);
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

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleCompletedChange(e) {
    this.setState({ completed: e.target.checked });
  }

  handleCreateButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.state.title,
        completed: this.state.completed,
      }),
    };
    fetch("/api/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState(prevState => ({
          todos: [...prevState.todos, data],
          title: "",
          completed: false,
        }));
        this.setState({ title: "", completed: false });
      });

  }

  handleDeleteButtonPressed(id) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    };

    fetch("/api/", requestOptions)
      .then((response) => {
        if (response.ok) {
          this.setState(prevState => ({
            todos: prevState.todos.filter(todo => todo.id !== id)
          }));
        } else {
          // Handle errors, maybe the item wasn't deleted on the server
          throw new Error('Failed to delete the item.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete the todo item');
      });
  }


  handleEditButtonPressed(todo) {
    this.setState({
      editId: todo.id,
      editTitle: todo.title,
      editCompleted: todo.completed,
    });
  }

  handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: this.state.editId,
        title: this.state.editTitle,
        completed: this.state.editCompleted,
      }),
    };
    fetch("/api/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({editId: null, editTitle: "", editCompleted: false})
      });
      this.fetchTodos()
  }

  handleEditTitleChange(e) {
    this.setState({ editTitle: e.target.value });
  }

  handleEditCompletedChange(e) {
    this.setState({ editCompleted: e.target.checked });
  }

  deleteButtons() {
    this.setState((prevState) => ({
      showDeleteButtons: !prevState.showDeleteButtons,
    }))
  }
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleCreateButtonPressed(); // Corrected to call the function
    }
  };
  render() {
    const { todos, isLoading, error, editId, editTitle, editCompleted, showDeleteButtons } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }
    const completedStyle = {
      backgroundColor: 'lightgreen', // Set the background color for completed items
    };
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Create Todo Item
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              placeholder="Enter Todo Title"
              onChange={this.handleTitleChange}
              onKeyPress={this.handleKeyPress}
              value={this.state.title}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <label>
              Completed:
              <Checkbox
                checked={this.state.completed}
                onChange={this.handleCompletedChange}
              />
            </label>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleCreateButtonPressed}
          >
            Create Todo Item
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" href="/" size="large">
            Back
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="default"
            variant="contained"
            onClick={this.deleteButtons}
          >
            Delete
          </Button>
        </Grid>
        <Grid item xs={9}>        <h1>Todo List</h1> </Grid>
        <Grid class="scrollable-list">
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} style={{
                marginRight: '10px',
                padding: '10px',
                ...(todo.completed ? completedStyle : {})
              }}>
                {editId === todo.id ? (
                  <div>
                    <TextField
                      value={editTitle}
                      onChange={this.handleEditTitleChange}
                    />
                    <Checkbox
                      checked={editCompleted}
                      onChange={this.handleEditCompletedChange}
                    />
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={this.handleUpdateButtonPressed}
                    >
                      Update
                    </Button>
                  </div>
                ) : (
                  <span style={{ marginRight: '10px' }}>
                    {todo.title} - {todo.completed ? 'Completed' : 'Not Completed'}
                  </span>
                )}
                {showDeleteButtons && (
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => this.handleDeleteButtonPressed(todo.id)}
                    size="small"
                  >
                    Delete
                  </Button>
                )}
                <Button
                  color="default"
                  variant="contained"
                  onClick={() => this.handleEditButtonPressed(todo)}
                  size="small"
                >
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>
    );
  }
}
