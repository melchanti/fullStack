import Togglable from "./Togglable";
import blogService from "../services/blogs";

const Blogform = ({blog, setBlogs}) => {
  const handleLike = async (event) => {
    event.preventDefault();
    blog.likes += 1;

    await blogService.update(blog);
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  }

  const handleRemove = async (event) => {
    event.preventDefault();
    if(!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return;
    }

    await blogService.remove(blog.id);
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  }

  return (
    <>
      <div>
        url: {blog.url} {'\n'}
      </div>
      <div>
        likes: {blog.likes} <button onClick={handleLike}>like</button>
      </div>
      {
      blog.user ? 
        <div>{blog.user.name}</div> :
        <div></div>
      }
      {
        blog.user.username === JSON.parse(window.localStorage.getItem('loggedBlogUser')).username ?
        <button onClick={handleRemove}>remove</button> :
        <div></div>
      }
    </>
    
  )

}
  
const Blog = ({blog, setBlogs}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <Togglable buttonLabel="view" buttonHide="hide">
        <Blogform blog={blog} setBlogs={setBlogs}/>
      </Togglable>
    </div>  
  )
}

export default Blog