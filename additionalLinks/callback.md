```js
import React, { useCallback } from 'react';

function MyComponent() {
  const handleClick = useCallback(() => {
    // handle click event
  }, []);

  return <MyChild onClick={handleClick} />
}
```

# Understanding functions equality check
A function is equal only to itself
It doesn't equal another function that does the exact same thing

# The purpose of useCallback()
```js
function MyComponent() {
  // handleClick is re-created on each render
  const handleClick = () => {
    console.log('Clicked!');
  };
  // ...
}
```

`handleClick` is a different function object on every rendering of `MyComponent`

In some cases you need to maintain a single function instance between renderings:
  1. A functional component wrapped inside `React.memo()` accepts a function object prop
  2. When the function object is a dependency to other hooks, e.g. `useEffect(..., [callback])`
  3. When the function has some internal state, e.g. when the function is debounced or throttled

`useCallback(callbackFun, deps)`: given the same dependency values `deps`, the hooks returns the same function instance between renderings (aka memoization)

# Good use case
```js
import useSearch from './fetch-items';
function MyBigList({ term, onItemClick }) {
  const items = useSearch(term);
  const map = item => <div onClick={onItemClick}>{item}</div>;
  return <div>{items.map(map)}</div>;
}
export default React.memo(MyBigList);

import { useCallback } from 'react';
export function MyParent({ term }) {
  const onItemClick = useCallback(event => {
    console.log('You clicked ', event.currentTarget);
  }, [term]);
  return (
    <MyBigList
      term={term}
      onItemClick={onItemClick}
    />
  );
}
```

