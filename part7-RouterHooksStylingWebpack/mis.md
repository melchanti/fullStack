***Class Components***
Before hooks, when defining a component that uses state, one had to define it using JS's Class syntax.

```js
import axios from 'axios';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () => {
    console.log('component mounted');
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data });
    });
  }

  handleClick = () => {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )

    this.setState({ current });
  }

  render() {
    if (this.state.anecdotes.length === 0) {
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>
          {this.state.anecdotes[this.state.current].content}
        </div>
        <button onClick={this.handleClick}>next</button>
      </div>
    )
  }
}

export default App;
```

The above code is how you would write a React app without using hooks and using JS classes.
`render` method defines how and what is rendered.
Class components only contain one state. If we need multiple parts, we store the parts as properties of the state.
The state is initialized in the constructor.

The correct place to trigger the fetching of data from a server is inisde the lifecycle method `componentDidMount`, which is executed once right after the first time a component renders.

We use `setState` method to set the `state`. The method only touches the keys that have been defined in the object passed to the method as an argument.

Calling the method `setState` always triggers the rerender of the Class Component. i.e. calling the mehtod `render`.

When writing fresh code, there's no rational reason to use Class components if the project is using React with a version number of 16.8 or greater.

***Organization of code in React application***
For smaller applications organizing code:
  - components in the component directory
  - reducers in the reducers directory
  - server communication in the service directory

This is good for small project but as the project gets bigger, a differnt structure is needed.
There's no right way of doing so.
https://medium.com/hackernoon/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed

***Frontend and backend in the same repository***
We did the deployment by copying the bundled frontend code into the backend repository.
A possibly better approach would have been to deploy the frontend code separately.
There are situations where the entire application goes into a single repo.
A common approach is to put the `package.json` and the `webpack.config.js` in the root
Place the front and backend code into their own directories e.g. client and server

https://github.com/fullstack-hy2020/create-app - A starting repo for this

***Changes on the server***
Currently, the frontend doesn't monitor changes made to the server by other users until the page reloads.
One way to recognize changes is to execute `polling` meaning repeated requests to teh backend APU using for example `setInterval`

A more sophisticated approach is to use `WebSockets` which allow establishing a two-way communcation channel between the browser and the server.
The browser will need to define callback functions for situations when the server sends data about updating state using a Websocket.

Instead of using the WebSocket API, it's advisable to use the `Socket.io` library which provides various fallback options in case the browser doesn't have the full support for WebSockets.

***Virtual DOM***
When a developer uses React, they rarely or never directly manipulate the DOM.
The function defining the React component returns a set of React elements.
The React elements defining the appearance of the components of the application make up the Virtual DOM, which is stored in system memory during runtime.

With the help of the `ReactDom` library, the virtual DOM defined by the components is rendered to a real DOM that can be shown by the browser using the DOM API.
```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
```
When the state of the application changes, a new virtual DOM gets defined by the components. React has the previous version of the virtual DOM in memory and instead of directly rendering the new virtual DOM using the DOM API, React computes the optimal way to update the DOM (remove, add or modify elements in the DOM) such that the DOM reflects the new virtual DOM.

***On the role of React in applications***
React is primarly a library for managing the creation of views for an application.
React has a more narrow area of application than Angular.

***React/node-application security***
The Open Web Application Security Project publishes an annual list of the most common security risks in Web applications.
https://owasp.org/www-project-top-ten/

Injection is when text sent using a form in an application is interpreted completely differnt than the developer intended.
```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"

execute("SELECT * FROM Users WHERE name = ?", [userName])
```

The above two code statements achieve the same thing but with parametrized queries, second one, user input isn't mixed with the SQL query but the database itself inserts the input values at placeholders in the query.

First one, could be used to add another statement to the SQL query.

mongoose prevents injection attacks by sanitizing the queries.

Cross-site scripting (XSS) is an attack where it's possible to inject malicious JS code into a legitimate web appliction. The malicious code would then be executed in the browser of the victim.

One needs to remain vigilant when using libraries; if there are security updates to those libraries, it's advisable to update those libraries in one's own applications.

You can check how up to date your dependencies are using
`npm outdated --depth 0`

The best way to update the dependencies in `package.json` is to use a tool called `npm-check-updates`.
`npm install -g npm-check-updates`

To check for updates then type `npm-check-updates`

`npm audit` checks for security dependencies. It compares the version numbers in your application to a list of the version numbers of dependencies containing known security threats in a centralized error database.

Never trust data from the browser.

https://expressjs.com/en/advanced/best-practice-security.html
https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security
https://github.com/nodesecurity/eslint-plugin-security

`Helmet` is a library that includes a set of middlewares that eliminate some security vulnerablities in Express applications.
https://helmetjs.github.io/


***Current Trends***
  **Typed versions of JS**
  dynamic typing of JS variables creates annoying bugs.
  Lately, there has been an increase in the interest in static type checking. Most popular is `TypeScript`

  **Server-side rendering, isomorphic applications and universal code**
  Rendering can also be done on the server.
  When accessing the application for the first time, the server serves a prerendered page made with React.

  One motivation for server-side rendering is Search Engine Optimization(SEO). Search Engines have traditionally been very bad at recognizes JS-rendered content but the tide is turning.

  According to some, an isomorphic web application is one that performs rendering on both the front- and backend. On the other hand, universal code is code that can be executed in most environments, meaning both the frontend and the backend.

  `Next.js` is implemented on top of React and has garnered much attention and is a good option for making universal applications.

  **Progressive web apps**
  progressive web app(PWA) are web applications working as well as possible on every platform taking advantage of the best parts of those platforms. Including offline mode or slow network connection
  Since Create App 4, if PWA is desired, you will have to create a new prject using a PWA custom template
  `npx create-react-app my-app --template cra-template-pwa`

  ***Microservices***
  A microservice architecture is a way of composing the backend of an application from many separate, independent services, which communicate with each other over the network.
  An individual microservice's purpose is to take care of a particular logical functional whole.

  ***Serverless***
  In a Serverless environment, software developers can shift their programming efforts to a higher level of abstraction as there is no longer a need to programmatically define the routing of HTTP requests, database relations etc., since the cloude infrastructure provides all of this.

***Useful libraries and interesting links***
If you application handles complicated data use `lodash.
If you are handling times and dates, use `date-fns`
`Formik` and `final-form` can be used to handle forms
`recharts` and `highcharts` can be used to handle graphs
`immutable.js` provides immutable implementation for some data structures.
`Redux-saga` provides an alterantive way to make async. actions for `redux-thunk`
`React Google Analytics` can be used to gather analytics for single-page applications
`React Native` library
Management and bundling of JS projects can be handled with `Webpack` or `Parcel` or `Vite`
`Rome` library aspires to be an all-encompassing toolchain to unify linter, compiler, bundler, and more.

https://reactpatterns.com/
https://www.reactiflux.com/ -- chat community on Discord.