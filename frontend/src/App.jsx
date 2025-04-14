// import statements for app componenets and css
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import Logs from './pages/logs.jsx';
import Layout from './layout.jsx';

function App() {
    
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/logs" element={<Logs />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App