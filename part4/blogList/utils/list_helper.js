const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((accum, blog) => accum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((accum, blog) => {
        if (blog.likes > accum.likes) {
          return blog;
        } else {
          return accum;
        }
      });
}

const mostBlogs = (blogs) => {
  const Authors = {};

  blogs.forEach((blog) => {
    if (Authors[blog.author]) {
      Authors[blog.author] += 1;
    } else {
      Authors[blog.author] = 1;
    }
  });

  return blogs.length === 0
  ? null
  : Object.keys(Authors).reduce((accum, author) => {
    if (Authors[accum.author] > Authors[author]) {
      return accum;
    } else {
      return {author, blogs: Authors[author]};
    }
  }, {"author": "N/A", "Blogs":0});
}

const mostLikes = (blogs) => {
  const Authors = {};

  blogs.forEach((blog) => {
    if (Authors[blog.author]) {
      Authors[blog.author] += blog.likes;
    } else {
      Authors[blog.author] = blog.likes;
    }
  });

  return blogs.length === 0
  ? null
  : Object.keys(Authors).reduce((accum, author) => {
    if (Authors[accum.author] > Authors[author]) {
      return accum;
    } else {
      return {author, likes: Authors[author]};
    }
  }, {"author": "N/A", "likes":0});
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}