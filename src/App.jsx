import { useState } from 'react'
import './App.css'
import Chatbox from './Chatbot.jsx';
import Home from './Home.jsx';
import Feedback from './Feedback.jsx';
import { BrowserRouter, Routes, Route } from 'react-router';
function App() {
  const [count, setCount] = useState(0)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chatbox />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );  
}

export default App
