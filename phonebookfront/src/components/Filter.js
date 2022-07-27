import React from 'react';

const Filter = ({newFilter, onChange}) => {
  return (
    <div>filter shown with <input value={newFilter} onChange={onChange}/></div>
  );
};

export default Filter;