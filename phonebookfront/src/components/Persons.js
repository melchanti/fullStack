import React from 'react';

const Persons = ({ filteredPersons }) => (
  <ul style={{padding:0, margin:0}}>
    {filteredPersons.map(person => 
      <li key={person.name}>{person.name} {person.number}</li>
    )}
  </ul>
)

export default Persons;