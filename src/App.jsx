import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main.jsx';
import Background from './components/Background.jsx';
import AlbumCalculatorApp from './features/album-calculator/AlbumCalculatorApp.jsx';

function App() {
  return (
    <BrowserRouter>
      <Background />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/album-calculator/*" element={<AlbumCalculatorApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
