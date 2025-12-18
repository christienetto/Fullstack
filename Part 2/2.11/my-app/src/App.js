import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) // ✅ Removed default placeholder, start empty
  const [newName, setNewName] = useState('') // input field for new name

  useEffect(() => {
    // ✅ Fetch persons from backend once on component mount
    axios.get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }, []) // empty dependency = run only once

  const handleNameChange = (event) => {
    setNewName(event.target.value) // update input state
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (newName.trim()) {
      const newPerson = { name: newName }
      // ✅ POST new person to backend instead of only local state
      axios
        .post('http://localhost:3001/persons', newPerson)
        .then(response => {
          setPersons([...persons, response.data]) // ✅ add returned object from backend
          setNewName('') // reset input field
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(person => (
          // ✅ using person.id as key instead of index (better React practice)
          // ✅ also removed notes logic which was incorrectly using persons array
          <li key={person.id}>{person.name} {person.number}</li>
        ))}
      </ul>
    </div>
  )
}

export default App

