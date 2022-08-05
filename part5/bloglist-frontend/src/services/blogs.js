import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = (tokenToBeSet) => {
  let token = `bearer ${tokenToBeSet}`;
  return token;
}

const create = async newBlog => {
  const token = JSON.parse(window.localStorage.getItem('loggedBlogUser')).token;
  const config = {
    headers: { Authorization: `bearer ${token}`}
  }
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
}

const update = async newBlog => {
  const response = await axios.put(`${baseUrl}/${newBlog.id}`, newBlog)
  return response.data;
}

const remove = async id => {
  let token = JSON.parse(window.localStorage.getItem('loggedBlogUser')).token;
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config);

  return response.data;
}

const toBeExported = { getAll, setToken, create, update, remove }
export default toBeExported;