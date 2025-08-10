// use the chatscope package for the chat UI
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message as CSMessage,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./Chatbot.css"; // import the styles for the chatbox
import { useState } from "react";

function Chatbox() {
  const [messages, setMessages] = useState([
    {
      message: "Hello!",
      sender: "computer",
      direction: "incoming"
    },
    {
      message: "Hi there!",
      sender: "user",
      direction: "outgoing"
    }
  ]);

  const [grade, setGrade] = useState(null);
  const [subject, setSubject] = useState(null);

  const gradeLevels = ["Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"
    , "College", "Graduate School"
  ];

  const handleSend = (innerMessage) => {
    setMessages([
      ...messages,
      {
        message: innerMessage,
        sender: "user",
        direction: "outgoing"
      }
    ]);
  };

  return (
    <>
      <div>
        <h2>Select a grade level and subject</h2>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="" disabled selected option>
            Select Grade Level
          </option>
          {gradeLevels.map((level, index) => (
            <option key={index} value={index}>
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
            handleSend(
              `Selected Grade: ${gradeLevels[grade]}, Subject: ${subject}`
            )
          }
        >
          Send
        </button>
        <br /> <br />
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
              onSend={handleSend}
              placeholder="Type message here"
              attachButton={false}
              sendDisabled={false} // keep send via Enter
            />
          </ChatContainer>
        </MainContainer>
      </div></>
  );
}

export default Chatbox;