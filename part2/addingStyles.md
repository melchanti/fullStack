In React to add the `class` attribute, we have to use `className` instead of `class`
To style our content, we create a file called `index.css` and add the css styles there
We then import the file into the `index.js` file


***Improved error message***
Instead of using an alert, let's implement notification as its own component

The below message creates a div with class `error`
```js
const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className='error'>
      {message}
    </div>
  );
}
```

We add this component to the overall display of the content
And use another component state to keep track of the error messages

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      // ...
    </div>
  )
}
```

Our application currently has one possible location where an error could occur, instead of alerting the user, we can add the Notification component.

```js
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  ```

  We can style the Notification component by apply a style to the `.error` class
  ```css
  .error {
  color: red;
  background: lightgrey;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
```

***Inline Styles***
Any React component or element can be provided with a set of CSS properties as a JS object through the style attribute.

```js
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      // ...  

      <Footer />
    </div>
  )
}
```

React goes against old conventions of separating css, html and JS.

Since the separation of CSS, HTML, and JS into separate files didn't seem to scale well in larger applications, React bases the division of the application along the lines of its logical functional entities

The structural units that make up the application's functional entities are React components. A React component defines the HTML for structuring the content, the JS functions for determining functionality, and also the component's styling; all in one place.
