***REST***
In REST terminology, we refer to individual data objects as resources.
Every resource has a unique address associated with it - its url.
Resources are fetched from the server with HTTP GET requests.
Creating a new resource for storing a note is done by making an HTTP POST request to the notes URL according to the REST convention that the json-server adheres to.
json-server requires all data to be sent in JSON format.
The data must be a correctly formatted string and the request must contain `Content-Type` request header with the value `application/string`

***Sending Data to the Server***
It's better to let the server generate ids for our resources
The newly created resource is stored in the value of the `data` property of the `response` object
Since the data we sent in the POST request was a JS object, axios automatically knew to set the appropriate `application/json` value for the `Content-Type` header.
We can render the new note to the screen by update the state of the App component
```js
const addNote = (event) => {
  event.preventDefault();
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() > 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      setNotes(notes.concat(response.data));
      setNewNote('');
    });
};
```

***Changing the Importance of Notes***
Individual notes stored in the json-server backend can be modified in two different ways by making HTTP requests to the note's unique URL
We can either replace the entire note with an `HTTP PUT` request or only change some of the note's properties with an `HTTP PATCH` request

The function to change a note's importance becomes
```js
const toggleImportanceOf = id => {
  const url = `http://localhost:30001/notes/${id}`;
  const note = notes.find(n => n.id === id);
  const changedNote = { ...note, important : !note.important};

  axios.put(url, changedNoted).then(response => {
    setNotes(notes.map(note => note.id !== id ? note : response.data));
  });
}
```

The reason we made a copy of the note object instead of modifying the `important` property is because the variable `note` is a reference to an item in the `notes` array in the component's state, and we must never mutate state directly in React.

***Extracting Communication with the backend into a separate module***
We can create a directory called `services` in the `src` directory and create a file called `nodes.js` to communicate with the server.
The file would have the following code.
```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```

We can update the above code so instead of returned the response, we return the body of the response, `response.data`
Since `then` returns a promise, we can change the `notes.js` and the `App.js` as follows.

```js
//notes.js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}

//App.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './components/Note';
import noteService from './services/notes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    console.log('effect');
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes);
      });
  }, []);

  const notesToShow = showAll ? notes: notes.filter(note=> note.important);

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important : !note.important};
  
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote));
      });
  }

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note
            key= {note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
}

export default App;
```

***Cleaner Syntax for Defining Object Literals***
ES6 introduced the more compact Object Literals. If the properties of an object has the same key as its corresponding variable then we can ommit the key and it'll assign the key to the value of the variable.

The `notes.js` above becomes
```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update }
```

***Promises and Errors***
You can handle rejected promises in one of two ways either by passing a second callback to `then` or use the `catch` method.

The code below adds a `catch` method to `toggleImportanceOf`

```js