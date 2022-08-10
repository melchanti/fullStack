So far we used the `hook` api from react redux
Older code used `connect` function
You shouldn't use `connect` with newer code but you should be aware of how to use it for maintaining older codes.

***Using the connect-function to share teh redux store to components***
The `connect` function can be used for transforming regular React components so that the state of the Redux store can be "mapped" into the component's props.

The `Notes` component needs th elist of notes and the value of the filter from the Redux store.
The `connect` function accepts a so-called `mapStateToProps` function as its first parameter.

The `Notes` component can then access teh state of the store directly, through `props.notes` or `props.filter`

If we look closer, the `NoteList` component doesn't need the information about which filter is selected, so we can move the filtering logic elsewhere.

The `Notes` component then becomes
```js
import { useDispatch } from 'react-redux';
import { toggleImportanceOf } from '../reducers/noteReducer';
import { connect } from 'react-redux';

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  );
};

const Notes = (props) => {
  const dispatch = useDispatch();

  return (
    <ul>
      {props.notes.map(note => 
        <Note
          key={note.id}
          note={note}
          handleClick={() =>
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  );
}

const mapStateToProps = (state) => {
  if (state.filter === 'ALL') {
    return {
      notes: state.notes
    }
  }
  return {
    notes: (state.filter === 'IMPORTANT'
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  };
}

const ConnectedNotes = connect(mapStateToProps)(Notes);
export default ConnectedNotes;
```

***mapDispatchToProps***
The second parameter of the `connect` function can be used for defining `mapDispatchToProps`
which is a group of action creator functions passed to the connected component as props.

```js
import { toggleImportanceOf } from '../reducers/noteReducer';
import { connect } from 'react-redux';

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  );
};

const Notes = (props) => {
  return (
    <ul>
      {props.notes.map(note => 
        <Note
          key={note.id}
          note={note}
          handleClick={() =>
            props.toggleImportanceOf(note.id)
          }
        />
      )}
    </ul>
  );
}

const mapStateToProps = (state) => {
  if (state.filter === 'ALL') {
    return {
      notes: state.notes
    }
  }
  return {
    notes: (state.filter === 'IMPORTANT'
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  };
}

const mapDispatchToProps = {
  toggleImportanceOf
}

const ConnectedNotes = connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes);
export default ConnectedNotes;
```

The component can directly dispatch the action defined by the `toggleImportanceOf` action creator by calling the function through its `props`.

There's no need to call `dispatch` separately since connect has already modfieid the `toggleImportanceOf` action creator into a form that contains the dispatch.

We will also use `connect` for creating new notes

```js
import { createNote } from '../reducers/noteReducer';
import {connect} from 'react-redux';

const NewNote = (props) => {
  const addNote = async (event) => {
    event.preventDefault();
    const content = event.target.note.value;
    event.target.note.value = '';
    props.createNote(content);
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default connect(
  null,
  { createNote }
)(NewNote);
```

***Referencing action creators passed as props***
The action creator `createNote` can be referenced in two ways
```js
createNote(argument);

props.createNote(argument);
```
You should use the second way, as the second way you are calling an action creator that has already been modified to call dispatch.


***Alternative way of using mapDispatchToProps***
The alternative way of using `mapDispatchToProps` as a function that `connect` will invoke by passing it the `dispatch` function
The return value of the function is an object that defines a group of functions that get passed to the connected component as props.

```js
const NewNote = (props) => {
  // ...
}

const mapDispatchToProps = dispatch => {
  return {
    createNote: value => {
      dispatch(createNote(value))
    },
  }
}

export default connect(
  null,
  mapDispatchToProps
)(NewNote)
```

***Presentational/ Container***
Presentation componenets:
  - Are concerned with how things look
  - May contain both presentational and container components insdie, and usually have some DOM markup and styles of their own
  - Often allow containment via props.children
  - Have no dependencies on the rest of the app, such as Redux actions or stores
  - Don't specify how the data is loaded or mutated
  - Receive data and callbacks exclusively via props
  - Rarely have their own state
  - Are written as functional components unless they need state, lifecycle hooks, or performance optimizations


Container components:
  - Are concerned with how things work
  - May contain both prsentational and container components inside but usually don't have any DOM markup of their own except for some wrapping divs, and never have any styles
  - Provide the data and behavior to presentational or other container components
  - Call Redux actions and behavior to presentational or other container components
  - Are often stateful, as they tend to serve as data sources
  - Are usually generated using higher order components such as connect from React Redux, rather than written by hand

The benefits of dividing components by presentation and container components are:
  - Better separation of concerns. You understand your app and your UI better
  - Better reusability. You can use the same presentational component with completely different state sources, and turn those into separate container components that can be further reused
  - Presentational components are essentially your app's "palette". You can put them on a single page and let the designed tweak all their variations without touching the app's logic. You can run screenshot regression tests on that page.

A high order component is a function that acceps a "regular" component as its paramater, that then returns a new "regular" component as its return value. The connect emthod is an example of a high order component.

High order components, or HOCs, are a way of defining generic functionality that can be applied to components.

HOCs are in fact a generalization of the High Order Function concept.

***Redux and the component state***
React only focuses on generating the views, and the application state is separated completely from the React components adn passed on to Redux, its actions, and its reducers. This is the right way of using React

If the application has more complicated forms, it may be beneficial to implement their local state using the state provided by the `useState` function.
If the state of the form is only relevant when filling the form, it may be wise to leave the management of the state to the component responsible for the form.

