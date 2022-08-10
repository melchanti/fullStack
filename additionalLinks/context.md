React context provides data to components no matter how deep they are in the component tree.

***How to use the context***
Three steps:
  1. Creating the context
    ```js
    import { createContext } from 'react';
    const Context = createContext('Default value');
    ```
  2. Providing the context
    `Context.Provider` component available on the context instance is used to provide the context to its child components, no matter how deep they are.

    Use the `value` prop available on the `Context.Provider` to set the value of the Context
    ```js
    function Main() {
      const value = 'My Context Value';
      return (
        <Context.Provider value={value}>
          <MyComponent />
        </Context.Provider>
      );
    }
    ```

    All the components that would like to consume the context have to be wrapped inside the provider component.

  3. Consuming the context in two ways
      First way
      ```js
      import { useContext } from 'react';
      function MyComponent() {
        const value = useContext(Context);
        return <span>{value}</span>;
      }
      ```
      The hook returns the value of the context and makes sure to rerender the component when the context value changes


      Second way
      use a render function supplied as a child to `Conext.Consumer`
      ```js
      function MyComponent() {
        return (
          <Context.Consumer>
            {value => <span>{value}</span>}
          </Context.Consumer>
        );
      }
      ```

  You can have as many consumers as you want for a single context.
  If the context value changes by changing the `value` prop of the provider `<Context.Provider value={value} />, then all consumers are immediately notified and re-rendered.

***When do yu need context***
The main idea of using the context is to allow your components to access some global data and re-render when that global data is changed.

The context can hold:
  - global state
  - theme
  - application configuration
  - authenticated user name
  - user settings
  - preferred language
  - a collection of services

Two problems with context:
  - complexity
  - makes it more difficult to unit test the components.

***Use Case***
`props drilling` is when an ancestor passes a value to one of its desendants but not the direct descendant.
All the descendants betwen the ancestor and the descendant that needs the value will need to pass that same value.

This is a situation where context is handy

```js
import { useContext, createContext } from 'react';
const UserContext = createContext('Unknown');
function Application() {
  const userName = "John Smith";
  return (
    <UserContext.Provider value={userName}>
      <Layout>
        Main content
      </Layout>
    </UserContext.Provider>
  );
}
function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
}
function Header() {
  return (
    <header>
      <UserInfo />
    </header>
  );
}
function UserInfo() {
  const userName = useContext(UserContext);
  return <span>{userName}</span>;
}
```

***Updating the context***
The React Context API doesn't provide a dediated method to update the context value from consumer components.

```js
import { createContext, useState, useContext, useMemo } from 'react';
const UserContext = createContext({
  userName: '',
  setUserName: () => {},
});
function Application() {
  const [userName, setUserName] = useState('John Smith');
  const value = useMemo(
    () => ({ userName, setUserName }), 
    [userName]
  );
  
  return (
    <UserContext.Provider value={value}>
      <UserNameInput />
      <UserInfo />
    </UserContext.Provider>
  );
}
function UserNameInput() {
  const { userName, setUserName } = useContext(UserContext);
  const changeHandler = event => setUserName(event.target.value);
  return (
    <input
      type="text"
      value={userName}
      onChange={changeHandler}
    />
  );
}
function UserInfo() {
  const { userName } = useContext(UserContext);
  return <span>{userName}</span>;
}
```

