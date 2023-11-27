const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

const port = 3001;

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.API_KEY;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

// Function to generate message
async function generateMessage(messages) {
  const result = await client.generateMessage({
    model: MODEL_NAME,
    prompt: { messages },
  });

  return result[0].candidates[0].content;
}

// Route for generating message
app.post('/generate-message', async (req, res) => {
  try {
    const messages = req.body.messages; // Expecting 'messages' in the request body
    const responseContent = await generateMessage(messages);
    res.json({ content: responseContent });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});




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
