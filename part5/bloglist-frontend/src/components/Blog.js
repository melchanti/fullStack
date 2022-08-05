import Togglable from "./Togglable";
import blogService from "../services/blogs";

const Blogform = ({blog, handleLike, handleRemove}) => {
  // const handleLike = async (event, blog) => {
  //   event.preventDefault();
  //   blog.likes += 1;

  //   await blogService.update(blog);
  //   const blogs = await blogService.getAll();
  //   setBlogs(blogs);
  // }

  // const handleRemove = async (event, blog) => {
  //   event.preventDefault();
  //   if(!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
  //     return;
  //   }

  //   await blogService.remove(blog.id);
  //   const blogs = await blogService.getAll();
  //   setBlogs(blogs);
  // }

  return (
    <>
      <div>
        url: {blog.url} {'\n'}
      </div>
      <div>
        likes: {blog.likes} <button onClick={(event) => handleLike(event, blog)}>like</button>
      </div>
      {
      blog.user ? 
        <div>{blog.user.name}</div> :
        <div></div>
      }
      {
        !blog.user ? null :
          blog.user.username === JSON.parse(window.localStorage.getItem('loggedBlogUser')).username ?
          <button onClick={(event) => handleRemove(event, blog)}>remove</button> :
          <div></div>
      }
    </>
    
  )

}
  
const Blog = ({blog, handleLike, handleRemove}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>{blog.title}</div> <div>{blog.author}</div>
      <Togglable buttonLabel="view" buttonHide="hide">
        <Blogform blog={blog} handleLike={handleLike} handleRemove={handleRemove}/>
      </Togglable>
    </div>  
  )
}

export default Blog