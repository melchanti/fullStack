import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';


const PhoneBook = ({newFilter, handleFilterChange, handleSubmit, newName, newPhone, handleNameChange, handlePhoneChange, filteredPersons}) => {

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

    <Persons filteredPersons={filteredPersons} />
  </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFilter, setFiltered] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newPhone,
      id: persons.length + 1
    }
    if (persons.some(person => person.name === newPerson.name)) {
      alert(`${newPerson.name} is already added to phonebook`);
      return;
    }
    setPersons(persons.concat(newPerson));
    setNewName('');
    setNewPhone('');
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
    />
  )
}

export default App;
