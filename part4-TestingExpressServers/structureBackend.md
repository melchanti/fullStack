***Project Structure***
To adhere to `Node.js` the backend structure has to be like below
  - index.js
  - app.js
  - build
    -...
  - controllers
    - notes.js
  - models
    - note.js
  - package-lock.json
  - package.json
  - utils
    - config.js
    - logger.js
    - moddleware.js

Let's separate all printing to the console ot its own module `utils/logger.js`
Extracting logging to its own module is a good idea if we wanted to start writing logs to a file or send them to an external logging service we only need to make changes in one place

```js
function info(...params) {
  console.log(...params);
}

function error (...params) {
  console.log(...params);
}

module.exports = {
  info, error
};
```

The environment variables are extracted into a separate `utils/config.js` file

```js
require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

export default {
  MONGODB_URI,
  PORT
};
```

In addition move the route handlers to a dedicated module. The event handlers of routes are commonly referred to as controllers. So the express object router will be written in `controllers/notes.js` file

The contents of `index.js` then only imports the actual application from the `app.js` file and then starts the application.

```js
const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');
const notesRouter = require('/controllers/notes');
app.use('/api/notes', notesRouter);

const server = http.createServer(app);
server.listen(config.PORT, () => {
  logger.info(`Server running on Port ${config.PORT}`);
});
```

The contents of `app.js` becomes

```js
const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require(mongoose);

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exprts = app;
```

The `app.js` file:
  - establishes the connection to the mongo database
  - Use two middleware
    - notesRouter that has all the routes that our app needs
    - middleware that has any custom middleware that we build

The `note.js` file then only defines the schema for notes
```js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    mingLength: 5,
    required: true
  },
  date: {
    type: Date,
    require: true
  },
  important: Boolean
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Note', noteSchema);
```

The controller `notes.js` has all the routes related to notes

```js
const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  })
});

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

notesRouter.post('/', (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save()
  .then(savedNote => {
    response.json(savedNote);
  })
  .catch(error => next(error));
});

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

notesRouter.put('/:id', (request, response, next) => {

  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(
    request.params.id,
    note,
    {new: true}
  )
  .then(updatedNote => {
    response.json(updatedNote)
  }).catch(error => next(error))
});

module.exports = notesRouter;
```
At the very beginning of the file we create a new router object.
All routes are now defined for the router object, in a similar fashion to what we had previously done with the object representing the entier application.

In addition, the paths in the route handlers have shortend and are now using a relative path.

A rotuer object is an isolated instance of middleware and routes. You can think of it as a "mini-application" capable only of performing middleware and routing functions. Every Express application has a built-in app router.

This object then becomes a middleware in itself and is used in the `app.js` file as
```js
const notesRouter = require('./controllers/notes');
app.use('/api/notes', notesRouter);
```
The object router is basically a middleware and in our specific scenario is only used if the path of the request starts with `/api/notes`

As stated earlier, the custom middleware is moved into a new file `utils/middleware.js`
```js
const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path: ', request.path);
  const.info('Body: ', request.body);

  logger.info('---');
  next();
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'});
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error);
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```


***Testing Node Applications***
`Jest` is a testing library developed and used by Facebook.
It works for testing backends and it shines when it comes to testing React applications.

`npm install --save-dev jest`

We can define a script for jest like below
```json
"test": "jest --verbose"
```
Jest requires one to specify that the execution environment is Node.
This can be done by adding the following to the end of `package.json`
```json
{
  //...
  "jest": {
    "testEnvironemnt": "node"
  }
}
```

Jest, can also look for a configuration file with the default name `jest.config.js`, where we can define the execution environment like this:

```js
module.exports = {
  testEnvironment: 'node',
}
```

We can create a file in the tests directory called `reverse.test.js` and include the following information
```js
const reverse = require('../utils/for_testing').reverse;

test('reverse of a', () => {
  const result = reverse('a');
  expect(result).toBe('a');
});

test ('reverse of react', () => {
  const result = reverse('react');
  expect(result).toBe('tcaer');
});

test('reverse of releveler', () => {
  const result = reverse('releveler');
  expect(result).toBe('releveler');
});
```

ESLint may complain about since the configuration doesn't allow globals.
To get rid of the complains add `"jest":true` to the `env` proprty in the `.eslintrc.js` file

Individual test cases are defined with the `test` function. The first parameter of the function is the test description as a string. The second paramater is a function, that defines the functionality for the test case.

First we assign the results of what is to be tested to a variable
Then, we verify the results with the `expect` function. `expect` wraps the resulting value into an object that offers a collection of matcher functions, that can be used for verifying the correctness of the result.
Jest expects by default that th enames of test files contain `.test.`

`describe` blocks can be used for grouping tests into logical collections. The test output of Jest also uses the name of the describe block.

```js
const average = require('../utils/for_testing').average;

describe('average'), () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1);
  });

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
  });

  test('of empty array is zero', () => {
    expect(average([])).toBe(0);
  });
}
```

`describe` blocks are necessary when we want to run some shared setup or teardown operations for a group of tests.

We can have the databases different for production and development phases
```js
require('dotenv').config();

const PORT = process.env.PORT;

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

export default {
  MONGODB_URI,
  PORT
};
```

***superTest***
the `supertest` package can help us write our tests for testing the API.
`npm install --save-dev supertest`

Our first test can be written in `tests/note_api.test.js`
```js
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('notes are returned as json', async() => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('content_Type', /application\/json/)
});

afterAll(() => {
  mongoose.connection.close();
});
```

the `supertest` function wraps the Express application into a so-called superagent object. The object is assigned to the api variable and tests can use it for making HTTP requests to the backend.

