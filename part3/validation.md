***Introduction***
We have been doing validation through conditional statements for our data
We can use the validation functionality available in Mongoose

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
  important: Boolean
});
```

We can use it for our post and put methods and update our errorhandler accordingly.

```js

//some code

app.post('/api/notes', (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  npte.save()
  .then(savedNote => {
    response.json(savedNote);
  })
  .catch(error => next(error));
});

///code
app.put('/api/notes/:id', (request, response, next) => {

  Note.findByIdAndUpdate(
    request.paramas.id,
    {content, important},
    {new: true, runValidators: true, context: 'query'}
  )
  .then(updatedNote => {
    respnse.json(updatedNote)
  }).catch(error => next(error))
});

///code
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error);
}
```
Validations are not done when editing a note that's why we added the extra paramaters

***Lint***
Lint is any tool that detects and flags errors in programming languages, including stylistic errors.

In JS we have `ESlint` and you can install it with `npm install eslint --save-dev`
Then run `npx eslint --init` and answer the questions

It's recommended to use a separate `npm script` file for linting

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...
    "lint": "eslint ."
  },
  // ...
}
```

A better way than to run in the terminal is to install an ESLint plugin for the editor

Some of the rules to add to the `.eslintrc.js`

```json
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ]
  },
}
````