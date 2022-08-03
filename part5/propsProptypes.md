***Displaying the login form only when appropriate***
Start by extracting the login form into its own component

```js
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
```

A fast way of implementing the functionaliy is to change the `loginForm` function of the App component like so
```js
const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)

  // ...

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  // ...
}
```

***The componenets childer, aka. props.chidlren***
The code related to managing the visibility of the login form could be considered to be its own logical entity and hence we will make a separate componenet for it.

This new component should be used in the following way.

```js
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```
Notice the component has both opening and closing tags which surround a LoginForm component.
LoginForm is a child component of Tooglable.

We can add any react components between the opening and closing tags
The Togglable component code is below.
```js
import { useState } from 'react';

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none': ''};
  const showWhenVisible = { display: visible ? '' : 'none'};

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
}

export default Togglable;
```

`props.children` is used for referencing teh child components of the component.

Unlike the "normal" props we've seen before, children is automatically added by React and always exist.

The Togglable component is reusable.

Let's separate the noteForm into its own component
```js
const NoteForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```
Below we define the note component inside a Togglable component
```js
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={addNote}
    value={newNote}
    handleChange={handleNoteChange}
  />
</Togglable>
```

***State of the forms***
React doeumentation says the following about where to place the state of the application
  Often several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor

Let's move the state that is needed for the noteform componenet to the noteform

```js
import { useState } from 'react';

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('');

  const handleChange = (event) => {
    setNewNote(event.target.value);
  }

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: Math.random() > 0.5,
    });

    setNewNote('');
  }


  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChangle={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

The `App` component becomes simpler now that we have got rid of the `newNote` state and its event handler.

```js
const App = () => {
  // ...
  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
```

***References to components with ref***
We want to hide the `create` a new note after a note has been created
But the visibility is controlled by the parent of the noteform

We can use teh `ref` mechanism of React, which offers a reference to the component

First, we change the App component as follows
```js
import { useState, useEffect, useRef } from 'react'

const App = () => {
  // ...
  const noteFormRef = useRef()

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

The `useRef` hook is used to create a ref that is assigned to the Togglable component contianing the creation note form.
This hook ensures the same reference(ref) is kept throughout re-renders of the component.

We also chang the Togglable component as follows
```js
import { useState, forwardRef, useImperativeHandle } from 'react';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none': ''};
  const showWhenVisible = { display: visible ? '' : 'none'};

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

export default Togglable;
```

The function is wrapped inside a `forwardRef` function call. This way the component can access the ref that is assigned to it.

The component uses the `useImpoerativeHandle` hook to make its toggleVisibility function avaialble outside the component

We can now the `noteFormRef.current.toggleVisiblity` to hide the form
```js
const App = () => {
  // ...
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {     
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
}
```

***PropTypes***
The expected and required props of a component can be defined with the `prop-types` library.

To define the `buttonLabel` prop as a mandatory or required string-type prop, write the below code.
```js
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ..
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
```
Let's also define PropTypes to teh `LoginForm` component
```js
import PropTypes from 'prop-types'

const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
    // ...
  }

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
```

***ESlint***
Let's define our desired configuration in the `.eslintrc.js` file

```js
module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "jest/globals": true 
  },
  "extends": [ 
      "eslint:recommended",
      "plugin:react/recommended"
  ],
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "plugins": [
      "react", "jest"
  ],
  "rules": {
      "indent": [
          "error",
          2  
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "never"
      ],
      "eqeqeq": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": [
          "error", "always"
      ],
      "arrow-spacing": [
          "error", { "before": true, "after": true }
      ],
      "no-console": 0,
      "react/prop-types": 0,
      "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
  ```

Let's also add to `.eslintignore`

```js
node_modules
build
.eslintrc.js
```

Create teh npm script to run the lint
```json
"eslint": "eslint ."
```