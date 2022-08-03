const config = require('./utils/config');
const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs.js');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const logger =require('./utils/logger');
const mongoose = require('mongoose');

logger.info('Connecting to', config.mongoUrl);

const mongoUrl = config.mongoUrl;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);


app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);
module.exports = app;