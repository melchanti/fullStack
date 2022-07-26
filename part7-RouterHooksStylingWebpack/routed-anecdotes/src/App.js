import { useState } from 'react'
import {
  BrowserRouter as Router,
  Link, Routes, Route,
  useParams, useNavigate
} from 'react-router-dom';
import { useField } from './hooks';

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>anecdotes</Link>
      <Link to='/create-new' style={padding}>create new</Link>
      <Link to='/about' style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => 
          <li key={anecdote.id} >
            <Link to={`/${anecdote.id}`}>{anecdote.content}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {

  const content = useField('name');
  const author = useField('text');
  const info = useField('text');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });
    navigate('/');
    props.setNotification(`A new anecdote "${content}" created!`);
    setTimeout(() => {
      props.setNotification(null);
    }, 3000);
  }

  const handleReset = (e) => {
    e.preventDefault();
    content.onReset();
    author.onReset();
    info.onReset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} name='content' />
        </div>
        <div>
          author
          <input {...author} name='author' />
        </div>
        <div>
          url for more info
          <input {...info} name='info' />
        </div>
        <input type="submit" value="create" />
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
    </div>
  )

}

const Anecdote = ({ anecdotes }) => {
  const viewedId = Number(useParams().id);
  const viewAnecdote = anecdotes.find(anecdote => anecdote.id === viewedId);
  return (
    <div>
      <h2>{viewAnecdote.content}</h2>
      <p>has {viewAnecdote.votes} votes</p>
      <p>for more info see {viewAnecdote.info}</p>
    </div>
  )
}

const Notification = ({message}) => {
  return (
    <div>
      {
      message 
        ? message
        : null
      }
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])
  const [notification, setNotification] = useState('');

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <Router>
        <h1>Software anecdotes</h1>
        <Menu />
        <Notification message={notification} />
        <Routes>
          <Route path='/:id' element={<Anecdote anecdotes={anecdotes} />} />
          <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path='/about' element={<About />} />
          <Route path='/create-new' element={<CreateNew addNew={addNew} setNotification={setNotification}/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
