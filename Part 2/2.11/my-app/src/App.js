import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);
  const [newName, setNewName] = useState('');
  const [persons, setPersons] = useState([]); // ✅ Add notes state

  // ✅ Fetch data once when component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => setPersons(response.data));
  }, []); // Empty dependency array ensures it runs only once

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newName.trim()) {
      setPersons([...persons, { name: newName }]);
      setNewName('');
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input 
                  value={newName} 
                  onChange={handleNameChange} 
                />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      {/* <h2>Numbers</h2>
      <ul>
        {persons.map((person, index) => (
          <li key={index}>{person.name}</li>
        ))}
      </ul> */}
      <h2>Notes</h2>
      <ul>
        {persons.map(person => (
          <li key={person.id}>{person.name} {person.number}</li> // ✅ Now notes is defined
        ))}
      </ul>
    </div>
  );
};

export default App;
