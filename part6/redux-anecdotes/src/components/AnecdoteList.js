import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";


const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(state => state).sort((a, b) => b.votes - a.votes);

  const voteClick = (id) => {
    dispatch(vote(id));
  }
  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteClick(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
    
  )
}

export default AnecdoteList;