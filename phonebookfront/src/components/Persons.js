import React from 'react';

const Persons = ({ filteredPersons, handleDeleteButton }) => (
  <ul style={{padding:0, margin:0}}>
    {filteredPersons.map(person => 
      <li key={person.name}>
        {person.name} {person.number}
        <button onClick={() => handleDeleteButton(person.id)}>delete</button>
      </li>
    )}
  </ul>
)

export default Persons;