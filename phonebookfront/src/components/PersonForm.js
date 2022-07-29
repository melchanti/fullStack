import React from 'react';

const PersonForm = ({ onSubmit, newName, newPhone, handleNameChange, handlePhoneChange }) => {
  const inputStyle = {
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginRight: 0,
    marginLeft: "auto",
  }

  const buttonStyle = {
    color: "green",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "25%",
  }

  const divStyle = {
    fontSize: 20,
    padding: 10,
    marginBottom: 10,
    width: "50%",
    marginRight: "auto",
    marginLeft: 0,
  }
  return (
  <form onSubmit={onSubmit}>
    <div style={divStyle}>
      name: <input style={inputStyle} value={newName} onChange={handleNameChange}/>
    </div>
    <div style={divStyle}>number:<input style={inputStyle} value={newPhone} onChange={handlePhoneChange}/></div>
    <div>
      <button style={buttonStyle} type="submit">add</button>
    </div>
  </form>
  );
}

export default PersonForm;