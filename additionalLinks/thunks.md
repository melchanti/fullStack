***Thunk Overview***
  ***What is a thunk***
  "thunk" is a prgoramming term that means a piece of code that does some delayed work.

  For Redux, "thunks" are a pattern of writing functions with logic inside that can interact with a Redux store's `dispatch` and `getState` methods.

  Using thunks requires the `redux-thunk` middleware to be added to the Redux store as part of its configuration.
  Thunk are the standard approach for writing async logic in Redux apps and can be used for variety of tasks

  ***Writing Thunks***
  A thunk function accepts two arguments: the Redux store `dispatch` method, and the Redux store `getState` method.
  Thunk functions are not called by code but are passed to `store.dispatch()`

  In the same way that Redux code uses action creators to generate action objects for dispatching instead of writing action objects by hand, we normally use thunk action creators to generate the thunk functions that are dispatched.

  ```js
  export const fetchTodoById = todoId => async dispatch => {
    const response = await client.get(`/fakeApi/todo/${todoId}`);
    dispatch(todosLoaded(response.todos));
  }
  ```

  The thunk is dispatched by calling the action creator, in the same way as you'd dispatch any other Redux action.

  ```js
  function TodoComponent({ todoId }) {
    const dispatch = useDispatch();

    const onFetchClicked = () => {
      dispatch(fetchTodoById(todoId));
    }
  }
  ```

  ***Why Use Thunk***
  Thunks allow us to write additional Redux-related logic separate from a UI layer. This logic an include side effects, such as async requests or generating random values.

  Redux reducers must not contain side effects, but real applications require logic that has side effects.
  In a sense, a thunk is a loophole where you can write any code that needs to interact with the Redux store, ahead of time, without needing to know which Redux store will be used.

  ***Thunk use cases***
  Most common use cases are:
    - Moving complex logic out of components
    - Making async requests or other async logic
    - Writing logic that needs to dispatch multiple actions in a row or over time
    - Writing logic that needs access to `getState` to make decisions or include other state values in an action.
  
  Thunks are "one-shot" functions, with no sense of a lifecycle.

***Redux Thunk Middleware***
If you are not using `configureStore`
The thunk middleware can be added to a store manually, that can be done by passing the thunk middleware to `applyMiddleware()` as part of the setup process

  ***How does the Middleware work***
  Redux middlewares are all written as a series of 3 nested functions:
    - The outer function receives a "store API" object with `{dispatch, getState}`
    - The middle function receives the `next` middleware in the chain (or the actual `store.dispatch` method)
    - The inner function will be called with each `action` as it's passed through the middleware chain.
  
  Below is the source of the actual thunk middleware
  ```js
  // standard middleware definition, with 3 nested functions:
// 1) Accepts `{dispatch, getState}`
// 2) Accepts `next`
// 3) Accepts `action`
const thunkMiddleware =
  ({ dispatch, getState }) =>
  next =>
  action => {
    // If the "action" is actually a function instead...
    if (typeof action === 'function') {
      // then call the function and pass `dispatch` and `getState` as arguments
      return action(dispatch, getState)
    }

    // Otherwise, it's a normal action - send it onwards
    return next(action)
  }
  ```

  In other words:
    - If you pass a function into `dispatch`, the thunk middleware sees that it's a function instead of an action object, intercepts it, and calls that function with `(dispatch, getState)` as its arguments
    - If it's a normal action object (or anything else), it's forwarded to the next middleware in the chain

  
  ***Injecting Config Values Into Thunks***
  You can create a custom instanc of the thunk middleware at setup time, and inject an "extra argument" into the middleware.
  The middleware will then inject that extra value as the third argument of every thunk function.
  It's useful for injecting API service layer into thunk functions, so that they don't have hardcoded dependencies on the API methods.

  ```js
  // Thunk setup with extra argument
  import thunkMiddleware from 'redux-thunk';

  const serviceApi = createServiceApi('/some/url');

  const thunkMiddlewareWithArg = thunkMiddleware.withExtraArgument({ serviceApi });

  // Thunk extra argument with configureStore
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { serviceApi }
        }
      })
  });

  // Thunk function with extra argument
  export const fetchTodoById =
    todoId => async (dispatch, getState, extraArgument) => {
      const { serviceApi } = extraArgument;
      const response = await serviceApi.getTodo(todoId);
      dispatch(todosLoaded(response.todos));
    }
  ```

***Thunk Usage Patterns***
  ***Dispatching Actions***
  ```js
  // An example of a thunk dispatching other action creators,
  // which may or may not be thunks themselves. No async code, just
  // orchestration of higher-level synchronous logic.
  function complexSynchronousThunk(someValue) {
    return (dispatch, getState) => {
      dispatch(someBasicActionCreator(someValue))
      dispatch(someThunkActionCreator())
    }
  }
  ```

  ***Accessing State***
  ```js
  //conditional dispatching based on state
  const MAX_TODOS = 5

  function addTodosIfAllowed(todoText) {
    return (dispatch, getState) => {
      const state = getState()

      // Could also check `state.todos.length < MAX_TODOS`
      if (selectCanAddNewTodo(state, MAX_TODOS)) {
        dispatch(todoAdded(todoText))
      }
    }
  }

  // Checking state after dispatch
  function checkStateAfterDispatch() {
    return (dispatch, getState) => {
      const firstState = getState()
      dispatch(firstAction())

      const secondState = getState()

      if (secondState.someField != firstState.someField) {
        dispatch(secondAction())
      }
    }
  }

  // actions containing cross-slice data
  // One solution to the "cross-slice state in reducers" problem:
  // read the current state in a thunk, and include all the necessary
  // data in the action
  function crossSliceActionThunk() {
    return (dispatch, getState) => {
      const state = getState()
      // Read both slices out of state
      const { a, b } = state

      // Include data from both slices in the action
      dispatch(actionThatNeedsMoreData(a, b))
    }
  }
  ```

  ***Async Logic and Side Effects***
  ```js
  // async request with promise chaining
  function fetchData(someValue) {
    return (dispatch, getState) => {
      dispatch(requestStarted())

      myAjaxLib.post('/someEndpoint', { data: someValue }).then(
        response => dispatch(requestSucceeded(response.data)),
        error => dispatch(requestFailed(error.message))
      )
    }
  }

  // error handling with async/await
  function fetchData(someValue) {
    return async (dispatch, getState) => {
      dispatch(requestStarted())

      // Have to declare the response variable outside the try block
      let response

      try {
        response = await myAjaxLib.post('/someEndpoint', { data: someValue })
      } catch (error) {
        // Ensure we only catch network errors
        dispatch(requestFailed(error.message))
        // Bail out early on failure
        return
      }

      // We now have the result and there's no error. Dispatch "fulfilled".
      dispatch(requestSucceeded(response.data))
    }
  }
  ```

  ***Returning Values from thunks***
  By default, `store.dispatch(action)` returns the actual action object.
  Middleware can override the return value being passed back from `dispatch`, and substitute whatever other value they want to return.

  ```js
  // Awaiting a thunk result promise
  const onAddTodoClicked = async () => {
    await dispatch(saveTodo(todoText))
    setTodoText('')
  }

  // Reusing thunks for selecting data
  // In your Redux slices:
  const getSelectedData = selector => (dispatch, getState) => {
    return selector(getState())
  }

  // in a component
  const onClick = () => {
    const todos = dispatch(getSelectedData(selectTodos))
    // do more logic with this data
  }
  ```

***Using `createAsyncThunk`***
`createAsyncThunk` API abstracts the process of generating three different action types, dispatching them based on a `Promise` lifecycle, and handling the errors correctly.
It accepts a partial action type string (used to generate the action types for `pending`, `fulfilled` and `rejected`), and a "payload creation callback" that does the actual async request and returns a `Promise`. It then automatically dispatches the actions befoer and after the request, with the right arguments.

This is an abstraction for the sepecific use case of async requests, and hence it doesn't address all possible use cases for thunks.

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// omit imports and state

export const fetchTodos = createAsyncThunk('todos/fetchTodos', asynct() => {
  const response = await client.get('/fakeApi/todos');
  return response.todos;
});

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // omit reducer cases
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        const newEntities = {};
        action.payload.forEach(todo => {
          newEntities[todo.id] = todo
        })
        state.entities = newEntities;
        state.status = 'idle';
      })
  }
})
```

***Fetching data with RTK Query***
RTK Query is a purpose built data fetching and caching solution for Redux apps, and can eliminate the need to write any thunks or reducers to manage data fetching.

First, create an "API slice" with definitions for the server endpoints your app will talk to. Each endpoint will auto-generate a React hook with a name based on the endpoint and request type

```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/'}),
  endpoints: builder => ({
    getPokemonByName: builder.query({
      query: (name: string) => `pokemon${name}`
    })
  })
})

export const { useGetPokemonByNameQuery } = pokemonApi;
```
Then, add the generated API slice reducer and custom middleware to the store.

```js
import { configureStore } from '@reduxjs/toolkit';

import { setupListeners } from '@reduxjs/toolkit/query';
import { pokemonApi } from './services/pokemon';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [pokemonApi.reducerPath]: pokemonApi.reducer
  },
  // Adding the api middleware enables caching, invalidation, polling, and other useful features of 'rtk-query'
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(pokemonApi.middleware)
});
```
Finally, import teh auto-generated React hook into your component and call it.

```js
import { useGetPokemonByNameQuery } from './services/pokemon'

export default function Pokemon() {
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')

  // rendering logic
}
```