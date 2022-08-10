Since the bakend is relatively simple, we will make the deicsion to test the entire application through its REST API, so that the database is also included
This kind of testing where multiple components of the system are being tested as a group, is called integration testing.

***Test Environment***
The convention in Node is to define the execution mode of the application with the `NODE_ENV` environment variable.

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"
  },
  // ...
}
```

The option `runInBand` will prevent Jest from running tests in parallel.

Jest may not exit one second after the test has been completed to fix this, we can add an option `--forceExit` to force Jest to exit.
Another problem amy arise from the face that the test takes too long to run, we can add another paramater to the `test` method to increase the timeout.

`"test": "NODE_ENV=test jest --verbose --runInBand --forceExit"`
```js
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)
```

supertest takes care that the application being tested is started at the port that it uses internally.

***Initializing the database before tests***
We can initialize the database before every test with the `beforeEach` function
```js
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Note = require('../models/note');

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
];

beforeEach(async () => {
  await Note.deleteMany({});
  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();
  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

test('notes are returned as json', async() => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('content-Type', /application\/json/)
});

test('all notes are returned', async () => {
  const response = await api.get('/api/notes');
  expect(response.body).toHaveLength(initialNotes.length);
});

test('a specific note is within the returned notes', async() => {
  const response = await api.get('/api/notes');
  

  const contents = response.body.map(r => r.content);
  expect(contents).toContain(
    'Browser can execute only Javascript'
  );
});


afterAll(() => {
  mongoose.connection.close();
});
```

***Running tests one by one***
You can pass a paramater to the `jest` command to run specific files, tests or tests that include specific words

```CLI
npm test -- tests/note_api.test.js

npm test -- -t "a specific note is within the returned notes"

npm test -- -t 'notes'
```

***More tests and refactoring***
We will refactor the code to use `async/await`

Let's create a file `tests/test_helper.js`

```js
const Note = require('../models/note');

const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
];

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', date: new Date() });
  await note.save();
  await note.remove();

  return note._id.toString();
}

const notesInDb = async() => {
  const notes = await Note.find({});
  return notes.map(note => note.toJSON());
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```
***Error handling and async/await***
Use `try/catch` with `async/await` to handle errors

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  
  const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

  expect(resultNote.body).toEqual(processedNoteToView);
});

test(`a note can be deleted`, async() => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204);
  
  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  );

  const contents = notesAtEnd.map(r => r.content);
  expect(contents).not.toContain(noteToDelete.content);
});
```

***Eliminating the try-catch***
The `express-async-errors` library helps us eliminate the `try-catch` with `async/await`
The library handles everything under the hood. If an exception occurs in an async route, the execution is automatically passed to the error handling middleware.

```js
require('express-async-errors');
//code
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```

***Optimizing beforeEach function***
```js
beforeEach(async () => {
  await Note.deleteMany({});
  console.log('cleared');

  const noteObjects = helper.initialNotes
    .map(note => new Note(note));

  const promiseArray = noteObjects.map(note => note.save());

  await Promise.all(promiseArray);
});
```

***Refactoring tests***
Refactoring tests with addition of describe to separate tests

```js
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Note = require('../models/note');

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(helper.initialNotes);
});

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async() => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  });
  
  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(helper.initialNotes.length);
  });
  
  test('a specific note is within the returned notes', async() => {
    const response = await api.get('/api/notes');
  
    const contents = response.body.map(r => r.content);

    expect(contents).toContain(
      'Browser can execute only Javascript'
    );
  });
});

describe('viewing a specific note', () => {
  test('Succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToView = notesAtStart[0];
  
    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
  
    expect(resultNote.body).toEqual(processedNoteToView);
  });

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();
    console.log(validNonexistingId);
    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404);
  });

  test('fails with statuscode 400 id is invalid', async() => {
    const invalidId = `5a3d5da59070081a82a3445`;

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400);
  });
});

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }
  
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
      const notesAtEnd = await helper.notesInDb();
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);
  
      const contents = notesAtEnd.map(n => n.content);
      expect(contents).toContain(
        'async/await simplifies making async calls'
      );
  });
  
  test('fails with status code 400 if data invalid', async () => {
    const newNote = {
      important: true
    };
  
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400);
  
    const notesAtEnd = await helper.notesInDb();
  
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe('deletion of a note', () => {
  test(`succeeds with status code 204 if id is valid`, async() => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];
  
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);
    
    const notesAtEnd = await helper.notesInDb();
  
    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    );
  
    const contents = notesAtEnd.map(r => r.content);
    expect(contents).not.toContain(noteToDelete.content);
  });
});


afterAll(() => {
  mongoose.connection.close();
});
```