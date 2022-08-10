***Ready-made UI libraries***
ready-made "UI framework" is one of the ways to add style to an application.

`Bootstrap` toolkit is one of the widely popular UI frameworks.
There are a few different React versions of Bootstrap like `reactsrap` and `react-bootstrap`

We will continue working with the react router app.

***React Bootstrap***
`npm install react-bootsrap`

Next, we will add a link to the CSS stylesheet inside `index.html`
```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
    crossOrigin="anonymous"
  />
  // ...
</head>
```

In Bottstrap, all of the contents of the application are typically rendered inside of a `container`.
In practice, we can give the root `div` element of the application the `container` class attribute.
```js
const App = () => {
  // ...

  return (
    <div className="container">
      // ...
    </div>
  )
}
```

For the Notes component, we will import the React Bootstrap component `Table.

```js
import { Table } from 'react-bootstrap';
const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>
    <Table striped>
      <tbody>
        {notes.map(note =>
          <tr key={note.id}>
            <td>
              <Link to={`/notes/${note.id}`}>
                {note.content}
              </Link>
            </td>
            <td>
              {note.user}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
)
```

We can also improve the form for the Login component

```js
import { Table, Form, Button } from 'react-bootstrap'

let Login = (props) => {
  // ...
  return (
    <div>
      <h2>login</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
          />
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
          />
          <Button variant="primary" type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
)}
```

We can also add the `Alert` component to add notifications.
```js
<div className="container">
  {(message &&
    <Alert variant="success">
      {message}
    </Alert>
  )}
  // ...
</div>
```

You can also use the Navigation structure of the process.

```js
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/">home</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/notes">notes</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/users">users</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        {user
          ? <em style={padding}>{user} logged in</em>
          : <Link style={padding} to="/login">login</Link>
        }
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>
```

Bootstrap and a large majority of existing UI frameworks produce responsive designs, meaning that the resulting applications render well on a variety of different screen sizes.

***Material UI***
`MaterialUI` is another library that can be used with React, which implements the material design visual languaged developed by Google.

`npm install @mui/material @emotion/react @emotion/styled`

Then add the following link to `index.html`
```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  // ...
</head>
```

Lookup the library but we will use `MaterialUI` to style the above changes with `bootstrap.

One less pleasant feature of Material UI is that each component has to be impored separately.

```js
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'
```

The material UI library doesn't provide a sepcial component for the form, rather use the `form` html component but it provides the fields like `TextField` and `Button`

Notification is also displayed with the `Alert` component but is more stylish.

The imports that we will need to implement the above are.
```js
import { 
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  Alert,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
```

`AppBar`, `Toolbar`, `Button`, and `IconButton` are used to implement the navigation bar

***Closing thoughts***
You could use the React UI libraries or the regular libraries.
Using the React libraries are more helpful as it reduces the amount of JS dependenicies
However, the API may have glitches.

***Other UI frameworks***
https://bulma.io/
https://ant.design/
https://get.foundation/
https://chakra-ui.com/
https://tailwindcss.com/
https://semantic-ui.com/
https://mantine.dev/

***Styled components***
```js
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`

const Login = (props) => {
  // ...
  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username:
          <Input />
        </div>
        <div>
          password:
          <Input type='password' />
        </div>
        <Button type="submit" primary=''>login</Button>
      </form>
    </div>
  )
}
```

Styled components have seen a consistent growth in popularty and quite allot of people consider it to be the best way of defining styles in React applications.