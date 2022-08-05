***Flux-architecture***
Facebook developed the Flux-architecture to make state management easier.
The state is separated from React-components into its own stores
State is changed with different actions
When an action changes the state, the views are rerendered

ACTION -> DISPATCHER -> STORE -> VIEW

***Recux***
Facebook has an implementation for Flux, but we will use `Redux` library

to install redux, use `npm install redux`

The whole state of the application is stored into one JS-object in the store
Because our application only needs the value of the counter, we will save it straight to the store
If the state had more items, different things in the state would be saved as separate fields of the object

The state of the store is changed with `Actions`. Actions are objects, which have at least a field dtermining the `type` of the action.
```js
{
  type: 'INCREMENT'
}
```
If there's data involved with the action, other fields can be declared

The impact of the action to the state of the application is defined using a `reducer`
In practice, a reducer is a function which is given the current state and an action as paramaters. It returns a new state

The first paramater is the state in the store. Reducer returns a new state based on the actions type
We can set a default value for the state of 0. The reducer works even if the store-state has not been primed yet.

```js
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state -1
    case 'ZERO':
      return 0
    default:
      return state
  }
}
```

Reducer is never supposed to be invoked directly from the application code.
Reducer is only given as a paramater to teh `createStore` function which creates the store.

```js
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```

The store can now use the reducer to handle actions, which are dispatched to the store with its `dispatch` method.

```js
store.dispatch({ type: 'INCREMENT'});
```

You can find the state of the store by typing `store.getState()`
```js
const store = createStore(counterReducer)
console.log(store.getState()) // 0
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
console.log(store.getState()) // 3
```

`store.subscribe` can be used to create callback functions the store calls whenever an action is dispatched to the store.

All of our code is in the `index.js` file

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createStore } from 'redux';

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state -1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const store = createStore(counterReducer);

const App = () => {
  return (
    <div>
      <div>
        {store.getState()}
      </div>
      <button
        onClick={e => store.dispatch({ type: 'INCREMENT' })}
      >plus</button>
      <button
        onClick={e => store.dispatch({ type: 'DECREMENT' })}
      >minus</button>
      <button
        onClick={e => store.dispatch({ type: 'ZERO' })}
      >zero</button>
    </div>
  )
}

store.dispatch({ type: 'INCREMENT' });

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
renderApp();

store.subscribe(renderApp);
```

When the state in the store is changed, React is not able to automatically rerender the application
Thus we registered a function `renderApp` that we pass to teh store usign `subscribe`

***Redux-notes***

We will modify the notes app to use redux
First, we will start with a simple notes app
```js
import './App.css';
import {createStore} from 'redux';
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data);
    return state;
  }

  return state;
}

const store = createStore(noteReducer);

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'the app state is in redux store',
    important: true,
    id: 1
  }
});

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
});


function App() {
  return (
    <div>
      <ul>
        {store.getState().map(note => 
          <li key={note.id}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
      )}
      </ul>
    </div>
  );
}

export default App;
```

***Pure functions, immutable***
Redux has a basic assumption that reducers are pure functions meaning they don't cause any side effects and they must always return the same response when called with the same paramaters.

Our `noteReducer` is not a pure function as it modifies its arguments.
To fix it, we will use `concat` method to return a new array
```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    return state.concat(action.data);
  }

  return state;
}
```

Let's expand the reducer to handle toggling of importnatce.
We will expand the reducer in the `test driven` way, we will start by creating a test
First let's move the reducer to its own module `src/reducers/noteReducer.js`

Also add `deep-freez` library which can make sure that the reducer has been correctly defined as an immutable function.
`npm install --save-dev deep-freeze`

The test code written in `src/reducers/noteReducer.test.js`
```js
import noteReducer from './noteReducer';
import deepFreeze from 'deep-freeze';

describe('noteReducer', () => {
  test('returns a new state with action NEW_NOTE', () => {
    const state = [];
    const action = {
      type: 'NEW_NOTE',
      data: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state);
    const newState = noteReducer(state, action);
    expect(newState).toHaveLength(1);
    expect(newState).toContainEqual(action.data);
  })
})
```
`deepFreeze(data)` command ensures that the reducer doesn't change the state of the store given to it as a parameter

The test for `Toggle Importance` is
```js
test('returns new state with action TOGGLE_IMPORTANCE', () => {
  const state = [
    {
      content: 'the app state is in redux store',
      important: true,
      id: 1
    },
    {
      content: 'state changes are made with actions',
      important: false,
      id: 2
    }]

  const action = {
    type: 'TOGGLE_IMPORTANCE',
    data: {
      id: 2
    }
  }

  deepFreeze(state)
  const newState = noteReducer(state, action)

  expect(newState).toHaveLength(2)

  expect(newState).toContainEqual(state[0])

  expect(newState).toContainEqual({
    content: 'state changes are made with actions',
    important: true,
    id: 2
  })
})
```

The `noteReducer` will then become
```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return state.concat(action.data);
    case 'TOGGLE_IMPORTANCE': {
      const id = action.data.id;
      const noteToChange = state.find(n => n.id === id);
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      };
      return state.map(note =>
        note.id !== id ? note : changedNote 
      );
     }
    default:
      return state;
  }
}
```

***Uncontrolled form***
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createStore} from 'redux';
import noteReducer from './reducers/noteReducer';

const store = createStore(noteReducer);

const generateId = () => 
  Number((Math.random() * 1000000).toFixed(0));


function App() {
  console.log(store.getState())

  const addNote = (event) => {
    event.preventDefault();
    const content = event.target.note.value;
    event.target.note.value = '';
    store.dispatch({
      type: 'NEW_NOTE',
      data: {
        content,
        important: false,
        id: generateId()
      }
    })
  }

  const toggleImportance = (id) => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      data: { id }
    });
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note"/>
        <button type="submit">add</button>
      </form>
      <ul>
        {store.getState().map(note => 
          <li 
            key={note.id}
            onClick={() => toggleImportance(note.id)}
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
      )}
      </ul>
    </div>
  );
  
}

const appRender = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  );
}

appRender();

store.subscribe(appRender);
```

Notice that we didn't bound the state of the form fields to the state of the App component like we have previously done.
React calls this kind of form uncontrolled.
It's not necessary for React-components to know Redux action types and forms, we will separate creating actions into their own functions

```js
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}
//...

const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content))
    
  }
  
  const toggleImportance = (id) => {
    store.dispatch(toggleImportanceOf(id))
  }

  // ...
}
```

***Forwarding Redux-Store to various components***
We need to be able to split the app into different components
The components need to have access to the store
We will use the `hooks-api` of `react-redux`
`npm install react-redux`

We will move the `App` component into its own file
`index.js` becomes

```js
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import noteReducer from './reducers/noteReducer';

const store = createStore(noteReducer);


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

The application is now defined as a child of `Provider` and we store the `store` as a property called `store` in `Provider`

We will move the action creators to `reducers.noteReducer.js`
```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return state.concat(action.data);
    case 'TOGGLE_IMPORTANCE': {
      const id = action.data.id;
      const noteToChange = state.find(n => n.id === id);
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      };
      return state.map(note => note.id !== id ? note : changedNote);
    }
    default:
      return state
    }
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0));

export const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  };
};

export const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  };
};

export default noteReducer;
```

The App component must pass the store as props to all the components that need the store

The module has multiple export commands, there can only be one `default` export but you can have multiple 'normal' exports

Normally exported functions can be imported with the object destructure syntax

The code for `App.js` is
```js
import './App.css';
import { createNote, toggleImportanceOf } from './reducers/noteReducer';
import { useSelector, useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  const notes = useSelector(state => state);

  const addNote = (event) => {
    event.preventDefault();
    const content = event.target.note.value;
    event.target.note.value = '';
    dispatch(createNote(content));
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id));
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note"/>
        <button type="submit">add</button>
      </form>
      <ul>
        {notes.map(note => 
          <li 
            key={note.id}
            onClick={() => toggleImportance(note.id)}
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
      )}
      </ul>
    </div>
  )
}

export default App;
```

The `useDispatch` hook provides any React component access to the dispatch-function of the redux-store defined in `index.js`
The component can access teh notes stored in the store with the `useSelector` hook using a selector function as a parameter

Slector functions are usualy a bit more interesting than the one above.
```js
const importantNotes = useSelector(state => state.filter(note => note.important));
```

***More components***
We will have two components, one ofr adding a new note and one for displaying notes.
```js
// newNote.js
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

const NewNote = (props) => {
  const dispatch = useDispatch()

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewNote
// Notes.js
import { useDispatch, useSelector } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Note = ({ note, handleClick }) => {
  return(
    <li onClick={handleClick}>
      {note.content} 
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  return(
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

export default Notes
```

`app.js` is simple now
```js
const App = () => {

  return (
    <div>
      <NewNote />
      <Notes />
    </div>
  )
}
```

`Note` component in `Notes.js` responsible for rendering a single Note is not aware that the event handler it gets as props dispatches an action. These kind of components are called `presentational` in React terminology

`Notes` is a `container` component. as it contains some application logic.