import './App.css'
import Chatbox from './Chatbot.jsx';
import Home from './Home.jsx';
import Feedback from './Feedback.jsx';
import NotFound from './NotFound.jsx';
import { BrowserRouter, Routes, Route } from 'react-router';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chatbox />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );  
}

export default App
