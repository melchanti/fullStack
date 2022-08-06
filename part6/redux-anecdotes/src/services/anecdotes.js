import axios from "axios";

const baseURL = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const response = await axios.get(baseURL)
  return response.data;
}

const createNew = async (content) => {
  const object = { content, votes: 0 };
  const response = await axios.post(baseURL, object);

  return response.data;
}

const vote = async (votedAnecdote) => {
  const response = await axios.put(`${baseURL}/${votedAnecdote.id}`, votedAnecdote);
  console.log(response);
  return response.data;
}
const anecdoteService = {
  getAll,
  createNew,
  vote
}

export default anecdoteService;