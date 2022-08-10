***Same origin policy and CORS***
In our context, the frontend can't communicate with the backend because the JS code of an application that runs in a browser can only communicate with a server in the same origin.

We can allow requests from other origins by using Node's `cors` middleware in the backend.
`npm install cors`, and in the `file.js` `const cors = require('cors'); app.use(cors())`

***Application to the Internet***
Add a file called `Procfile` to the backend's project root to tell Heroku how to start the application
And write in it `web: node index.js`

Now we need to use the `PORT` that the backend uses to `const PORT = process.env.PORT || 3001` Heroku uses the environment variable `PORT`

If you don't want to publicize heroku app on git
  1. Create a heroku account
  2. git init in the main driectory
  3. git add . in the main driectory
  4. git commit -m "Heroku deployment"
  5. git branch -m master
  6. heroku create
  7. heroku git:remote -a linkToHeroku
  8. git push heroku master

***Frontend production build***
When the application is deployed, we must create a production build or a version of the application for which is optimized for production.

Applications created with `create-react-app` can be production built using `npm run build`

This creates a directoy `build` which contains `index.html` which has a directory static.

***Serving static files from the backend***
One option for deploying the frontend is to copy the production build to the root of the backend repository and configure the backend to show the frontend's main page as its main page.

copy using `cp -r build ../notes-backend`

To make express show static content, the page index.html and the JS, it fetches, we need a built-in middleware from express called `static`
`app.use(express.static('build'))`

Whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address.

`Now HTTP GET requests to the address www.serversaddress.com/index.html or www.serversaddress.com will show the React frontend. GET requests to the address www.serversaddress.com/api/notes will be handled by the backend's code.`

Because of our situation, both the frontend and the backend are at the same url. We can declare `baseUrl` as a relative URL.
`const baseUrl = 'api/notes'`

After the change, we have to create a new production build and copy it to the root of the backend repository.

After deploying to heroku with the above changes and using the `static` express function, accessing the heroku site will take you to the front side of the application.

***Streamlining deploying of the frontend***
Let's add some scripts so we can automate the frontend deployment

```json
{
  "scripts": {
    //...
    "build:ui": "rm -rf build && cd ../../part2/part2a && npm run build && cp -r build ../../part3/notes-backend",
    "deploy": "git push heroku main",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",
    "logs:prod": "heroku logs --tail"
  }
}
```

***Proxy***
Changes for the production made the existing code not work for the development side as there's no file `/api/notes` in the `localhost:3000`
To solve this, you can add `"proxy": "http://localhost:3001"` in the `package.json` file
