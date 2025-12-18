import './App.css'
import { PageOne } from './components/pages/pageone'
import { MapComponent} from './components/pages/Map'
import { Home} from './components/pages/Home'


import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'



function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link> | <Link to="/about"> Page One</Link> | <Link to="/helsinki"> Helsinki</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<PageOne />} />
                <Route path="/helsinki" element={<MapComponent />} />
            </Routes>
        </Router>
    )
}

export default App

