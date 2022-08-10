***Application Navigation structure***
In an old school web app, changing the page shown by the application would be accomplished by the browser making an HTTP GET request to the serve and rendering the HTML representing teh view that was returned.

In single page apps, we are always in the same page.
The JS code in the browser creates an illusion of different pages.

A navigation bar and an application containing multiple views is very easy to implement in react.

Each view is implemented as its own component. We store the view component information in the application state called page.

The method is not optimal as the address stays the same even though at times we are in different views.

```js
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Notes = () => (
  <div> <h2>Notes</h2> </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)

const App = () => {
  const [page, setPage] = useState('home');

  const toPage = (page) => (event) => {
    event.preventDefault();
    setPage(page);
  }

  const content = () => {
    if (page === 'home') {
      return <Home />
    } else if (page === 'notes') {
      return <Notes />
    } else if (page === 'users') {
      return <Users />
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <a href="" onClick={toPage('home')} style={padding}>
          home
        </a>
        <a href="" onClick={toPage('notes')} style={padding}>
          notes
        </a>
        <a href="" onClick={toPage('users')} style={padding}>
          users
        </a>
      </div>

      {content()}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
```

***React Router***
React has the `React Router` library which provides an excellent solution for managign navigation in a React application.

`npm install react-router-dom`

The routing then helps us reduce the `App` component to
```js
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom";

const App = () => {
  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <div>
          <Link style={padding} to="/">home</Link>
          <Link style={padding} to="/notes">notes</Link>
          <Link style={padding} to="/users">users</Link>
        </div>

        <Routes>
          <Route path="/notes" element={<Notes />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Home />} />
        </Routes>

        <div>
          <i>Note app, Department of Computer Science 2022</i>
        </div>
      </div>
    </Router>
  )
}
```

The conditional rendering of components based on the url in the browser, or Routing, is used by placing components as children of the `BrowserRouter` component, inside `Router` tags.

The `BrowserRouter` is a Router that uses the HTML5 history API to keep the UI in sunc with the url

`BrowserRouter` enables us to use the URL in the address bar of the browser for internal routing in a React application.

`Link` creates a link in the application with the text notes, which when clicked changes the URL in the address bar to the `to` value.

Components rendered based on the URL of the browser are defined with the help of the component `Route`
The `path` value defines the browser address, the `element` defines the content of the page if the link is the `path` value.

The `Routes` component works by rendering the first componen whose path matches teh url in the browser's address bar.

***Parameterized route***
We expanded the application to include 5 different views including login.

Notes component renders the list of notes passed to it as props in such a way that the name of each note is clickable

The ability to click a name is implement with the component `Link` and clicking the name of a note whose id is 3 would trigger an event that changes the address of the browser.
```js
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>
        </li>
      )}
    </ul>
  </div>
)
```

parameterized urls are displayed in the routing in `App` component as follows:

```js
<Router>
  // ...

  <Routes>
    <Route path="/notes/:id" element={<Note notes={notes} />} />
    <Route path="/notes" element={<Notes notes={notes} />} />   
    <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
    <Route path="/login" element={<Login onLogin={login} />} />
    <Route path="/" element={<Home />} />      
  </Routes>
</Router>
```

When a browser navigates to the url for a specific note, we render the Note component.

The `Note` component receives all of the notes as props notes and it can access the url paramater with the `useParams` function of the React router.

```js
import {
  // ...
  useParams
} from "react-router-dom"

const Note = ({ notes }) => {
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id)) 
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}
```

***useNavigate***
The code of the component handling the login functionality is 
```js
import {
  // ...
  useNavigate
} from 'react-router-dom'

const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username: <input />
        </div>
        <div>
          password: <input type='password' />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

The code uses teh `useNavigate` function of the React Router
With this function, the browser's url can be changed programmatically

Both `useParams` and `useNavigate` are hook functions. There are rules to using hook functions.
`Create-react-app` has been configured to warn you if you break these rules

***redirect***
For the users Route, we replace the Users component with the Login component if the user isn't logged.
```js
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

***Parametrized route revisited***
We can change our code so we don't pass all the notes to the `Note` component just the note that we need to display.

One way to do this is to use `useMatch` hook
It's not possible to use the `useMatch` hook in the component which defines the routed part of the applicaiton.

We move the `Router` component outside the `App` component
```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
)
```

The `App` component becomes.
```js
import {
  // ...
  useMatch
} from "react-router-dom"

const App = () => {
  // ...

  const match = useMatch('/notes/:id')
  const note = match 
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        // ...
      </div>

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />   
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />      
      </Routes>   

      <div>
        <em>Note app, Department of Computer Science 2022</em>
      </div>
    </div>
  )
}  
```

