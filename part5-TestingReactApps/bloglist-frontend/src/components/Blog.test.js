import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Houston',
    url: 'https://fullstackopen.com/en/part5/testing_react_apps#tests-for-the-togglable-component',
    likes: 3,
    user: '3424131sfsfdsfdsgfgsffsfd'
  };

  render(<Blog blog={blog} />);

  const title = screen.queryByText('Component testing is done with react-testing-library');
  const author = screen.queryByText('Houston');
  const url = screen.queryByText(blog.url);
  const likes = screen.queryByText(3);
  expect(title).not.toBeNull();
  expect(author).not.toBeNull();
  expect(url).toBeNull();
  expect(likes).toBeNull();
});


test('clicking show shows the likes and url', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Houston',
    url: 'https://fullstackopen.com/en/part5/testing_react_apps#tests-for-the-togglable-component',
    likes: 3,
    user: '3424131sfsfdsfdsgfgsffsfd'
  };

  render(<Blog blog={blog} />)
  const showButton = screen.getByText('view');

  const user = userEvent.setup();
  await user.click(showButton);
 
  const title = screen.queryByText('Component testing is done with react-testing-library');
  const author = screen.queryByText('Houston');
  const url = screen.getByText(blog.url, {exact: false});
  const likes = screen.getByText('likes', {exact: false});
  expect(title).not.toBeNull();
  expect(author).not.toBeNull();
  expect(url).not.toBeNull();
  expect(likes).not.toBeNull();
});

test('clicking the like button twice, calls the event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Houston',
    url: 'https://fullstackopen.com/en/part5/testing_react_apps#tests-for-the-togglable-component',
    likes: 3,
    user: '3424131sfsfdsfdsgfgsffsfd'
  };
  const mockHandler = jest.fn();

  render(<Blog blog={blog} handleLike={mockHandler}/>)
  const showButton = screen.getByText('view');

  const user = userEvent.setup();
  await user.click(showButton);


  const likeButton = screen.getByText('like');

  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});