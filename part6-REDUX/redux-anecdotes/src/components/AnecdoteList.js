import { useDispatch, useSelector } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import { setNotification, removeNotification } from "../reducers/notificationReducer";


const AnecdoteList = () => {
  const dispatch = useDispatch();
  const filter = useSelector(state => state.filter);
  const anecdotes = useSelector(state => state.anecdotes)
                      .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
                      .sort((a, b) => b.votes - a.votes);

  const voteClick = (id) => {
    const votedAnecdote = anecdotes.filter(anecdote => anecdote.id === id);
    dispatch(addVote(id));
    dispatch(setNotification(`You voted "${votedAnecdote[0].content}"`, 4));
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