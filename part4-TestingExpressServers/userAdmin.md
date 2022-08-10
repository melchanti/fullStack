There's a one-to-many relationship between the user and notes
The natural choise in our case is to save users in their own collection

***References across collections***
On average, relational databases offer a more-or-less suitable way of organizing data for many applications.

Below are three options for connecting tables in a document database.

```js
//Reference the user id in the notes collection.
[
  {
    username: 'mluukkai',
    _id: 123456,
  },
  {
    username: 'hellas',
    _id: 141414,
  },
];

[
  {
    content: 'HTML is easy',
    important: false,
    _id: 221212,
    user: 123456,
  },
  {
    content: 'The most important operations of HTTP protocol are GET and POST',
    important: true,
    _id: 221255,
    user: 123456,
  },
  {
    content: 'A proper dinosaur codes with Java',
    important: false,
    _id: 221244,
    user: 141414,
  }, 
]

//Document ids stored in the user's collection as an array
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [221212, 221255],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [221244],
  },  
]

// Nest the entire notes array as part of the document in the users collection
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [
      {
        content: 'HTML is easy',
        important: false,
      },
      {
        content: 'The most important operations of HTTP protocol are GET and POST',
        important: true,
      },
    ],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [
      {
        content:
          'A proper dinosaur codes with Java',
        important: false,
      },
    ],
  },
]
```

The chosen schema must be one which supports the use cases of the application the best.
Often, it's difficult to choose a correct schema for your application as you don't know in the beginning what the application use cases will be.

***Mongoose schema for users***
In our case, we make the decision to store the ids of the notes created by the user in the user document.
We define the model for representing a user in the `models/user.js` file.

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
```

The ids of the notes are stored within the user document as an array of Mongo ids.
The type of the field is ObjectId that references note-style documents. Mongo doesn't know that this is a field that refrences notes, the syntax is purely related and defined by Mongoose.

In addition, we expand the `models/note.js` so that the note contains information about the user who created it
```js
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
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
```

***Creating users***
We will create a route for creating users
The user has a unique username, name and a passwordHash
The password hash is the output of a one-way hash function applied to the user's password

First, let's install `bcrypt` for generating password hashes
`npm install bcrypt`

We will add the routes to deal with users in a new file `controllers/users.js`
```js
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
```

The password sent with the request isn't saved, we store the hash of the password that is generated with the `bcrypt.hash` function



To use it in the `app.js` file, add it as a middleware
```js
const usersRouter = require('./controllers/users');
// ...
app.use('/api/users', usersRouter);
```

We will write automated tests to test the users. and add `usersInDb` to the `tests_helper.js`
```js
// note_api.test.js
const bcrypt = require('bcrypt')
const User = require('../models/user')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

//tests_helper.js
const User = require('../models/user')

// ...

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}
```
We will add one more test to verify that a user with the same username can't be created.

```js
describe('when there is initially one user in db', () => {
  // ...

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})
```

test-driven development(TDD) is where tests for new functionality are written before the functionality is implemented

To implement the functionality for a unique user we add the following code to teh `controllers/users.js` file. In addition to adding a route for getting all users.

```js
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = usersRouter;
```

***Creating a new note***
The code for creating a new note has to be updated so that the note is assigned to the user who created it.

```js
const User = require('../models/user')

//...

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  
  response.json(savedNote)
})
```

***populate***
With join queries in Mongoose, nothing can guarantee the state between teh collections being joined is consistent, meaning that if we make a query that joins the user and notes collections, the state of the collections may change during the query.

We use `populate` method in mongoose

The below code using `populate` populates the notes in the array of the `user` and populates the user information in the place of the `user` field in the notes collection.

```js
//controllers/notes.js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
});

//controllers/users.js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 })

  response.json(users)
});
```

It's important to note that the database doesn't actually know that the ids stored in the userfield of notes reference documents in the user collection.
The functionality of the populate method of Mongoose is based on the fact that we have defined "types" to the references in the Mongoose schema with teh `ref` option

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```