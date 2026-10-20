import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Page/Home'
import Login from './Page/Login'
import Signup from './Page/Signup';
import Hub from './Page/Hub';
import Feature from './Page/Feature';
import Flow from './Page/Flow';

function App() {
  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/log' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/hub' element={<Hub/>} />
        <Route path='/flow' element={<Flow/>} />
        <Route path='/feature' element={<Feature/>} />
    </Routes>
  );
}

export default App;