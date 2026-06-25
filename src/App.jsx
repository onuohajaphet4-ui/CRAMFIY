import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Page/Home'
import Login from './Page/Login'
import Signup from './Page/Signup';

function App() {
  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/log' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
    </Routes>
  );
}

export default App;