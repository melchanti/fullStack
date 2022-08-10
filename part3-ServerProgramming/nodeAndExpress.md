***Introduction***
To start a backend server type `npm init`
You tend to add a script called "start" that runs `node index.js`

```json
{
  //...
  "scripts": {
    "start": "node index.js",
    //...
  },
  //...
}
```

***Simple Web Server***
You can change the application into a web server simply by writing the following code.

```js
const http = require('http');

const app = http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World');
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on ${PORT}`);
```

The first line, the application imports Node's built-in web server module.
The next line of code uses `createServer` method of the `http` module to create a new web server.
An event handler is registered to the server that is called every time an HTTP request is made to the server's address.
The last rows bind the http server assigned to the `app` variable, to list to HTTP requests send to the port 3001

To send the notes, we can update our `index.js` file to send these notes
```js
const http = require('http');

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

const app = http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(JSON.stringify(notes));
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on ${PORT}`);
```

The `application/json` value in the `Content-Type` header informs the receiver that the data is in the JSON format
`JSON.stringify(notes)` transforms the `notes` array into JSON

***Express***
`express` is a library that is used to ease server side development with Node by offering a more pleasing interface to work with the built-in http module.

We can install `express` using `npm install express`

The transitive dependencies of a project is what a project dependency depends on

`npm update` updates the dependencies of a project.

***Web and Express***
With Express, the code above becomes 

```js
const express = require('express');
const app = express();

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});
app.get('/api/notes', (request, response) => {
  response.json(notes);
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
```

We import `express` which this time is a function that is used to create an express application stored in the `app` variable.

Then we defined two routes. One defines an event handler that is used to handle HTTP GET requests made to the application's /root

The event handler takes two paramaters:
  - The first `request` paramater contains all the information of the HTTP request
  - The second `response` paramater is used to define how the request is responded to

The first route uses the `send` method with a string. Since the parameter is a string, express automatically sets the value of `Content-Type` header to be `text/html`

The second route use the `json` method of the `response` object. Calling the method will send the notes array that was passed to it as a JSON formatted string.
Express automatically sets the `Content-Type` header to `application/json`
The `json` method also deals with stringfying the array

***nodemon***
In order for the server to update any changes that we make, we have to stop the application and restart it
The solution to this is `nodemon`
`nodemon` will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

We can install nodemon by defining it as a development dependency
`npm install --save-dev nodemon`
To start the applciation with nodemon we can write `node_modules/.bin/nodemon index.js`
or add a script in the package.json file.
```json
```json
{
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    //...
  },
  //...
}
```
In the script, you don't need to specify the path because `npm` automatically knows to search for the file from that directory.

To run it now, we can type `npm run dev`

***REST***
Let's expand the application to provide RESTful HTTP API 

For our purpose, RESTFUL thinking means that every resource has an associated URL which is teh resource's unique address.

That means that our application can follow

url       ->  Verb    -> Functionality
notes/10  ->  GET     -> fetches a single resource
notes     ->  GET     -> fetches all resources in the collection
notes     ->  POST    -> Creates a new resource based on the request data
notes/10  ->  DELETE  -> Removes the identified resource
notes/10  ->  PUT     -> Replaces the entire identified resource with the request data
notes/10  ->  PATCH   -> Replaces a part of the identified resource with the request data

***Fetching a single resource***
We can define parameters for routes in express by using the colon syntax:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
```
The id parameter in the route of a request, can be accessed through the request object.
`const id = request.params.id;`
We make sure we convert the id to a number as it'll presented to us as a string
Additionally, ensure that we respond with a failure to ids that are not present in the array.

***Deleting resources***
There's no consensus on what status code should be returned to a DELETE request if the resource doesn't exist.
It's either 204 or 404
If deleting is successful, we respond to the request with the status code `204 no content` and return no data with the response

```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  response.status(204).end();
});
```

We can use `Postman` to test the application for delete.

***The VS Code REST client***
You can use the REST client on VS to test requests
`GET http://localhost:3001/api/notes`

***The WebStorm HTTP Client***
You can also you IntelliJ WebStorm HTTP Client

***Receiving data***
In order to access request data easily, we need the help of the express json-parser that is taken to use with command `app.use(express.json())`

The json-parser functions so that it takes the JSON data of a request, transforms it into a Javascript object and then attaches it to the body property of the `request` object before the route handler is called.

```js
const express = require('express');
const app = express();

app.use(express.json());

//...
app.post('/api/notes', (request, response) => {
  const note = request.body;
  console.log(note);
  response.json(note);
});
```
For the time being, we just print and return the note

With VS client, you can add multiple requests in the same `.rest` file using `###` separator
To find out all the request headers use `console.log(request.headers)`

Now that we have verified the data, the application is receiving, we can write the `post` method

```js

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
  return maxId + 1;

};
app.post('/api/note', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    });
  }


  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});
```

***About HTTP request Types***
The HTTP standard talks about properties related to request types, safety and indempotence
The HTTP GET request should be safe. In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval.

In addition safe means, that the request must not have side effect like changing the state of the database as a result of the request, and the response must only return data that already exists on the server.

All HTTP requests except POST should be idempotent meaning aside from error or expiration issues the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE should have this property.

Both safety and idempotence are just standards and there's nothing that guarantees them based on the request type. However, when our API adheres to RESTful principles then safety and idempotent can be assured.

***Middleware***
The json-parser we used earlier is a so-called middleware.

Middleware are functions that can be used for handling `request` and `response` objects.

In practice, you can use several middleware at the same time. When you have more than one, they're executed one by one in the order that they were taken into use in express.
Middleware is a function that receives three parameters

```js
const requestLogger = (request, response, next) => {
  console.log(`Method:`, request.method);
  console.log(`Path: `, request.path);
  console.log(`Body: `, request.body);
  console.log('---');
  next();
}

app.use(requestLogger);
```
At the end of the function body the `next` function yields control to the next middleware.

Middleware functions have to be taken into use before routes if we want them to be executed before the rote event handlers are called.

It's possible to add a middleware after the routes, this middleware will be executed if no route handles the HTTP request.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
```