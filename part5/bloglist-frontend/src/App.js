import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/blogForm';
import Togglable from './components/Togglable';

const loginForm = ({handleLogin, username, setUsername, password, setPassword}) => (
  <div>
    <h2>log in to application</h2>
    <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form> 
  </div>
)

const blogsContent = ({blogs, setBlogs}) => {
  blogs.sort((a, b) => b.likes-a.likes);

  return (
    <div>
      <h2>blogs</h2>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} setBlogs={setBlogs}/>
      )}
    </div>
  )
}
const loggedInDisplay = ({user, blogs, handleLogout, newBlog, setBlogs}) => (
  <div>
    <div>
      {user.name} logged in<button onClick={handleLogout}>logout</button>
    </div>
    <Togglable buttonLabel="new blog" buttonHide="cancel">
      <BlogForm newBlog={newBlog}/>
    </Togglable>
    
    {blogsContent({blogs, setBlogs})}
  </div>
)

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem('loggedBlogUser')) {
      setUser(JSON.parse(window.localStorage.getItem('loggedBlogUser')));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({username, password});
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('wrong credentials');
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
    
  }

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogUser');
    setUser(null);
  }

  const newBlog = async (title, author, url) => {
    try {
      const blog = await blogService.create({title, author, url});
      setNotificationMessage(`${blog.title} created`);
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000);
    } catch (exception) {
      setErrorMessage(`${exception.message}`);
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
  }

  return (
    <div>
      <Notification errorMessage={errorMessage} notificationMessage={notificationMessage} />
      {user === null ? 
        loginForm({handleLogin, username, setUsername, password, setPassword}) :
        loggedInDisplay({user, blogs, handleLogout, newBlog, setBlogs})
      }
      
    </div>
  )
}

export default App
