`useReducer` help you separat concerns by extracting the state management out of the component.

***useReducer()***
The `useReducer(reducer, initialState)` hook accepts 2 arguments: the reducer function and the initial state
The hook then returns an array of two items: the current state and the dispatch function
```js
import { userReducer } from 'react';

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const action = {
    type: 'ActionType'
  };

  return (
    <button onClick={() => dispatch(action)}>
      Click me
    </button>
  );
}
```

The initial state is the value the state is initialized with

The action object describes how to update the state.
  - would have a property `type`
  - If the action object must carry some useful information to be used by the reducer, then you can add additional properties to the action object.

The dispatch function is a special function that dispatches and action object.
  It's created by the `userReducer()` hook
  Whenever you want to update the state, you simply call the dispatch function with the appropriate action object: `dispatch(actionObject)`

The reducer is a pure function that accepts 2 paramaters: the current state and an action object. Depending on the action object, the reducer function must update the state in an immutable manner, and return the new state.

Here are the steps:
  - As a result of an event handler or something else, you call the `dispatch` function with the action object
  - Then React redirects the action object and the current state value to the `reducer` function
  - The reducer function uses the action object and performs a state update, returning the new state
  - React then checks whether the new state differs from the previous one. If so, React re-renders the component and `userReducer()` returns the new state value


***Implementing a stopwatch***
```js
import { useReducer, useEffect, useRef } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...state, isRunning: true };
    case 'stop':
      return { ...state, isRunning: false };
    case 'reset':
      return { isRunning: false, time: 0 };
    case 'tick':
      return { ...state, time: state.time + 1 };
    default:
      throw new Error();
  }
}

const initialState = {
  isRunning: false,
  time: 0
};

function Stopwatch() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const idRef = useRef(0);
  useEffect(() => {
    if (!state.isRunning) { 
      return; 
    }
    idRef.current = setInterval(() => dispatch({type: 'tick'}), 1000);
    return () => {
      clearInterval(idRef.current);
      idRef.current = 0;
    };
  }, [state.isRunning]);
  
  return (
    <div>
      {state.time}s
      <button onClick={() => dispatch({ type: 'start' })}>
        Start
      </button>
      <button onClick={() => dispatch({ type: 'stop' })}>
        Stop
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Stopwatch />
    </div>
  );
}

export default App;
```

***Reducer mental model***
