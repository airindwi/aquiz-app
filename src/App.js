import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Pastikan impor ini benar
import Quiz from './Components/Quiz';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Quiz />} /> {/* Gunakan element, bukan component */}
      </Routes>
    </Router>
  );
}

export default App;
