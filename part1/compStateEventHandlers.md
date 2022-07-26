***Component helper functions***
In JS, defining functions within functions is commonly used.

```js
const Hello = (props) => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

***Destructuring***
Destructuring allows us to rewrite the above code as a more compact form and saving us some time.

```js
const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age;
  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

***Page re-rendering***
To have a page rerender three times, we can write this code.

```js
let counter = 1
const refresh = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App counter = {counter}/>
  )
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

***Stateful component***
To keep record of variables that can change state, we can use `useState` from `react` like so

The function call to `useState()` adds state to the componenet and renders it initialized with the value of 0
The function returns an array that countains two items
The `counter` variable is assigned the initial value of state which is zero.
The variable `setCounter` is assigned to a function that will be used to modify the state


When the state modifying function `setCounter` is called, React re-renders the component which means that the function body of the component function gets re-executed

```js
import { useState } from 'react';

const App = ()  => {
  const [ counter, setCounter ] = useState(0);

  setTimeout(
    () => setCounter(counter + 1),
    1000
  );

  return (
    <div>{counter}</div>
  )
}

export default app
```

***Event handling***
To register an event hanlder to a click on react, use this
The event handler function can also be defined directly in the value assignment of the `onClick` attribute

```js
const App = () => {
  const [ counter, setCounter ] = useState(0);

  const handleClick = () => {
    console.log("clicked");
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick = {handleClick}>
        plus
      </button>
    </div>
  );
}
```

Event handlers are functions.
We can define event handlers directly in the value assignment of the `onClick` but generally speaking it's not a good idea.

```js
import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0);

  const increaseByOne = () => setCounter(counter + 1);

  const setToZero = () => setCounter(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick = {increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}>
        zero
      </button>
    </div>
  );
}

export default App;
```
***Passing State to Child Components***
It's recommended to write React components that are small and reusable across the application and even across projects.

When several components need to reflect the same changing data. We recommend lifting teh shared state up to their closest common ancestor.

When split into three components, the above code becomes.

```js
const Display = ({ counter}) => <div>{counter}</div>;

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
);

const App = () => {
  const [ counter, setCounter ] = useState(0);

  const increaseByOne = () => setCounter(counter + 1);
  const decreaseByOne = () => setCounter(counter - 1);
  const setToZero = () => setCounter(0);

  return (
    <div>
      <Display counter = {counter}/>
      <Button
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />
      <Button
        onClick={decreaseByOne}
        text='minus'
      />
    </div>
  );
}
```

***Changes in state cause rerendering***
When the application starts, the code in `App` is executed. This code uses `useState` hook to create the application state, setting an initial value of the variable `counter`

When one of the buttons is clicked, the event handler is executed which changes the state of the `App` component.
Calling a function which changes the state causes the component to rerender

