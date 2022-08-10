const listHelper = require('../utils/list_helper');
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const emptyList = [];

const listWithMultipleBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
];

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
];

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('when list has 0 blogs, equals 0 likes', () => {
    const result = listHelper.totalLikes(emptyList);
    expect(result).toBe(0);
  });

  test('when list has multiple blogs, expect the likes to be the sume of the likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    expect(result).toBe(25);
  });

  test('another list with multiple blogs, expect the likes to be the sume of the likes', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});


describe('favorite blog', () => {
  test('when list has only one blog, return the blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual(listWithOneBlog[0]);
  });

  test('when list has 0 blogs, returns an empty object', () => {
    const result = listHelper.favoriteBlog(emptyList);
    expect(result).toEqual(null);
  });

  test('when list has multiple blogs, expect the one with the highest likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs);
    expect(result).toBe(listWithMultipleBlogs[0]);
  });

  test('another list with multiple blogs, expect the one with the highest likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toBe(blogs[2]);
  });
});

describe('Author with most blogs', () => {
  test("when list has only one blog, return the blog's author", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    expect(result).toEqual({"author": listWithOneBlog[0].author, "blogs": 1});
  });

  test('when list has 0 blogs, returns an empty object', () => {
    const result = listHelper.mostBlogs(emptyList);
    expect(result).toEqual(null);
  });

  test('when list has multiple blogs, expect the one with the highest likes', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs);
    expect(result).toEqual({"author": listWithMultipleBlogs[0].author, "blogs": 5});
  });

  test('another list with multiple blogs, expect the one with the highest likes', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({"author": blogs[3].author, "blogs": 3});
  });
});

describe('Author with most Likes', () => {
  test("when list has only one blog, return the blog's author", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    expect(result).toEqual({"author": listWithOneBlog[0].author, "likes": listWithOneBlog[0].likes});
  });

  test('when list has 0 blogs, returns an empty object', () => {
    const result = listHelper.mostLikes(emptyList);
    expect(result).toEqual(null);
  });

  test('when list has multiple blogs, expect the one with the highest likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs);
    expect(result).toEqual({"author": listWithMultipleBlogs[0].author, "likes": 25});
  });

  test('another list with multiple blogs, expect the one with the highest likes', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({"author": blogs[2].author, "likes": 17});
  });
});