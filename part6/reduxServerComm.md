We'll use json-server for this part
store the iniital data in `db.json`
```json
{
  "notes": [
    {
      "content": "the app state is in redux store",
      "important": true,
      "id": 1
    },
    {
      "content": "state changes are made with actions",
      "important": false,
      "id": 2
    }
  ]
}
```

`npm install json-server --save-dev`

add `"server": "json-server -p3001 --watch db.json"` to package.json

`npm install axios`

A quick way to initialize the notes state based on the data received from the server is to fetch the notes

We will create two actions creators to `noteSlice`; `setNotes` and `appendNotes`.

We will use `setNotes`
```js
// ...

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      const content = action.payload

      state.push({
        content,
        important: false,
        id: generateId(),
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload

      const noteToChange = state.find(n => n.id === id)

      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }

      return state.map(note =>
        note.id !== id ? note : changedNote 
      )     
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setNotes(state, action) {
      return action.payload
    }
  },
})

export const { createNote, toggleImportanceOf, appendNote, setNotes } = noteSlice.actions

export default noteSlice.reducer
```

We will add the initialization of the notes to `app.js`
```js
import { useEffect } from 'react';
import './App.css';
import NewNote from './components/NewNote';
import Notes from './components/Notes';
import VisibilityFilter from './components/VisibilityFilter';
import noteService from './services/notes';
import { setNotes } from './reducers/noteReducer';
import { useDispatch } from '@reduxjs/toolkit';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(setNotes(notes)));
  }, [dispatch]);
  
  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App;
```

The code communicating with the server is
```js
import axios from "axios";

const baseUrl = 'http://localhost:3001/notes';

const getAll = async() => {
  const response = await axios.get(baseUrl);
  return response.data;
}

const createNew = async (content) => {
  const object = { content, important: false };
  const response = await axios.post(baseUrl, object);
  return response.data;
}

const exportedObject = {
  getAll,
  createNew
}
export default exportedObject;
```

We change the `NewNote` component to add the note to the server when a new note is created.

```js
import { useDispatch } from 'react-redux';
import { createNote } from '../reducers/noteReducer';
import noteService from `../services/notes`;

const NewNote = (props) => {
  const dispatch = useDispatch();

  const addNote = async (event) => {
    event.preventDefault();
    const content = event.target.note.value;
    event.target.note.value = '';
    const newNote = await noteService.createNew(content);
    dispatch(createNote(newNote));
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewNote;
```

***Async. actions and redux thunk***
We want to abstract away the communication with the server from the components

`App.js` would be
```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  }, [dispatch]) 

  // ...
}
```

`NewNote.js` would be
```js
const NewNote = () => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  // ...
}
```

This can be done with `Redux Thunk`, the use of the library doesn't need any additional configuration when the Redux store is created using the Redux Toolkit's `configureStore` function.

`npm install redux-thunk`

Redux thunk helps us implement action creators which return function instead of an object.
The function receives Redux store's `dispatch` and `getState` methods as paramaters
This allows for implementations of asynchronous action creators

`noteReducer.js` would then become
```js
import { createSlice } from '@reduxjs/toolkit';
import noteService from '../services/notes';

const initialState = [

];

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0));

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    toggleImportanceOf(state, action) {
      const id = action.payload;
      const noteToChange = state.find(n => n.id === id);
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note=> 
        note.id !== id ? note : changedNote);
    },
    appendNote(state, action) {
      state.push(action.payload);
    },
    setNotes(state, action) {
      return action.payload;
    }
  }
});

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions;

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll();
    dispatch(setNotes(notes));
  }
}

export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content);
    dispatch(appendNote(newNote.content));
  }
}

export default noteSlice.reducer;
```

In the inner function of both `initializeNotes` and `createNote`, the operation fetches all the notes from the server adn then dispatches the `setNotes` action

The component `App` can now be changed to 
```js
import { initializeNotes } from './reducers/noteReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes()) 
  }, [dispatch]) 

  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}
```

The iniitlization logic for the notes has been completely separated from the React component.

Redux Toolkit offers a multitude of tools to simplify asynchronous state management.
Suitable tools for this use case are for example the `createAsyncThunk` function adn the `RTK Query` API

