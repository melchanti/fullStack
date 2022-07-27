import React from 'react';

const PersonForm = ({ onSubmit, newName, newPhone, handleNameChange, handlePhoneChange }) => (
  <form onSubmit={onSubmit}>
  <div>
    name: <input value={newName} onChange={handleNameChange}/>
  </div>
  <div>number:<input value={newPhone} onChange={handlePhoneChange}/></div>
  <div>
    <button type="submit">add</button>
  </div>
</form>
);

export default PersonForm;