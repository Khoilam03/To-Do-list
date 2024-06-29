import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Calendar from "./Calendar.js";

export default class CreateToDo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      completed: false,
      todos: [],
      isLoading: true,
      error: null,
      showDeleteButtons: false,
      taskSummary: {}
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCompletedChange = this.handleCompletedChange.bind(this);
    this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
    this.handleDeleteButtonPressed = this.handleDeleteButtonPressed.bind(this);
    this.handleToggleButtonPressed = this.handleToggleButtonPressed.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteButtons = this.deleteButtons.bind(this);
  }

  componentDidMount() {
    this.fetchTodos();
    this.fetchTaskSummaries();
  }

  fetchTodos() {
    fetch("/api/json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => this.setState({ todos: data, isLoading: false }))
      .catch((error) => this.setState({ error, isLoading: false }));
  }

  fetchTaskSummaries() {
    fetch("/calendar/tasks/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        const taskSummary = {};
        data.forEach(summary => {
          taskSummary[summary.date] = {
            completed: summary.completed,
            not_completed: summary.not_completed
          };
        });
        this.setState({ taskSummary });
      })
      .catch((error) => {
        console.error("Error fetching task summaries:", error);
      });
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
        this.setState((prevState) => ({
          todos: [...prevState.todos, data],
          title: "",
          completed: false,
        }));
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
          this.setState((prevState) => ({
            todos: prevState.todos.filter((todo) => todo.id !== id),
          }));
        } else {
          throw new Error("Failed to delete the item.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to delete the todo item");
      });
  }

  handleToggleButtonPressed(todo) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: todo.id,
        title: todo.title,
        completed: !todo.completed,
      }),
    };
    fetch("/api/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState((prevState) => ({
          todos: prevState.todos.map((t) =>
            t.id === data.id ? { ...t, completed: data.completed } : t
          ),
        }));
      });
  }

  handleSubmit() {
    const curr = new Date();
    curr.setHours(0, 0, 0, 0); // Set the time to midnight to avoid any time zone issues
    const today = curr.toISOString().split('T')[0];
    const completedTasks = this.state.todos.filter(todo => todo.completed).length;
    const notCompletedTasks = this.state.todos.length - completedTasks;

    const taskSummaryData = {
      date: today,
      completed: completedTasks,
      not_completed: notCompletedTasks
    };

    // First, check if data for today already exists
    fetch(`/calendar/tasks/${today}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (response.ok) {
        // If data exists, update it with PUT
        return fetch(`/calendar/tasks/${today}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(taskSummaryData)
        });
      } else if (response.status === 404) {
        // If data does not exist, create it with POST
        return fetch("/calendar/tasks/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(taskSummaryData)
        });
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      this.setState((prevState) => ({
        taskSummary: {
          ...prevState.taskSummary,
          [today]: {
            completed: data.completed,
            not_completed: data.not_completed,
          }
        }
      }));
      this.fetchTaskSummaries(); // Fetch updated task summaries
    })
    .catch(error => {
      console.error('Error submitting task summary:', error);
    });
  }

  deleteButtons() {
    this.setState((prevState) => ({
      showDeleteButtons: !prevState.showDeleteButtons,
    }));
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.handleCreateButtonPressed();
    }
  };

  render() {
    const { todos, isLoading, error, showDeleteButtons, taskSummary } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    const completedStyle = {
      backgroundColor: "lightgreen",
    };
    const nonCompletedStyle = {
      backgroundColor: "lightyellow",
    };

    return (
      <Grid container spacing={1}>
        <Grid item xs={5}></Grid>
        <Grid item xs={3} align="center">
          <Typography component="h4" variant="h4">
            Create Todo Item
          </Typography>
        </Grid>
        <Grid item xs={5}></Grid>
        <Grid item xs={3} align="center">
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
        <Grid item xs={5}></Grid>
        <Grid item xs={3} align="center">
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
        <Grid item xs={5}></Grid>
        <Grid item xs={3} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleCreateButtonPressed}
          >
            Create Todo Item
          </Button>
        </Grid>
        <Grid item xs={5}>        <h1>Todo List</h1> </Grid>
        <Grid item xs={1}>
          <Button color="secondary" variant="contained" href="/">
            Back
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button
            color="default"
            variant="contained"
            onClick={this.deleteButtons}
          >
            Delete
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleSubmit}
          >
            Submit
          </Button>
        </Grid>
        <Grid class="scrollable-list">
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} style={{
                marginRight: '10px',
                padding: '10px',
                ...(todo.completed ? completedStyle : nonCompletedStyle)
              }}>
                <span style={{ marginRight: '10px' }}>
                  {todo.title} - {todo.completed ? 'Completed' : 'Not Completed'}
                </span>
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
                  onClick={() => this.handleToggleButtonPressed(todo)}
                  size="small"
                >
                  Flip
                </Button>
              </li>
            ))}
          </ul>
        </Grid>
        <Calendar taskSummary={taskSummary} />
      </Grid>
    );
  }
}
