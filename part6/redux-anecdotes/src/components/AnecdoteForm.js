import { useDispatch } from "react-redux";
import { newAnecdote } from "../reducers/anecdoteReducer";
import { setNotification, removeNotification } from "../reducers/notificationReducer";


const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const newAnecdoteClick = (event) => {
    event.preventDefault();
    let anecdote = event.target.content.value;
    dispatch(newAnecdote(anecdote));
    dispatch(setNotification(`${anecdote} created`))
    anecdote = '';
    setTimeout(() => {
      dispatch(removeNotification(``));
    }, 5000);
  }
  return (
    <form onSubmit={newAnecdoteClick}>
        <div><input name="content"/></div>
        <button>create</button>
      </form>
  )
}

export default AnecdoteForm;