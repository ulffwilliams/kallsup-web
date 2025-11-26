import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Home from './components/Home/Home.jsx';
import Calculator from './components/Calculator/Calculator.jsx';

function AlbumCalculatorApp() {
  return (
    <div className="album-calculator">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="calculator" element={<Home />} />
        <Route path="calculator/:albumName" element={<Calculator />} />
      </Routes>
    </div>
  );
}

export default AlbumCalculatorApp;
