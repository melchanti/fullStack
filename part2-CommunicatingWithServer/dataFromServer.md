***Introduction***
We will use JSON Server to act as our server for now.
1. Create a file name `db.json` in the root directory of your project with the content that you want as the data
```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "date": "2022-1-17T17:30:31.098Z",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "date": "2022-1-17T18:39:34.091Z",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "date": "2022-1-17T19:20:14.298Z",
      "important": true
    }
  ]
}
```
2. Run the follown command from the root directory of the project
  `npx json-server --port 3001 --watch db.json`

Now you have this temporary server running and collecting the data from `db.json`

***The browser as a runtime environment***
The use of XHR to fetch data is no longer recommended and browsers already widely support the `fetch` method that uses `promises.

For now, let's see an example of how data is fetched using XHR

```js
const xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // handle the response that is saved in variable data
  }
}

xhttp.open('GET', '/data.json', true);
xhttp.send();
```

We register an event handler to the `xhttp` object representing teh HTTP request, which will be called by the JS runtime whenever the state of the `xhttp` object changes.

With JS, all IO operations have to be executed as non-blocking which means that code execution continues immediately after calling an IO function, without waiting for it to return.

When an asynchronous operation is completed, or at some point after its completion, the JS engine calls the event handlers registered to the operation.

JS engines are currently single-threadded, which means that they can't execute code in parallel.

A consequence of this single-threaded nature is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution.

For the browser to remain responsive, the code logic needs to be such that no computation can take too long.

***npm***
A clear indication htat a project uses npm is the `package.json` file located at the root of the project.
The `axios` library can be used for communcation between the browser and the server.
Add the following scrip to `package.json`
```json
"server": "json-server -p3001 --watch db.json"
```

***Axios and Promises***
To use axios in the project write the following code in the `index.js` file

```js
import axios from 'axios';

const promise = axios.get('http://localhost:3001/notes');
console.log(promise);

const promise2 = axios.get('http://localhost:3001/foobar');
console.log(promise2);
```

A promise is an object representing the eventual completion or failure of an asynchronous operation.

A promise can have 3 states:
  - pending
  - fulfilled
  - rejected

To register an event handler to a promise, use the keyword `then`

```js
const promise = axious.get('http://localhost:3001/notes');
promise.then(response => {
  console.log(response);
});
```

The JS runtime environment calls the callback registered by the `then` method providing it with a `response` object as a parameter.
The `response` object contains all the essential data related to the response of an HTTP GET request, which would include the returned data, status code, and headers.

It's common to chain the `then` method call to the axios method call.

We can fetch the data from our local server and render them as we know from the data format that the server is using `application/json`.

```js
import React from 'react';
import ReactDOM from 'react-dom/client'
import axious from 'axios'

import App from './App'

axios.get('http://localhost:3001/notes').then(response => {
  const notes=response.data;
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes}/>);
});
```
The above isn't recommended as we wait until we retrieve the data from the server before beginning to render the `App` component. It's better to fetch the data from the `App` component.

***Effect-hooks***
The Effect Hook lets you perform side effects on function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.

The above definition is from the official documentation.

To use the effect hooks, let's rewrite the `index.js` file and the `app.js` file

```js
//index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

//app.js
import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  // ...
}
```

The `useEffect` first argument, a function, is executed immediately after rendering.
Inside that callback, `axios` makes a `get` request to the server. After the data is received from the server, the callback handling the fullfilment of the request is called. This calls the function `setNotes(response.data). As always, a call to a state-updating function triggers the re-rendering of the component.

By default, effects run after every completed render, but you can choose to fire it only when certain values have changes.

The first parameter of `useEffect` is the effect. The second paramater `[]` means that the effect is only run after the first render of the component.

***The development runtime environment***
Let's review the application so far
The JS code making up our React application is run in the browser. The browser gets the JS from the React dev server, which is the application that runs after running the command `npm start`.
The dev-server transforms the JS into a format understood by the browser.

The React application running in the browser fetches the JSON formatted data from json-server running on port 3001 on the machine.

