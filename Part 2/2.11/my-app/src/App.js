import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')


    useEffect(() => {
        axios.get('http://localhost:3001/persons')
            .then(response => setPersons(response.data))
    }, [])

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const toggleImportanceOf = (id) => {
        console.log('well that did not go well', id)
    }

    const PersonList = ({
        person, 
        toggleImportance
    }) => {
    const label = person.important
            ? 'make not important':'make important'
        return (
            <li>
            {person.name} {person.number}
            <button onClick={toggleImportance}>{label}</button>
            </li>
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (newName.trim()) {
            const newPerson = { name: newName }

            axios
                .post('http://localhost:3001/persons', newPerson)
                .then(response => {
                    console.log(response)
                    setPersons([...persons, response.data])
                    setNewName('')
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
                    <PersonList
                    key={person.id}
                    person={person}
                    toggleImportance= {() => toggleImportanceOf(person.id)}
                    />
                ))}
            </ul>
        </div>
    )
}

export default App

