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
    <div className="chatbox-wrapper">
      <MainContainer className="chatbox-main">
        <ChatContainer>
          <MessageList
            className="chatbot-message-list">
            {messages.map((msg, idx) => (
              <CSMessage
                key={idx}
                model={{
                  message: msg.message,
                  sentTime: "just now",
                  sender: msg.sender,
                  direction: msg.direction
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            onSend={handleSend}
            placeholder="Type message here"
            attachButton={false}
            sendDisabled={false}  // keep send via Enter
            />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default Chatbox;