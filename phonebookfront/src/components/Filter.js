import React from 'react';

const Filter = ({newFilter, onChange}) => {
  const inputStyle = {
    background: "lightgrey",
    color: "green",
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
    <div style={divStyle}>filter shown with <input style={inputStyle}value={newFilter} onChange={onChange}/></div>
  );
};

export default Filter;