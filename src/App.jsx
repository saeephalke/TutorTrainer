import { useState } from 'react'
import './App.css'
import Chatbox from './Chatbot.jsx';
import Home from './Home.jsx';
import { BrowserRouter, Routes, Route, Link } from 'react-router';
function App() {
  const [count, setCount] = useState(0)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chatbox />} />
      </Routes>
    </BrowserRouter>
  );  
}

export default App
