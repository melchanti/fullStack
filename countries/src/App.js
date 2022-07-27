import {useState, useEffect} from 'react';
import axios from 'axios';

const Country = ({ country }) => {
  const name = country.name.common;
  const capital = country.capital[0];
  const area = country.area.toFixed(0);
  const languages = Object.values(country.languages);
  const flag = country.flags.png;

  console.log(name, capital, area, languages, flag);

  return (
    <div>
      <h2>{name}</h2>
      <div>
        {capital}
        <p>area {area}</p>
      </div>
      <h3>languages</h3>
      <ul>
        {languages.map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={flag}/>
    </div>
  )

}
const Countries = ({ countries, setFilter }) => {

  const handleShowClick = (event) => {
    event.preventDefault();
    setFilter(event.target.id);
  }
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    );
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca2}>
            {country.name.common}
            <button id= {country.name.common} onClick={handleShowClick}>Show</button>
          </li>
          )
        )}
      </ul>
    );
  } else if (countries.length === 1) {
    return (
      <Country country={countries[0]} />
    )
  } else {
    return (
      <div>No matches found</div>
    )
  }
}

const App = () => {
  const [countries, updateCountries] = useState([]);
  const [filter, setFilter] = useState('');
  let filteredCountries = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(filter.toLowerCase());
  });;
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        updateCountries(response.data);
      });
  },[]);

  console.log(filteredCountries);

  return (
    <div>
      <div>find countries<input value={filter} onChange={handleFilterChange}/></div>
      <Countries countries={filteredCountries} setFilter={setFilter}/>
    </div>
  )
}

export default App;