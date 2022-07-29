import React from 'react';

const Persons = ({ filteredPersons, handleDeleteButton }) => {

    const tableStyle = {
      background: "lightgrey",
      fontSize: 20,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      borderCollapse: "collapse",
    }
    const cellStyle = {
      background: "lightgrey",
      fontSize: 20,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      borderCollapse: "collapse",
    }

    return (
    <table style={tableStyle}>
      <tr style={cellStyle}>
        <th style={cellStyle}>Name</th>
        <th style={cellStyle}>Number</th>
        <th style={cellStyle}>Delete?</th>
      </tr >
      {filteredPersons.map(person => 
        <tr key={person.name} style={tableStyle}>
          <td style={cellStyle}>{person.name}</td>
          <td style={cellStyle}>{person.number}</td>
          <td style={cellStyle}><button onClick={() => handleDeleteButton(person.id)}>delete</button></td>
        </tr>
      )}
    </table>
  )
}

export default Persons;