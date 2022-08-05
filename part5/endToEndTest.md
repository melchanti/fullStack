WE will look into **End to End(E2E)** tests
Configuring E2E tests is more challenging that unit or integration tests
They also tend to be quite slow, minutes or hours.
E2E tests can be flaky; some tests may pass one time and fail another, even if the code doesn't change.

***Cypress***
`Cypress` is an E2E library that has become popular recently

`npm install --save-dev cypress`
add a script by `"cypress:open": "cypress open"`

Unlike the frontend's unit tests, Cypress tests require the tested system to be running

We add a script to run the system in test mode to the backend
`"start:test":"NODE_ENV=test node index.js"`

When you run cypress for the first time `npm run cypress:open`, it creates a cypress directory
That contians an integration subdirectory where we will place our tests.

When you run that command, it creates a directory `cypress` in your root directory.
Inside that directory, you can create a directory called `e2e` To test a file it should be named with the following convention `note_app.cy.js`

```js
describe('Note app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000');
    cy.contains('Notes');
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022');
  });
})
```

***Writing to a Form***
First, let's add ids to our input fields and button so we can access them
```js
const LoginForm = ({ ... }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='username'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}
```

Then, we move visiting the site to `beforeEach` function and then we write our test for the form.
`contains` can be used to search for element by CSS selectors.

```js
describe('Note app', function() {
  beforeEach(function () {
    cy.visit('http://localhost:3000');
  });

  it('front page can be opened', function() {
    cy.contains('Notes');
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022');
  });

  it('user can login', function() {
    cy.contains('login').click();
    cy.get('#username').type('melchanti');
    cy.get('#password').type('secret');
    cy.get('#login-button').click();

    cy.contains('Mohamad EL-Chanti logged in');
  });
})
```

***Some things to note***
Eslint will give us error for using `cy` without being declared
To avoid this install `npm install eslint-plugin-cypress --save-dev`
Change the `.eslintrc.js` cto add the `cypress/globals: true`
```json
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true,
        "cypress/globals": true
    },
    "extends": [ 
      // ...
    ],
    "parserOptions": {
      // ...
    },
    "plugins": [
        "react", "jest", "cypress"
    ],
    "rules": {
      // ...
    }
}
```

***Testing new note form***
Only logged it users can create a note so we need `beforeEach` where a user can login.

```js
describe('Note app', function() {
  beforeEach(function () {
    cy.visit('http://localhost:3000');
  });

  it('front page can be opened', function() {
    cy.contains('Notes');
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022');
  });

  it('user can login', function() {
    cy.get('#login-show').click();
    cy.get('#username').type('melchanti');
    cy.get('#password').type('secret');
    cy.get('#login-button').click();

    cy.contains('Mohamad EL-Chanti logged in');
    
  });
  describe('when logged in', function() {
    beforeEach(function () {
      cy.get('#login-show').click();
      cy.get('#username').type('melchanti');
      cy.get('#password').type('secret');
      cy.get('#login-button').click();
    });

    it('a new note can be created', function() {
      cy.contains('new note').click();
      cy.get('input').type('a note created by cypress');
      cy.contains('save').click();
      cy.contains('a note created by cypress');
    })
  })
})
```

***Controlling the state of the database***
E2E tests usually don't have acess to the database.
To be able to reset the database, we can add a router to the backend.

```js
const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
```
Only use it if we are running tests
```js
// ...

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

Using the `beforeEach` we can add a new user to the testing database
```js
describe('Note app', function() {
   beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
    cy.visit('http://localhost:3000')
  })
  
  it('front page can be opened', function() {
    // ...
  })

  it('user can login', function() {
    // ...
  })

  describe('when logged in', function() {
    // ...
  })
})
```
The test below checks the funtionality of making a note important
```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    // ...

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .contains('make important')
          .click()

        cy.contains('another note cypress')
          .contains('make not important')
      })
    })
  })
})
```

***Failed login test***
To run a test only use `it.only` then remove it when you know that it's working.
To write a test that fails with the wrong password, we can use the `should` method
https://docs.cypress.io/guides/references/assertions#Common-Assertions

```js
  it.only('login fails with wrong password', function() {
    cy.contains('login').click();
    cy.get('#username').type('mluukkai');
    cy.get('#password').type('wrong');
    cy.get('#login-button').click();

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid');
    
    cy.get('html').should('not.contain', 'Matti Lukkainen logged in');
  })
```

When you are sure the test passes, you can remove `only` to run all the tests.

***Bypassing the UI***
Cypress documentation gives use the following advice: Fully test the login flow - but only once.
Instead of logging in using the form in the `beforeEach`, cypress recommends we do an HTTP request to the backend to login.
Custom commands are declared in `cypress/support/commands.js`, we can create a custom command for logging in.
```js
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body));
    cy.visit('http://localhost:3000')
  });
});
```
and use it in our testing like so
```js
describe('when logged in', function() {
  beforeEach(function() {
    cy.login({ username: 'mluukkai', password: 'salainen' })
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```

We can also make a new custome command for making a new note
```js
Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3001/api/notes',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  });

  cy.visit('http://localhost:3000');
})
```

and we can use it
```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    it('a new note can be created', function() {
      // ...
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.createNote({
          content: 'another note cypress',
          important: false
        })
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```

***Changing the importance of a note***
If we have multiple notes, then have to search the parent of the found note
```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note').parent().find('button')
    .should('contain', 'make not important')
})
```

When we find elements we can save it with `as` and access it with `@`
```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```

***Running and debugging the tests***
Cypress commands are like promises, so if we want to access their return values, we have to do it using the `then` command.

We can run cypress from teh terminal
add the scrupte `test:e2e:cypress run` to the package-json
```json
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json",
    "cypress:open": "cypress open",
    "test:e2e": "cypress run"
  },
```

and then run it with `npm test:e2e`