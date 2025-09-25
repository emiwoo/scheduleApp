import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.tsx';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Welcome from './components/Welcome.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/login' element={<Login /> } />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<Welcome />} />
            </Routes>
        </BrowserRouter>      
    );
}

export default App;