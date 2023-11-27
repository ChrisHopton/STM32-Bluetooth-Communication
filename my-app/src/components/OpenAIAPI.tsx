import React, { useState } from 'react';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    const updatedMessages = [...messages, { content: inputText }];
    fetch('http://localhost:3001/generate-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: updatedMessages }),
    })
      .then(response => response.json())
      .then(data => {
        setMessages([...updatedMessages, { content: data.content }]);
        setInputText('');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.content}</p>
        ))}
      </div>
      <input
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        type="text"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
