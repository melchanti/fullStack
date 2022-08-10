We will take a look under the hood of `create-react-app`

***Bundling***
Older browsers don't know how to handle code divided into different modules.
Under the code of `npm run build` the npm script bundles the source code using webpack, which produces the following files in the build directory.
|-- asset-mainfest.json
|-- favicon.ico
|-- index.html
|-- logo192.png
|-- logo512.png
|-- manifest.json
|-- robots.txt
|-- static
    |-- css
    |   |-- main.1becb9f2.css
    |   |-- main.1becb9f2.css.map
    |-- js
        |-- main.88d3369d.js
        |-- main.88d3369d.js.LICENSE.txt
        |-- main.88d3369d.js.map

`index.html` is the main file of the application which loads the bundled JS file with a script tag.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>React App</title>
    <script defer="defer" src="/static/js/main.88d3369d.js"></script> 
    <link href="/static/css/main.1becb9f2.css" rel="stylesheet">
  </head>
    <div id="root"></div>
  </body>
</html>
```

The css file is also bundled into one file `/static/css/main.1becb9f2.css`
When webpack bundles the code, it includes all of the code that the entry point imports, and the code that its imports import and so on.
The old way of bundling was including all the JS files as scripts in `index.html` but it's slow.
These days the preferred method is to bundle the code into a single file.

We will create a suitable webpack configuration for a React application by hand from scratch.

Create a new directory with the following

|-- build
|-- package.json
|-- src
    |-- index.js
|-- webpack.config.js

The `package.json` file will include
```json
{
  "name": "webpack-part7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {},
  "license": "MIT"
}
```

Then install webpack with the command
`npm install --save-dev webpack webpack-cli`

Define the functionality of webpack in `webpack.config.js`

```js
const path = require('path');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
};

module.exports = config;
```

Define a new npm script called build that will execute the bunding with webpack
```json
// ...
"scripts": {
  "build": "webpack --mode=development"
},
// ...
```

We then run the `build` command with `npm run build` you will notice that build acknowledge the `index.js` file.

***Configuration file***
In our configuration file, we specifiy the file that will serve as the entry point for bundling the appliction.
The `output` property defines the location where the bundled code will be stored.

***Bundling react***
`npm install react react-dom`

We will write the `index.js` file and the `app.js` file
```js
//index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

//App.js
import React from 'react' // we need this now also in component files

const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}

export default App
```

We will also need `build/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="./main.js"></script>
  </body>
</html>
```

When we run the build command, we will run into a problem

***Loaders***
The error says that we may need an appropriate loader to bundle the `App.js` file.
webpack only knows how to deal with plan JS.
For renderings views in React, we are actually using JSX

We will add a loader to our application that transforms the JSX code into regular JS.
```js
const path = require('path');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
};

module.exports = config;
```

The definition for a single loader consists of three parts.

The test property specifies that the loader is for files that have names ending with `.js`.
The loader property specifies that the processing for those files will be done with `babel-loader`.
The options property is used for specifying parameters for the loader, which configure its functionality.

`npm install @babel/core babel-loader @babel/preset-react --save-dev`

We have to install two more missing dependencies to use async/await
`npm install core-js regenerator-runtime`
and import them
```js
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
```

***Transpilers***
Transpiling is to compile source code by transforming it from one language to another.
The code transpiled using babel in the previous section is a version of JS that implements the ES5 standard.
In practice, most developers use ready-made `presets` that are groups of pre-configured plugins.

we will add `@babel/preset-env` plugin that contaisn everything need to take code using all of the latest features and transpile it to code that is compatible with the ES5 standard.
```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env', '@babel/preset-react']
  }
}
```
`npm install @babel/preset-env --save-dev`

***CSS***
When using CSS, we have to use css and style loaders
`npm install style-loader css-loader --save-dev`
The job of the `css loader` is to load the CSS files
The job of the `style loader` is to generate and inject a style element that contains all of the styles of the application.

`src/index.css`
```css
.container {
  margin: 10;
  background-color: #dee8e4;
}
```
`src/index.js`
```js
import './index.css'
```

configuration
```js
{
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
      },
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
  ];
}
```

***Webpack-dev-server***
Currently, every change we make to the application we need to rebundle the application and then refresh the browser to see the changes.

The `webpack-dev-server` offers a solution to our problems
`npm install --save-dev webpack-dev-server`

define the `npm start` script
```json
{
  // ...
  "scripts": {
    "build": "webpack --mode=development",
    "start": "webpack serve --mode=development"
  },
  // ...
}
```
We will also add a new `devServer` property to the configuration object in the `webpack.config.js`
```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  devServer: {
    static: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
  },
  // ...
};
```

`npm start` will now start the dev-server at the port 3000 and when we make changes to the code, the browser will automatically refresh the page.

***Source maps***
If errors occur in your current code, the location of the error will not correspond to the actual location where the error occured.

We will ask webpack to generate a so-called `source map` for the bundle, which makes it possible to map errors that occur during the execution of the bundle to the corresponding part in the original source code.

```js
const config = {
  entry: './src/index.js',
  output: {
    // ...
  },
  devServer: {
    // ...
  },
  devtool: 'source-map',
  // ..
};
```
When changes are made to the configuration of webpack, webpack needs to be restarted.

***Minifying the code***
The size of the bundled `main.js` code is quite large and that is because webpack needs to bundle the source code for the dependenices. Loading speeds could become an issue if we were to add more external dependencies.

The optimization process for JS files is called **minification**
`UglifyJS` is one of the leading tools for minification.

Starting with webpack version 4, the minification plugin doesn't require additional configuration be to used.
It's enough to modify the npm script in the `package.json` file to specify that webpack will execute the bundling of the code in production mode.
```json
{
  "name": "webpack-part7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {
    "build": "webpack --mode=production",
    "start": "webpack serve --mode=development"
  },
  "license": "MIT",
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}
```

The output of the minification process resembles old-school C code; all of the comments and even unnecessary whitespace and newline characters have been removed, and variable names have been replaced with a single character.

***Development and production configuration***
We will add a backend to the application.
Add the following to `db.json`
```json
{
  "notes": [
    {
      "important": true,
      "content": "HTML is easy",
      "id": "5a3b8481bb01f9cb00ccb4a9"
    },
    {
      "important": false,
      "content": "Mongo can save js objects",
      "id": "5a3b920a61e8c8d3f484bdd0"
    }
  ]
}
```

We will configure the app so when used locally, the application uses the json-server available in port 3001 as its backend.
The bundled file will then be configured to use teh backend available at `https://obscure-harbor-49797.herokuapp.com/api/notes`

`App.js` will change to
```js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const useNotes = (url) => {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    axios.get(url).then( response => {
      setNotes(response.data);
    });
  }, [url]);

  return notes;
};

const App = () => {
  const [counter, setCounter] = useState(0);
  const [values, setValues] = useState([]);
  const url = 'https://obscure-harbor-49797.herokuapp.com/api/notes';
  const notes = useNotes(url);

  const handleClick = () => {
    setCounter(counter + 1);
    setValues(values.concat(counter));
  };

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>
        press
      </button>
      <div>{notes.length} notes on server {url}</div>
    </div>
  );
};

export default App;
```

The adderss is hardcoded into the application, to change that in a controlled fashion, we need to change `webpack.config.js`

```js
const path = require('path');
const webpack = require('webpack');

const config = (_, argv) => {
  console.log('argv', argv.mode);

  const BackEndUrl = argv.mode === 'production'
    ? 'https://obscure-harbor-49797.herokuapp.com/api/notes'
    : 'http://localhost:3001/notes';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(BackEndUrl)
      })
    ]
  };
};

module.exports = config;
```

We return the configuration object by a function. The function receives the two paramaters, `env` and `argv`, the second can be used for accessing the mode.

We also use webpack's `DefinePlugin` for defining global default constants that can be used in the bundled code.
The global constant is used in the following way.
```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL)

  // ...
  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick} >press</button>
      <div>{notes.length} notes on server {BACKEND_URL}</div>
    </div>
  )
}
```

***Polyfill***
`polyfill` is code that adds missinf functionality to older browsers.
Internet Explorer doesn't support the functionality of promises yet.
If you wanted to do so, you can add the `promise-polyfill`

```js
import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}
```

https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills

***Eject***
`create-react-app` tool uses webpack behind the scens.
If the default configuration isn't enough, you can `eject` the project and add your own configuration.
There's no going back after ejecting and you need to maintain all the configuration of the project yourself.
https://create-react-app.dev/docs/available-scripts/#npm-run-eject