import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/Persons' 


const PhoneBook = ({newFilter, handleFilterChange, handleSubmit, newName, newPhone, handleNameChange, handlePhoneChange, filteredPersons, handleDeleteButton}) => {

  return (
    <div>
    <h2>Phonebook</h2>

    <Filter newFilter={newFilter} onChange={handleFilterChange} />

    <h3>add a new</h3>

    <PersonForm
      onSubmit={handleSubmit}
      newName={newName}
      newPhone={newPhone}
      handleNameChange={handleNameChange}
      handlePhoneChange={handlePhoneChange}
    />

    <h3>Numbers</h3>

    <Persons filteredPersons={filteredPersons} handleDeleteButton={handleDeleteButton}/>
  </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFilter, setFiltered] = useState('');

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
      });
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
      alert(`${deletePerson.name} wasn't deleted`);
      return;
    }
    personService
      .remove(id)
      .then(message => {
        setPersons(persons.filter(person => person.id !== id));
        alert(`${deletePerson.name} is deleted`);
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
    />
  )
}

export default App;
