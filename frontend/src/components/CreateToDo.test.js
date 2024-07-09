// src/components/CreateToDo.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

  test('renders CreateToDo component with the title', async () => {
    render(<CreateToDo />);
    
    await waitFor(() => {
      expect(screen.getByText(/Todo List/)).toBeInTheDocument();
    });
  });

});
