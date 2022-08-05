import { useDispatch } from "react-redux";
import { newAnecdote } from "../reducers/anecdoteReducer";


const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const newAnecdoteClick = (event) => {
    event.preventDefault();
    dispatch(newAnecdote(event.target.content.value));
  }
  return (
    <form onSubmit={newAnecdoteClick}>
        <div><input name="content"/></div>
        <button>create</button>
      </form>
  )
}

export default AnecdoteForm;