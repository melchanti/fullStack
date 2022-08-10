import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdotesAtStart = [
];

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    vote(state, action) {
      const currentAnecdote = state.find(anecdote => anecdote.id === action.payload);
      const updateAnecdote = {...currentAnecdote, votes: currentAnecdote.votes + 1};
      return state.map(anecdote => anecdote === currentAnecdote ? updateAnecdote : anecdote);
    },
    appendAnecdote(state, action) {
      const newAnecdote = asObject(action.payload);
      return [...state, newAnecdote];
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
    updateAnecdote(state, action) {
      return state.map( anecdote => {
        return anecdote.id === action.payload.id
          ? action.payload
          : anecdote
      });
    }
  }

});


export const {updateAnecdote, setAnecdotes, appendAnecdote} = anecdoteSlice.actions;

export const getAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const createdAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(createdAnecdote.content));
  }
}

export const addVote = (id) => {
  return async ( dispatch, getState ) => {
    const votedAnecdote = getState().anecdotes.find(anecdote => {
      return anecdote.id === id;
    });
    const returnedAnecdote = await anecdoteService.vote({...votedAnecdote, votes: votedAnecdote.votes + 1});
    dispatch(updateAnecdote(returnedAnecdote));
  }
}

export default anecdoteSlice.reducer;
