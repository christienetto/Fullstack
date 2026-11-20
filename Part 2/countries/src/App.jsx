import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const matches = countries.filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelected(null)
  }

  const renderResult = () => {
    if (selected) {
      return <Country country={selected} />
    }
    if (search === '') {
      return null
    }
    if (matches.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }
    if (matches.length === 1) {
      return <Country country={matches[0]} />
    }
    return matches.map(c =>
      <div key={c.cca3}>
        {c.name.common} <button onClick={() => setSelected(c)}>show</button>
      </div>
    )
  }

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />
      {renderResult()}
    </div>
  )
}

export default App
