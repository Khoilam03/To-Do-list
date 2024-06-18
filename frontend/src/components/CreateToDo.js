import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";

export default class CreateToDo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",      // Title of the todo item
      completed: false,  // Completion status
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCompletedChange = this.handleCompletedChange.bind(this);
    this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
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
      .then((data) => console.log(data));
  }

  render() {
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
              value={this.state.title}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <label>
              Completed:
              <input
                type="checkbox"
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
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }
}
