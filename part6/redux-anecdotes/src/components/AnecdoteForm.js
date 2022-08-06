import { useDispatch } from "react-redux";
import { setNotification, removeNotification } from "../reducers/notificationReducer";
import { createAnecdote } from "../reducers/anecdoteReducer";


const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const newAnecdoteClick = async (event) => {
    event.preventDefault();
    let anecdote = event.target.content.value;
    dispatch(createAnecdote(anecdote));
    dispatch(setNotification(`${anecdote} created`, 10))
    event.target.content.value = '';
  }

  return (
    <form onSubmit={newAnecdoteClick}>
        <div><input name="content"/></div>
        <button>create</button>
      </form>
  )
}

export default AnecdoteForm;