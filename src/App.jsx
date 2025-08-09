import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chatbox from './Chatbot.jsx';
function App() {
  const [count, setCount] = useState(0)
  //display the chatbox component
  return (
    <div className="App">
      {/* Import the Chatbox component */}
      <Chatbox />
    </div>
  );  
}

export default App
