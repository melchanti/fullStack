# useEffect() is for side-effects

If functional component makes calculations that don't target the output value, then these calculations are named side-effects.

`useEffect()` is a hook that runs side-effect independently of rendering
side-effects include fetch requests, manipulating DOM directly, using timer functions etc.

```js
import { useEffect } from 'react';

function Greet({ name }) {
  const message = `Hello, ${name}!`;

  useEffect(() => {
    document.title = `Greetings to ${name}`;
  }, [name]);

  return <div>{message}</div>;
}
```

`useEffect(callback, [, dependencies])` hook accepts two arguments:
  - `callback` is the function containing the side-effect logic. `callback` is executed right after changes were being pushed to DOM
  - `dependencies` is an optional array of dependencies. `useEffect()` executes `callback` only if the dependencies have changed between renderings

Put your side-effect logic into the `callback`, then use the `dependencies` argument to control when you want the side-effect to run.

# Dependencies argument
`dependecies` argument lets you control when the side-effect runs, when:
- Not provided: the side-effect runs after every rendering
- An empty array, the side effect runs once after the initial rendering
- Has props or state values: the side-effect runs only when any dependency value changes.

# Component lifecycle
```js
import { useEffect } from 'react';
function Greet({ name }) {
  const message = `Hello, ${name}!`;
  useEffect(() => {
    // Runs once, after mounting
    document.title = 'Greetings page';
  }, []);
  return <div>{message}</div>;
}
```
The above side-effect is called once when the component first renders. It doesn't run at all after the first run.

```js
import { useEffect } from 'react';
function Greet({ name }) {
  const message = `Hello, ${name}!`;
  useEffect(() => {
    document.title = `Greetings to ${name}`; 
  }, [name]);
  return <div>{message}</div>;
}
```
The above side-effect runs after every render when the `name` prop is changed.

# Side-Effect cleanup

If the `callback` of `useEffect` returns a function, then `useEffect` considers this as an effect cleanup.

```js
useEffect(() => {
  // Side-effect...
  return function cleanup() {
    // Side-effect cleanup...
  };
}, dependencies);
```
- After the initial rendering, `useEffect()` invokes the callback having the side-effect. `cleanup` function is not invoked
- On later renderings, before invoking the next side-effect callback, `useEffect()` invokes the `cleanup` function from the previous side-effect execution then runs the current side-effect
- After unmounting the component, `useEffect()` invokes the cleanup function from the latest side-effect.

```js
import { useEffect } from 'react';
function RepeatMessage({ message }) {
  useEffect(() => {
    const id = setInterval(() => {
      console.log(message);
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, [message]);
  return <div>I'm logging to console "{message}"</div>;
}
```

# useEffect in practice
```js
import { useEffect, useState } from 'react';
function FetchEmployees() {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    async function fetchEmployees() {
      const response = await fetch('/employees');
      const fetchedEmployees = await response.json(response);
      setEmployees(fetchedEmployees);
    }
    fetchEmployees();
  }, []);
  return (
    <div>
      {employees.map(name => <div>{name}</div>)}
    </div>
  );
}
```
