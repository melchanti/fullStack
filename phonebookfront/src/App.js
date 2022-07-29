import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/Persons' 


const Notification = ({ message }) => {
  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null;
  }

  return (
      <div style={notificationStyle}>
        {message}
      </div>
  );

}

const Error = ( {message}) => {
  const notificationStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null;
  }

  return (
      <div style={notificationStyle}>
        {message}
      </div>
  );
}

const PhoneBook = (props) => {
  const {
    newFilter, 
    handleFilterChange, 
    handleSubmit, 
    newName, 
    newPhone, 
    handleNameChange, 
    handlePhoneChange, 
    filteredPersons, 
    handleDeleteButton,
    errorMessage,
    notificationMessage
  } = props;
  return (
    <div>
    <h1>Phonebook</h1>
    <Error message={errorMessage} />
    <Notification message={notificationMessage} />
    <Filter newFilter={newFilter} onChange={handleFilterChange} />

    <div style={{"width":"40%", "style":"inline"}}>
    <h2>Contacts</h2>

    <Persons filteredPersons={filteredPersons} handleDeleteButton={handleDeleteButton}/>
    </div>

    <div style={{"width":"40%", "style":"inline"}}>
    <h2>Add Contact</h2>

    <PersonForm
      onSubmit={handleSubmit}
      newName={newName}
      newPhone={newPhone}
      handleNameChange={handleNameChange}
      handlePhoneChange={handlePhoneChange}
    />
    </div>

    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFilter, setFiltered] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  console.log(persons);

  useEffect(() => {
    personService
      .getAll()
      .then(initialData => {
        setPersons(initialData);
      });
  }, []);
  
  const handleUpdate = (personToEdit, phone) => {

    const editedPerson = {...personToEdit, number:phone};

    personService
      .update(editedPerson.id, editedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson));
        setNotificationMessage(`${returnedPerson.name} edited`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 3000);
      }).catch(error => {
        setErrorMessage(`${editedPerson.name} has already been removed from the server`);
        setPersons(persons.filter(person => person.id !== editedPerson.id));
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newPhone,
    }
    if (persons.some(person => person.name === newPerson.name)) {
      if (!window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        return;
      }
      handleUpdate(persons.find(person => person.name === newPerson.name), newPerson.number);
      return;
    }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewPhone('');
        setNotificationMessage(`${returnedPerson.name} created`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 3000);
      }).catch(error => {
        setErrorMessage(`${error.response.data.error}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFiltered(event.target.value);
  }

  const handleDeleteButton = (id) => {
    const deletePerson = persons.find(person => person.id === id);

    if (!window.confirm(`Delete ${deletePerson.name}?`)) {
      setNotificationMessage(`${deletePerson.name} wasn't deleted`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 3000);
      return;
    }
    personService
      .remove(id)
      .then(message => {
        setPersons(persons.filter(person => person.id !== id));
        setNotificationMessage(`${deletePerson.name} is deleted`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 3000);
      });
  }

  const reg = new RegExp(newFilter.toLowerCase());
  const filteredPersons = persons.filter(person => {

    return person.name.toLowerCase().match(reg);
  });

  return (
    <PhoneBook
      newFilter={newFilter}
      handleFilterChange={handleFilterChange}
      handleSubmit={handleSubmit}
      newName={newName}
      newPhone={newPhone}
      handleNameChange={handleNameChange}
      handlePhoneChange={handlePhoneChange}
      filteredPersons={filteredPersons}
      handleDeleteButton={handleDeleteButton}
      errorMessage={errorMessage}
      notificationMessage={notificationMessage}
    />
  )
}

export default App;
