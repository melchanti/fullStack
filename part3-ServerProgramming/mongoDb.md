***Debugging Node Applications***

Debugging can be run with VS code.
It can also be done on chrome by typing `node --inspect index.js`
Question everything
Stop and fix bugs as you encounter them don't wait and hope.

***MongoDB***
MongoDB is a document database
After creating your account on MongoDB, you can install `mongoose` library and use it in your code.

A simple code could look like this

```js
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <passwprd>');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.xp8ybqf.mongodb.net/?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected');

    const note = new Note({
      content: 'HTML is Easy',
      date: new Date(),
      important: true,
    });

    return note.save();
  })
  .then(() => {
    console.log('note saved!');
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
```
The above code assumes that you will provide the password with the run command
You can run the command using `node filename.js <password>`

You can change the database that you write to by changing the url

``mongodb+srv://fullstack:${password}@cluster0.xp8ybqf.mongodb.net/DATABASENAME?retryWrites=true&w=majority``

mongoDB automatically creates a new database when an application tries to connect to a database that doesn't exist yet.

***Schema***
First we define the schema of a note that is stored in `noteSchema` variable.
In the `Note` model definition, the first paramater is the singular name of the model.
Mongoose convention is to automatically name collections as the plural when the schema refers to them in the singular. Hence the collection name will be `notes`

Document databases like Mongo are schemaless meaning the database doesn't care about the structure of the data.

The idea behind Mongoose is that the data stored in the database is given a schema at the level of the application that defines the shape of the documents stored in any given collection.

***Creating and Saving objects***
Models are so-called constructor functions that create new JS objects based on the provided paramaters.
Since the objects are created with the model's constructor function, they have all the properties of the model including `save`.
The `save` method can be provided with the event handler with the `then` method.
```js
note.save().then(result => mongoose.connection.close());
```

If the connection is never closed, the program will never finish its execution

***Fetching objects from the database***
To fetch objects we can use 

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

The objects are retrieved with the `find` method of the `Note` model.
We could restrict our search to only include important notes like this
```js
Note.find({ important: true }).then(result => {
  // ...
});
```

***Backend connected to a database***
We can modify the objects returned by Mongoose by modifying the `toJSON` method of the schema, which is used on all instances of the models produced with that schema

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});
```

and then respond with the `toJSON` method
```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  });
});
```

***Database configuration into its own module***
We would create a directory called `models` and inside it a file called `note.js`

Inside the file, the following code would reside.

```js
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('connecting to', url);
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
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

Add `const Note = require('./models/note')` to `index.js`

Notice above that we are using an environment variable for the `url`
There are many ways to define environment variables. We will use `dotenv`
To use the `dotenv` we create `.env` file inside the root of the project
The .env file would include
```
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.xp8ybqf.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

You can use the environment variables using `process.env.variable` after requiring `dotenv` like this `require('dotenv').config`
Make sure you require `dotenv` before any code or modules that need it.
When you start using the environmnet variables, you need to add them to heroku from the dashboard.
or command line
`heroku config:set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'`

***Using database in route handlers***
Creating a new node becomes this:
```js
app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: 'contnet missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then(savedNode => {
    response.json(savedNote);
  });
});
```

Fetching an individiual note becomes
```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note);
  });
});
```

***Error handling***
The code below handles finding an that doesn't have a node and a rejection of `findById` method.

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if(note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      response.status(500).end();
    });
});
```

If the format of the id is incorrect, we need to specify that as an error 400 not 500

Correction to the above code becomes
```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})
```

***Moving error handling into middleware***
We can change the code for the route to pass the erorr forward using the `next` paramater for the handler.

```js
app.get('/api/notes/:id', (request, response, next) => {
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
```
If `next` was called without a paramater, then the execution would simply move onto the next route or middleware.
If the `next` function is called with a paramater, then the execution will continue to the error handler middleware.

Our errorhandler will check for one instance. In all other situations, it'll pass the error forward to the default Express error handler.
Note that the error handling middleware has to be the last loaded middleware.

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: "malformatted id" })
  }

  next(error);
}

app.use(errorHandler);
```

***The order of middleware loading***
The execution order of middleware is the same as the order that they are loaded into express with the `app.use` function.

The order for ours should be

```js
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);
//routes
app.use(unknownEndpoint);
app.use(errorHandler);
```

***Other functionalities***
Delete a note
```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});
```

Toggling for importantce, use `findByIdAndUpdate`
```js
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote);
    })
    .catch(error => next(error));
});
```

The method receives a regular object and not a `Note` object.

***Deploying the database backend to production***
