const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <passwprd>');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.xp8ybqf.mongodb.net/noteApp?retryWrites=true&w=majority`;

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

    /*const note = new Note({
      content: 'MongoDB is interesting',
      date: new Date(),
      important: true,
    });*/
    return Note.find({})
  })
  .then((result) => {
    result.forEach(note => {
      console.log(note);
    });
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));