// use the chatscope package for the chat UI
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message as CSMessage,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./Chatbot.css"; // import the styles for the chatbox
import { useState } from "react";
import { useEffect } from "react";

function Chatbox() {
  const [messages, setMessages] = useState([]);

  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [student, setStudent] = useState(null);
  const [aiResponse, setAIResponse] = useState(null);

  useEffect(() => {
  if (!student) return;
  handleComputerSend(`Hello I'm ${student.name}, a ${student.age}-year-old in ${student.grade} learning ${student.tutor_subject}.`);
  console.log(student);
  }, [student]);

  useEffect(() => {
    if (!aiResponse) {
      console.log("No AI response yet");
      return;
    }
    handleComputerSend(aiResponse);
    setAIResponse(null); // Reset AI response after sending
  }, [aiResponse]);


  const gradeLevels = ["Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"
    , "College", "Graduate School"
  ];


  const handleUserSend = async (innerMessage) => {
    const newHistory = [
      ...messages,
      {
        message: innerMessage,
        sender: "user",
        direction: "outgoing"
      }
    ];
    setMessages(newHistory);


    const res = await fetch("http://localhost:4000/generateaimessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newHistory,
        student: student || {}
      }),
    });

    if (!res.ok) {
      console.error("Failed to generate AI message");
      return;
    }
    const data = await res.json();
    setAIResponse(data.message);
  };


  const handleComputerSend = (innerMessage) => {
    setMessages([
      ...messages,
      {
        message: innerMessage,
        sender: "assistant",
        direction: "incoming"
      }
    ]);
  };


  const handleGenerateStudent = async () => {
    if (grade === "" || subject === "") {
      alert("Please select a grade level and enter a subject.");
      return;
    } 

    handleComputerSend(`Generating student persona in ${grade} studying ${subject}...`);

    try{
      const res = await fetch("http://localhost:4000/generatestudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grade, subject }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate student persona");
      }

      const data = await res.json();
      setStudent(data);
    } catch (error) {
      console.error("Error generating student persona:", error);
    }
  }

  const handleClearChat = () => {
    setMessages([]);
    setStudent(null);
    setAIResponse(null);
    setGrade("");
    setSubject("");
  };

  return (
    <>
      <header>
        <h2>Select a grade level and subject</h2>

        <div className="buttons-div">
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="" disabled selected option>
            Select Grade Level
          </option>
          {gradeLevels.map((level, index) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <label>
          <input
            placeholder="Choose a Subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
        <button
          onClick={() =>
            handleGenerateStudent()
          }
        >
          Create Student Persona
        </button>
      </div>

      </header>
      <div className="chatbox-wrapper">
        <MainContainer className="chatbox-main">
          <ChatContainer>
            <MessageList className="chatbot-message-list">
              {messages.map((msg, idx) => (
                <CSMessage
                  key={idx}
                  model={{
                    message: msg.message,
                    sentTime: "just now",
                    sender: msg.sender,
                    direction: msg.direction,
                  }}
                />
              ))}
            </MessageList>
            <MessageInput
              onSend={handleUserSend}
              placeholder="Type message here"
              attachButton={false}
              sendDisabled={false} // keep send via Enter
            />
          </ChatContainer>
          
        </MainContainer>

      </div>

      <footer className="buttons-div">
        <button onClick={() => window.location.href = '/'}> 
          Go Home
        </button>
        <button onClick={() => handleClearChat()}>
          Clear Chat
        </button>
        <button>
          Get Feedback
        </button></footer>
      
      </>
  );
}

export default Chatbox;