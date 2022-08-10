***Introduction***
We will now implement token based authentication to the backend

The principle of token based authentication are depicted in the following sequence:
  - User starts by logging in using a login form implemented with React
  - This causes the React code to send the username and the password to the server address `/api/login` as a HTTP POST request
  - If the username and the password are correct, the server generates a token which somehow identifies the logged in user
    - The token is signed digitally, making it impossible to falsify
  - The backend responds with a status code indicating the operation was successful, and returns the token with the response
  - The brwoser saves the token, for example to the state of a React application
  - When the user creates a new note (or another application that requires authentication), the React code sends the token to the server with the request
  - The server uses the token to identify the user

`jsonwebtoken` library allows us to generate JSON web tokens.

The code for login functionality is written in `controllers/login.js`
```js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
  });

  module.exports = loginRouter;
```

The token has been digitally signed using a string from the environment variable `SECRET` as the secret.
The digital signature ensures that only parties who know the secret can generate a valid token.

Add the code to use the loginRouter in the `app.js`
```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```

Add an environment variable, `SECRET`, it can be any string.


***Limiting creating new notes to logged in users***
There are several ways to send the token from the browser to the server.
We will use the `Authroization` header
The header also tells which `authentication scheme` is used
Identifying the scheme tells the server how the attached credentials should be interpreted

We will use the bearer schem, this means the the `Authorization header` will have the value
`Bearer tokenString`

We can change creating a new note to the following code.
```js
const jwt = require('jsonwebtoken')

// ...
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

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

***Error handling***
If the token is missing or is invalid, then the `jwt.verify` method will return a `JsonWebTokenError`, let's change our `errorhandler` middleware to handle this situation.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message 
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  logger.error(error.message)

  next(error)
}
```

If the application has multiple interfaces requiring identification, JWT's validation should be separated into its own middleware. Some existing library like `express-jwt` could also be used.

***Problems of Token-based authentication***
Once the API user gets a token, the API has blind trust to the token holder. What if the access rights of the token holder should be revoked?

One solution is to limit the validity period of a token.
```js
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

Once it expires, the user can get a new token by resignning into the app.

We can extend the error handler to manage expired tokens.
```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}
```

The other solution is to save info about each token to backen database and to check for each API request if the access right corresponding to the token is still valid.
This scheme is often called a `server side session`
A key-value-database such as Redis is used for this type of schem as it has limited functionality and is faster than Relational database or MongoDb.

It's also quite usual that instead of using Authroiuzation-header, cookies are used as the mechanism for transferring the token between the client and the server.

***End notes***
Usernames, passwords and applications using token authentication must always be used over HTTPS.
