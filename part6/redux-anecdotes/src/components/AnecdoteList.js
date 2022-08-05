import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { setNotification, removeNotification } from "../reducers/notificationReducer";


const AnecdoteList = () => {
  const dispatch = useDispatch();
  const filter = useSelector(state => state.filter);
  const anecdotes = useSelector(state => state.anecdotes)
                      .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
                      .sort((a, b) => b.votes - a.votes);

  const voteClick = (id) => {
    const votedAnecdote = anecdotes.filter(anecdote => anecdote.id === id);
    dispatch(vote(id));
    dispatch(setNotification(`You voted "${votedAnecdote[0].content}"`));
    setTimeout(() => {
      dispatch(removeNotification(``));
    }, 5000);
  }

  console.log(anecdotes);
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