const expressRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');

expressRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

expressRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  });

  if (!request.body.likes) {
    blog.likes = 0;
  }

  if (!blog.title || !blog.url) {
    return response.status(400).end();
  }

  const users = await User.find({});

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  user.save();
  response.status(201).json(savedBlog);
});

expressRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  console.log(user);
  if (!(blog.user.toString() === user._id.toString())) {
    return response.status(401).send({
      error: 'invalid user'
    });
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
  
});

expressRouter.put('/:id', async (request, response, next) => {

  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: Number(body.likes)
  }

  const updatedNote = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    {new: true}
  );

  response.json(updatedNote)
});

module.exports = expressRouter;