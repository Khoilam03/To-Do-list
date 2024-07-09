// src/components/CreateToDo.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateToDo from './CreateToDo';

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('CreateToDo Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders CreateToDo component with the title', () => {
    render(<CreateToDo />);
    expect(screen.getByText(/create todo item/i)).toBeInTheDocument();
  });

  test('allows user to create a new todo item', async () => {
    render(<CreateToDo />);

    // Mock the POST request
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, title: 'Test Todo', completed: false }),
      })
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Todo Title'), { target: { value: 'Test Todo' } });
    fireEvent.click(screen.getByText(/create todo item/i));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  test('toggles todo completion status', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, title: 'Test Todo', completed: false }]),
      })
    );

    render(<CreateToDo />);

    // Ensure initial fetch runs and renders the todo item
    await waitFor(() => expect(screen.getByText('Test Todo')).toBeInTheDocument());

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, title: 'Test Todo', completed: true }),
      })
    );

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Test Todo')).toHaveStyle('text-decoration: line-through');
  });

  test('deletes a todo item', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, title: 'Test Todo', completed: false }]),
      })
    );

    render(<CreateToDo />);

    // Ensure initial fetch runs and renders the todo item
    await waitFor(() => expect(screen.getByText('Test Todo')).toBeInTheDocument());

    fetch.mockImplementationOnce(() => Promise.resolve({ ok: true }));

    fireEvent.click(screen.getByText('X'));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
  });
});
