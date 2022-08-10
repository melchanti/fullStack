import { setNotification} from "../reducers/notificationReducer";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { connect } from "react-redux";

const AnecdoteForm = (props) => {

  const newAnecdoteClick = async (event) => {
    event.preventDefault();
    let anecdote = event.target.content.value;
    props.createAnecdote(anecdote);
    props.setNotification(`${anecdote} created`, 10)
    event.target.content.value = '';
  }

  return (
    <form onSubmit={newAnecdoteClick}>
        <div><input name="content"/></div>
        <button>create</button>
      </form>
  )
}

export default connect(
  null,
  { setNotification, createAnecdote }
)(AnecdoteForm);