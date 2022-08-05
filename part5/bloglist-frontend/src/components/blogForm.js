import { useState } from 'react';

const BlogForm = ({newBlog}) => {

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleNewBlogForm = async (event) => {
    event.preventDefault();
    try {
      await newBlog(title, author, url);
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch(error) {
      console.log(error.message);
    }
  }

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleNewBlogForm}>
        <div>
          title: 
          <input
            type="text"
            value={title}
            name="Title"
            placeholder='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author: 
          <input
            type="text"
            value={author}
            name="Author"
            placeholder='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url: 
          <input
            type="text"
            value={url}
            name="Url"
            placeholder='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id="create-blog" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm;