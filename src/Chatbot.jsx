import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message as CSMessage,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import Header from "./Header";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./Chatbot.css"; 

function Chatbox() {

  const [messages, setMessages] = useState([]);
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [student, setStudent] = useState(null);
  const [aiResponse, setAIResponse] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!student) return;
      handleComputerSend(`Hello I'm ${student.name}, a ${student.age}-year-old in ${student.grade} learning ${student.tutor_subject}.`);
  }, [student]);

  useEffect(() => {
    if (!aiResponse) {
      return;
    }
    handleComputerSend(aiResponse);
    setAIResponse(null); 
  }, [aiResponse]);

  useEffect(() => {
    if(feedback) {
      navigate('/feedback', { state: { feedbackMsg: feedback } });
    }
  }, [feedback, navigate]);


  const gradeLevels = ["Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", 
    "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "College", "Graduate School"
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


    const res = await fetch("https://tutortrainer.onrender.com/generateaimessage", {
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
      const res = await fetch("https://tutortrainer.onrender.com/generatestudent", {
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

  const generateFeedback = async () => {
    try {
      const res = await fetch("https://tutortrainer.onrender.com/generatefeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate feedback");
      }

      const data = await res.json();
      setFeedback(data.message);
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback("An error occurred while generating feedback.");  
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
    <Header/>
    <div className="page-fade">
      <div>
        <h2 className="chatbot-label">Select a grade level and subject</h2>
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

      </div>
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
              placeholder="Say something to your student..."
              attachButton={false}
              sendDisabled={false} // keep send via Enter
            />
          </ChatContainer>
          
        </MainContainer>

      </div>

      <div className="buttons-div">
        <button onClick={() => navigate('/')}> 
          Go Home
        </button>
        <button onClick={() => handleClearChat()}>
          Clear Chat
        </button>
        <button onClick={() => 
          {
            generateFeedback();
          }}>
          Get Feedback
        </button>
      </div> </div>
      
      </>
  );
}

export default Chatbox;