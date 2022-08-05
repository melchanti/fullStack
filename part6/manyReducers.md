***Store with complex state***
Let's implement the filter with radio buttons
radio buttons with the same name form a button group where only one option can be selected.

```js
import './App.css';
import NewNote from './components/NewNote';
import Notes from './components/Notes';

const App = () => {
  const filterSelected = (value) => {
    console.log(value);
  }

  return (
    <div>
      <NewNote />
      <div>
        all <input type='radio' name='filter'
          onChange={() => filterSelected('All')} />
        important <input type='radio' name='filter'
          onChange={() => filterSelected('IMPORTANT')} />
        nonimportant <input type='radio' name='filter'
          onChange={() => filterSelected('NONIMPORTANT')} />
      </div>
      <Notes />
    </div>
  )
}

export default App;

```

We will store the filter value in the redux store in addition to teh notes, the store would look like.
```js
{
  notes: [
    { content: 'reducer defines how redux store works', important: true, id: 1},
    { content: 'state of store can contain any data', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```

***Combined reducers***
We will create a separate reducer for handling the filter
The same module that has the reducer will also has the `action creator` for that reducer.
`src/reducers/filterReducer.js`

```js
const filterReducer = (state = ' ALL', action) => {
  switch(action.type) {
    case'SET_FILTER':
      return action.filter;
    default:
      return state;
  }
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    filter,
  }
}

export default filterReducer;
```

We can create the actual reducer for the application by combining both reducers using `combineReducers`
WE will create this in the `index.js` file

```js
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';
import {createStore, combineReducers} from 'redux';
import { Provider } from 'react-redux';

import noteReducer from './reducers/noteReducer';
import filterReducer from './reducers/filterReducer';

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
});

const store = createStore(reducer);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

At this point, the App breaks.

The state of the store defined by the reducer above is an object with two properties: notes and filter
which have the `noteReducer` and `filterReducer` as values respectively

With the above code, every action gets handled by both reducers so the action gets passed to both reducers.

***Finishing the filters***
To fix our bug, all we need to do is fix how we extract the `notes` in the `Notes` component
```js
const notes = useSelector(state => state.notes);
```
Since state now has two properties the filter and the notes.

Extract the visibility filter into its own componenet `src/components/VisibilityFilter.js`
```js
import { filterChange } from '../reducers/filterReducer';
import { useDispatch } from 'react-redux';

const VisibilityFilter = () => {
  const dispatch = useDispatch();

  return (
    <div>
      all 
      <input 
        type='radio' 
        name='filter'
        onChange={() => dispatch(filterChange('All'))} 
      />
      important 
      <input
        type='radio'
        name='filter'
        onChange={() => dispatch(filterChange('IMPORTANT'))} 
      />
      nonimportant
      <input
        type='radio'
        name='filter'
        onChange={() => dispatch(filterChange('NONIMPORTANT'))} />
    </div>
  )
}

export default VisibilityFilter;
```

We can again simplify App
```js
import './App.css';
import NewNote from './components/NewNote';
import Notes from './components/Notes';
import VisibilityFilter from './components/VisibilityFilter';

const App = () => {
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

Change extracting the notes to
```js
const notes = useSelector(({ filter, notes }) => {
  if (filter === 'ALL') {
    return notes;
  }

  return filter === 'IMPORTANT'
    ? notes.filter(note => note.important)
    : notes.filter(note => !note.important);
});
```

***Redux Toolkit***
`Redux Toolkit` is a library that solves common Redux-related problems
`npm install @reduxjs/toolkit`

Inside `index.js` we will use `configureStore` to create teh store.
Notice how we no longer need `combineReducers`
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

import noteReducer from './reducers/noteReducer';
import filterReducer from './reducers/filterReducer';

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

Let's move to the reducers
We can easily create reducer and related action creators using the `createSlice` function.
```js
//noteReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  }
];

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0));

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote(state, action) {
      const content = action.payload;
      state.push({
        content,
        important: false,
        id: generateId()
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload;
      const noteToChange = state.find(n => n.id === id);
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note=> 
        note.id !== id ? note : changedNote);
    }
  }
});

export const { createNote, toggleImportanceOf } = noteSlice.actions;
export default noteSlice.reducer;
```

Paramaters of `createSlice` function:
  - `name` parameter defines the prefix which is used in the action's type values
    For example the `createNote` action define in the reducer will have the type value of `notes/createNote`
  - The `initialState` parameter defined the reducer's initial state.
  - The `reducers` paramater takes the reducer itself as an object, of which functions handle state changes caused by certain actions
  - `action.payload` in the function contains the argument provided by calling the action creator
    `dispatch(createNote('Redux Toolkit is awesome!'))`
    This dispatch call responds to dispatching the following object
    `dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome'})`
  

Redux Toolkit utilizes the `Immer` library with reducers created by `createSlice` function which makes it possible to mutate the `state` argument inside the reducer.
With the help of `Immer` the state changes remain immutable.

`createSlice` function returns an object containing the reducer as well as the action creators defined by the `reducers` parameter.

the reducer can be accessed with the `reducer` property and the actions can be accessed with the `actions` property.

We need to change the tests due to the naming convention
```js
import noteReducer from './noteReducer';
import deepFreeze from 'deep-freeze';

describe('noteReducer', () => {
  test('returns a new state with action NEW_NOTE', () => {
    const state = [];
    const action = {
      type: 'notes/createNote',
      payload: 'the app state is in redux store',
    }

    deepFreeze(state);
    const newState = noteReducer(state, action);
    expect(newState).toHaveLength(1);
    expect(newState.map(s => s.content)).toContainEqual(action.payload);
  });

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
      }
    ]

    const action = {
      type: 'notes/toggleImportanceOf',
      payload: 2
    }

    deepFreeze(state);
    const newState = noteReducer(state, action);
    expect(newState).toHaveLength(2);

    expect(newState).toContainEqual(state[0]);

    expect(newState).toContainEqual({
      content: 'state changes are made with actions',
      important: true,
      id: 2
    });
  });
});
```

***Redux DevTools***
`Redux DevTools` is a Chrome addon that offers useful development tools for Redux.
