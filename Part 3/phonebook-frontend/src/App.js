import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/api/persons')
      .then(response => setPersons(response.data))
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (newName.trim()) {
      const existingPerson = persons.find(person => person.name === newName)

      if (existingPerson) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          axios
            .put(`http://localhost:3001/api/persons/${existingPerson.id}`, { number: newNumber })
            .then(response => {
              setPersons(persons.map(person => person.id === existingPerson.id ? response.data : person))
              setNewName('')
              setNewNumber('')
            })
            .catch(error => {
              alert(error.response.data.error)
            })
        }
        return
      }

      const newPerson = { name: newName, number: newNumber }
      axios
        .post('http://localhost:3001/api/persons', newPerson)
        .then(response => {
          setPersons([...persons, response.data])
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          alert(error.response.data.error)
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
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(person => (
          <li key={person.id}>{person.name} {person.number}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
