***Complex State***
The component's state or a piece of its state can be of any type.

```js
const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  });

  const handleLeftClick = () => {
    const newClicks = {
      left: clicks.left + 1,
      right: clicks.right
    };
    setClicks(newClicks);
  }

  const handleRightClick = () => {
    const newClicks = {
      left: clicks.left,
      right: clicks.right + 1
    };
    setClicks(newClicks);
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
```

It's forbidden in React to mutate state directly, since it can result in unexptected side effects.
Changing state has to always be done by setting the state to a new object.
Storing all of the state in a single state object is a bad choice for this particular application.

There are situations where it can be beneficial to store a piece of application state in a more complex data structure

```js
const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  });

  const handleLeftClick = () => setClicks(...clicks, left: clicks.left + 1);

  const handleRightClick = () => setClicks(...clicks, right: clicks.right + 1);

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
```

***Handling Arrays***
The code below, stores all the clicks in a separte state called `allClicks`

```js
const App = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'));
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'));
    setRight(right + 1);
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ' )}</p>
    </div>
  )
}
```

***Conditional Rendering***
We can return different elements using a componenet depending on a condition
```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    );
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  );
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'));
    setLeft(left + 1);
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'));
    setRight(right + 1);
  }

  return (
    <div>
      {left}
      <Button handleClick={handleLeftClick} text='left'/>
      <Button handleClick={handleRightClick} text='right'>
      {right}
      <History allClicks={allClicks}/>
    </div>
  )
}
```

***Old React***
old react didn't have hooks, React relied on classes to preserve state

***Debugging React applications***
  - `console.log()`
  - In the console, you can write the word `debugger` any where in your code to pause the execution of your application code in the Chrome developer console's debugger
  - You can also add breakpoints in the Sources tab
  - Add the `React developer tools` to google chrome

***Rules of Hooks***
Hook smust only be called from the inside of a function body that defines a React component
```js
const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

***Functions that returns a function***
Another way to define an event handler is to use a function that returns a function and execute the returning function

Functions returning functions can be utilized in defining generic functionality that can be customized parameters

```js
const App = () => {
  const [value, setValue] = useState(10);

  const setToValue = (newValue) => () => {

    console.log('value now', newValue);
    setValue(newValue);
  }

  return (
    <div>
      {value}
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
    </div>
  )
}
```

***Passing Event Handlers to Child Components***
You can pass event handlers to child components just be carefult which attribute names we use

***Don't define components within components***
This causes problems and the major problems are due to the fact that React treats a component defined inside of another component as a new component in every render.
This makes it impossible for React to optimize the component.

***Additional readings***
https://reactjs.org/docs/hello-world.html

https://egghead.io/courses/react-with-class-components-fundamentals-4351f8bb

https://egghead.io/courses/the-beginner-s-guide-to-react

