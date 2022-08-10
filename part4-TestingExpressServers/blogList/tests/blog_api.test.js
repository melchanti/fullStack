const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog.js');
const User = require('../models/user');
const { initialBlogs } = require('./blog_api_test_helper');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogPromises = initialBlogs.map(blog => {
    let blogObject = new Blog(blog);
    return blogObject.save();
  });

  await Promise.all(blogPromises);
});

describe('Viewing blogs', () => {
  test('blogs are returned as json', async() => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  
  });
  
  test('blog has id property', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('adding a new blog', () => {
  let token;
  beforeEach(async() => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukainen',
      password: 'salainen',
    };

    const addedUser = await api
      .post('/api/users')
      .send(newUser);
    
    const login = await api.post('/api/login').send({username: newUser.username, password: newUser.password});
    token = "bearer " + login.body.token;
  });

  test('Successfully create a new blog', async () => {
    const newBlog = {
      title: "Tesla is great",
      author: "Mohamad EL-Chanti",
      url: "https://tesla.com/",
      likes: 11
    };
  
    await api.post('/api/blogs').set({authorization: token}).send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    const response = await api.get('/api/blogs');
    const titles = response.body.map(b => b.title);
  
    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain('Tesla is great');
  });
  
  test('default likes to 0 when the property is not present', async () => {
    const newBlog = {
      title: "Tesla is great",
      author: "Mohamad EL-Chanti",
      url: "https://tesla.com/",
    };
  
    const response = await api.post('/api/blogs').set({authorization: token}).send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    expect(response.body.likes).toBe(0);
  
  });
  
  test('Blogs with no title are not accepted', async () => {
    const newBlog = {
      author: "Mohamad EL-Chanti",
      url: "https://tesla.com/",
    };
  
    const response = await api.post('/api/blogs').set({authorization: token}).send(newBlog)
      .expect(400);
  });
  
  test('Blogs with no url are not accepted', async () => {
    const newBlog = {
      title: "Tesla is great",
      author: "Mohamad EL-Chanti",
    };
  
    const response = await api.post('/api/blogs').set({authorization: token}).send(newBlog)
      .expect(400);
  });

  test('Blogs with no authorization are not accepted', async () => {
    const newBlog = {
      title: "Tesla is great",
      author: "Mohamad EL-Chanti",
      url: "https://tesla.com/",
      likes: 11
    };

    const response = await api.post('/api/blogs').send(newBlog)
      .expect(401);
  });
});

describe('deleting blog posts', () => {
  let token;
  beforeEach(async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukainen',
      password: 'salainen',
    };

    const addedUser = await api
      .post('/api/users')
      .send(newUser);
    
    const login = await api.post('/api/login').send({username: newUser.username, password: newUser.password});
    token = "bearer " + login.body.token;
  });

  test('succesfully delete with an id', async () => {
    
    const newBlog = {
      title: "This will be deleted",
      author: "Mohamad EL-Chanti",
      url: "https://tesla.com/",
      likes: 11
    };

    const addedBlog = await api.post('/api/blogs').set({ Authorization: token}).send(newBlog);
    await api.delete(`/api/blogs/${addedBlog.body.id}`).set({ Authorization: token })
      .expect(204);
    const response = await api.get('/api/blogs');
    const titles = response.body.map(b => b.title);
  
    expect(titles).not.toContain('This will be deleted');
  });

  test('Unsuccessfully delete a blog with an invalid id', async() => {
    const id = '2422sfsd31sf21ssdf';
    await api.delete(`/api/blogs/${id}`).set({ Authorization: token })
      .expect(400);
  
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if username is less than 3 characters in length', async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.error).toContain('User validation failed');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if username is not present', async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.error).toContain('User validation failed');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if password is less than 3 characters in length', async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'side',
      name: 'Side user',
      password: 'sa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.error).toContain('password');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if password is not present', async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'side',
      name: 'Side user',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.error).toContain('password');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});



afterAll(() => {
  mongoose.connection.close();
});