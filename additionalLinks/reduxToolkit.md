***`configureStore`***
```js
import { configureStore } from '@reduxjs/toolkit'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    todos: todosReducer,
    filters: filtersReducer
  }
})

export default store
```

The one call to `configureStore` above:
  - Combined `todosReducer` and `filtersReducers` into the root reducer function, which will handle a root state that looks like `{todos, filters}`
  - Created a Redux store using that root reducer
  - Automatically added the `thunk` middleware
  - Automatically added more moddleware to check for common mistakes like accidentally mutating the state
  - Automatically set up the Redux DevTools Extension connection

***`createSlice`***
`createSlice` takes an object with three main options fields:
  - `name`: a string that will be used as the prefix for generated action types
  - `initialState`: the initial state of the reducer
  - `reducers`: an object where the keys are strings, and the values are "case reducer" functions that will handle specific actions.

```js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  entities: [],
  status: null
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      // ✅ This "mutating" code is okay inside of createSlice!
      state.entities.push(action.payload)
    },
    todoToggled(state, action) {
      const todo = state.entities.find(todo => todo.id === action.payload)
      todo.completed = !todo.completed
    },
    todosLoading(state, action) {
      return {
        ...state,
        status: 'loading'
      }
    }
  }
})

export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions

export default todosSlice.reducer
```

Several things to see in this example:
  - We write case reducer functions inside the `reducers` object, and give them readable names
  - `createSlice` will automatically generate action creators that correspond to each case reducer function we provide.
  - createSlice automatically returns the existing state in the default case
  - `createSlice` allows us to safely mutate our state
  - But, we can also make immutable copies like before if we want to.

`createSlice` uses a library called `Immer` inside. Immer uses a special JS tool called a `Proxy` to wrap the data you provide, and lets you write code that "mutates" that wrapped data. But, Immer tracks all the changes you've tried to make, and then uses that list of changes to return a safely immutably updated value.

`createSlice` also lets us add a "prepare callback" to the reducer. We can pass an object that has functions named `reducer` and `prepare`. When we call the generated action creator, the `prepare` function will be called with whatever parameters were passed in. It should then create and return an object that has a `payload` field matching teh Flux Standard convention.

```js
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload
      state.entities[todo.id] = todo
    },
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.entities[todoId]
      todo.completed = !todo.completed
    },
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color }
        }
      }
    },
    todoDeleted(state, action) {
      delete state.entities[action.payload]
    }
  }
})

export const { todoAdded, todoToggled, todoColorSelected, todoDeleted } =
  todosSlice.actions

export default todosSlice.reducer
```

***Writing Thunks***
`createAsyncThunk` API will generate thunks that dispatch "loading", "request succeeded", and "request failed" actions for us.
It also generate the action types and action creators for those different request status actions, and dispatches those actions automatically based on the resulting `Promise`

`createAsyncThunk` accepts two arguments:
  - A string that will be used as the prefix for the generated action types
  - A "payload creator" callback function that should return a `Promise`. This is often written using the `async/await` syntax, since `async` fucntions automatically return a promise.

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// omit imports and state

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos')
  return response.todos
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // omit reducer cases
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        const newEntities = {}
        action.payload.forEach(todo => {
          newEntities[todo.id] = todo
        })
        state.entities = newEntities
        state.status = 'idle'
      })
  }
})

// omit exports
```
`createAsyncThunk` will generate three action types, plus a thunk function that automatically dispatches those actions when called.
In tis case, the action creators and their types are:
  - fetchTodos.pending: todos/fetchTodos/pending
  - fetchTodos.fulfilled: todos/fetchTodos/fulfilled
  - fetchTodos.rejected: todos/fetchTodos/rejected

`createSlice` accepts an `extraReducers` option, where we can have the same slice reducer listen for other action types. This field should be a callback function with a `builder` parameter, and we can call `builder.addCase(actionCreator, caseReducer` to listen for other actions.

Quick notes:
  - You can only pass one argument to the thunk when you dispatch it. If you need to pass multiple values, pass them in a single object.
  - The payload creator will receive an object as its second argument, which contains `{getState, dispatch}`, and some other useful values
  - The thunk dispatches the `pending` action before running your payload creator, then dispatches either `fulfilled` or `rejected` based on whether the `Promise` you return succeeds or fails.

