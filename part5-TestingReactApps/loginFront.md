Throughout this part, we will assume that new users will not be added from the frontend

***Handling login***
We will add a login to the top of the page.

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // ...

  const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
  }

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>

      // ...
    </div>
  )
}

export default App
```

Let's separate the code responsible for the login into its own module `services/login.js`
Then the code for `login.js` is and the code for the `handleLogin` is

```js
//login.js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }

//app.js
import loginService from './services/login'

const App = () => {
  // ...
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // ...
}
```

Let's add additional code to only show the adding new notes when a user is logged in and only show the login option if the user is not logged in.

```js
const App = () => {
  // ...

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>  
  )

  return (
    <div>
    <h1>Notes</h1>

    <Notification message={errorMessage}/>

    {user === null ?
      loginForm() :
      noteForm()
    }

    <h2>Notes</h2>

    // ...

  </div>
  )
}
```

***Creating new notes***
We saved the user's token in the user's state

Let's add this token to creating new notes.

the `services/notes.js` is then changed to include the token in the request, and an additional function to set the token.
the `handleLogin` function in `app.js` must be changed to set the token

```js
// services/notes.js
import axios from 'axios'
const baseUrl = 'api/notes'

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
}


const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
}

const create = newObject => {
  const config = {
    header: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
}

export default { 
  getAll, 
  create, 
  update,
  setToken
}

//app.js
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })

    noteService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    // ...
  }
}
```

***Saving the token to the browser's local storage***
Local Storage is a key-value database in the browser.
A value corresponding to a certain key is saved to the database with method `setItem`
`window.localStorage.setItem('name', 'juha touriainen')`

The value of the key can be found with method `getItem`
`window.localStorage.getItem('name')`
`removeItem` removes a key

Values int he local storage are persisted even when the page is rerendered. The storage is origin-specific so each web application has its own storage.

Values saved to the storage are DOMstring
So objects must be saved with the method `JSON.stringify` and strings can be objectified with `JSON.parse`

We change our login method to save the user to the storage
```js
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // ...
    }
  }
```
You can inspect local storage using the developer tools
  In chrome, go to inspect, Network tab and click on local storage.

Our app needs to check if a user details are available in local storage.
We will check this with an effect hook.
We will create a second effect hook to handle teh first loading of the page
```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // ..
```

To logout a user, you can type
`window.localStorage.removeItem('loggedNoteappUser')` in the console.

or with the command `window.localStorage.clear()`

