import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './blogForm';

test('clicking the create button, calls the function with the right details', async () => {
  const mockHandler = jest.fn();

  render(<BlogForm newBlog={mockHandler}/>);
  const user = userEvent.setup();

  const title = screen.getByPlaceholderText('title');
  const author = screen.getByPlaceholderText('author');
  const url = screen.getByPlaceholderText('url');
  const createButton = screen.getByText('create');

  await user.type(title, 'testing a form...');
  await user.type(author, 'tester');
  await user.type(url, 'https://testing.com');
  await user.click(createButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0]).toBe('testing a form...');
  expect(mockHandler.mock.calls[0][1]).toBe('tester');
  expect(mockHandler.mock.calls[0][2]).toBe('https://testing.com');
});