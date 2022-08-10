In addition to jest, we will need `react-testing-library` to test react apps
`npm install --save-dev @testing-library/react @testing-library/jest-dom`
`jest-dom` provides some nice Jest-related helper methods

Our `Note` component has the className `note` we will use this to access the component in our tests

***Rendering teh component for tests***
We will write the test in `src/components/Note.test.js` file

```js
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  };

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library');
  expect(element).toBeDefined();
});
```

We use the `render` function provided by the react-testing-library to render the component
The render method renders the component in a format that is suitable for tests without rendering them to the DOM

The object `screen` has a method `getByText` that searches for an element by text to ensure that it exists we use `toBeDefined()`

***Running tests***
In react, `npm test` command will not exit once the tests have finished, it will wait for changes to be made to the code.

To run tests normally you can type `CI=true npm test`

***Test file location***
There are two conventions
  - Store them like we did with the components
  - Store them in a separate directory

There are arguments to be made for both

***Searching for content in a component***
The react-testing-library offers many forms of investigating the content of the component

In our previous example, the test would faile if `getByText` doesn't find the element it's looking for
One of the fields returned by `render` is `container`, we can use `querySelector` on it to find the elemnt
Then use `toHaveTextContent()` to check the contents.
There are other methods `getByTestId`

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />)

  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})
```

***Debugging tests***
The object `screen` has a method `debug` that can be used to print the HTML of a component to terminal

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  screen.debug()

  // ...

})
```
You can also pass an element to the `debug` method

***Clicking buttons in tests***
`user-event` library makes simulating user input easier
`npm install --save-dev @testing-library/user-event`

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = jest.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

Notes:
  - The event handler is a `mock` function defined with Jest
  - A session is started with `userEvent.setup()`
  - clicking happens with the method `click`
  - Mock objects and functions are commonly used stub components in testing that are used for replacing dependencies of the components being tested.

***Tests for the Togglable component***
Let's add the `togglableContnet` CSS classname to the div that returns the child components

```js
const Togglable = forwardRef((props, ref) => {
  // ...

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
```

The test goes in the file `src/components/Togglable.test.js`
```js
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Togglable from './Togglable';

describe('<Togglable />', () => {
  let container;

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container;
  });

  test('renders its children', async () => {
    await screen.findAllByText('togglable content');
  });

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent');
    expect(div).toHaveStyle('display: none');
  });

  test('after clicking the button, children are displayed', async() => {
    const user = userEvent.setup();
    const button = screen.getByText('show...');
    await user.click(button);

    const div = container.querySelector('.togglableContent');
    expect(div).not.toHaveStyle('display: none');
  });
});
```

***Testing the forms***
The test for the noteForm is as follows, notice we added className `formDiv` to the `div` housing the form

```js
import React from 'react';
import { render, screen }  from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NoteForm from './NoteForm';
import userEvent from '@testing-library/user-event';

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = jest.fn();
  const user = userEvent.setup();

  render(<NoteForm createNote={createNote} />);

  const input = screen.getByRole('textbox');
  const sendButton = screen.getByText('save');

  await user.type(input, 'testing a form...');
  await user.click(sendButton);

  expect(createNote.mock.calls).toHaveLength(1);
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
});
```

***About finding the elements***
above we used `getByRole` to get the input field. We can also use `getAllbyRole` if there are multiple input fields.

Quite often input fields have a placeholdertext and we can use that in the method `getByPlaceholderText` to find the required input field.

The most flexible way of finding elements is to use the `querySelector` on the `container` object. The method takes any CSS selector.

```js
//Noteform
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          placeholder='write here note content'
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  )
}

//noteForm.test.js
test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = jest.fn()

  render(<NoteForm createNote={createNote} />) 

  const input = screen.getByPlaceholderText('write here note content')
  const sendButton = screen.getByText('save')

  userEvent.type(input, 'testing a form...')
  userEvent.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

`getByText` method gets the element by the text as it's
If we want to see if an element contains a text, we can use:
```js
const element = screen.getByText(
  'Does not work anymore :(', {exact: false}
)
```

or we can use `findByText` which returns a promise.

`queryByText` finds by text but it doesn't cause an exception if the element is not found.
```js
test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />);

  const element = screen.queryByText('do not want this thing to be rendered');
  expect(element).toBeNull();
});
```

***Test Coverage***
`CI=true npm test -- --coverage` gets the coverage of our tests.