***Introduction***
`npx create-react-app part1` on terminal.
then move into `part1` then type `npm start`

***Component***
The file `App.js` now defines a React component with the name App.

The command on the final line of file `index.js` renders the App's contents into the div-element, defined in teh file public/index.html, having the id value `root`.
When using React, all content that needs to be rendered is usually defined as React components

Technically, the component is defined as a JS function.

```js
const App = () => (
  <div>
    <p>Hello World</p>
  </div>
)
```
It's possible to render dynamic content inside of a componenet
```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```

***JSX***
The layout of React components is mostly written using JSX
Under the hood, JSX returned by React compnents is compiled into JS
Compiling for JSX is done by Babel

The code above looks like
```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, a, 'plus', b, ' is ', a + b
    )
  )
}
```
With JSX, you can easily embed dynamic content by writing appropriate JS within curly braces
JSX is "XML-like", which means that every tag needs to be closed
Projects created with `create-react-app` are configured to compile automatically

***Multiple components***
You can add components by defining them in the same way `App` is defined and adding them to `App`

```js
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
    </div>
  )
}

export default App
```

***props: passing data to components***
You can pass data to components using so called `props`
The function defining the component has a parameter `props`. As an argument, the parameter receives an object, which has fields corresponding to all the "props" the user of the component defines.

If the value of the prop is achieved using JS it must be wrapped with curly braces.

You will need to always have `export default App` at the end of `App.js`

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```

***Some Notes***
- Advance in very small steps and make sure that every change works as desired
- The console should always be open. If the browser reports errors, you should aim to resolve them before moving on
- `console.log()` can be used to print to the console
- React component names must be capitalized
- The content of a React component (usually) needs to contain one root element
- You can use an array of components, but React will enclose them in a `div` element
- You can also enclose all the componenets with an empty element

```js
const App = () => {
  const name = 'Peter'
  const age = 10
  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

