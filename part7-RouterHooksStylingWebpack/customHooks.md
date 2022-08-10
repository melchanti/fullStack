***Hooks***
React offers 15 different built-in hooks

Within the last couple of years many React libraries have begun to offer hook-based apis.
Hooks rules from the documentation: 
  - Don't call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function.
  - Don't call Hooks from regular JS functions. Instead you can:
    - Call Hooks from React function components
    - Call Hooks from custom Hooks

`Create-react-app` has the readily-configured rule eslint-plugin-react-hooks that complains if hooks are used in an illegal manner.

***Custom Hooks***
According to React, the primary purpose of custom hooks is to facilitate the reuse of the logic used in components

Custom hooks are regular JS functions that can use any other hooks, as long as they adhere to the rules of hooks.
Additionally, the name of custom hooks must start with the word `use`

We can extract the counter logic we implemented earlier into its own custom hook.

```js
import { useState } from "react";
const useCounter = () => {
  const [value, setValue] = useState(0);
  
  const increase = () => {
    setValue(value + 1);
  }

  const decrease = () => {
    setValue(value - 1);
  }

  const zero = () => {
    setValue(0);
  }

  return {
    value,
    increase,
    decrease,
    zero
  }
}
```

The hook can be reused in the application that was keeping track of the amount of clicks made to the left and right buttons.

```js
const App = () => {
  const left = useCounter();
  const right = useCounter();

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}
```

By doing this, we can extract the state of the `App` component and its manipulation entirely into the `useCounter` hook.


Dealing with forms in React is somewhat tricky.
Every field of the form has its own state. In order to keep the state of the form synchronized with the data provided by the user, we have to register an appropriate `onChange` handler for each of the input elements.

We can define our own `useField` hook that simplifies the state management of the form
```js
const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  }

  return {
    type,
    value,
    onChange
  }
}
```

The hook function receives the type of the input field as a paramter. The function returns all the of the attributes required by the input: its type, value and the onChange handler.

The hook can then be used in a form like
```js
const App = () => {
  const name = useField('text');
  const born = useField('date');
  const height = useField('number');

  return (
    <div>
      <form>
        name:
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange}
        />
        <br />
        birthdate:
        <input
          type={born.type}
          value={born.value}
          onChange={born.onChange}
        />
        <br />
        height:
        <input
          type={height.type}
          value={height.value}
          onChange={height.onChange}>
      </form>
    </div>
  )
}
```

***Spread attributes***
We can simplify the above code, using the spread syntax
```js
const App = () => {
  const name = useField('text');
  const born = useField('date');
  const height = useField('number');

  return (
    <div>
      <form>
        name:
        <input {...name}/>
        <br />
        birthdate:
        <input {...born}/>
        <br />
        height:
        <input {...height}>
      </form>
    </div>
  )
}
```