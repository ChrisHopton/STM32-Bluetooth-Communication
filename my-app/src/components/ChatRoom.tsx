import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatComponentProps {
  bluetoothMessage: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ bluetoothMessage }) => {
  const [messages, setMessages] = useState<{ content: string, sender: 'user' | 'api' }[]>([]);
  const [inputText, setInputText] = useState('');
  const [useChatModel, setUseChatModel] = useState(true);

  // Function to handle messages received from Bluetooth
  const handleBluetoothMessage = (bluetoothMessage) => {
    if (!bluetoothMessage.trim()) return;

    setMessages(prevMessages => [...prevMessages, { content: bluetoothMessage, sender: 'user' }]);

    const endpoint = useChatModel ? 'http://localhost:3001/chat-generate-message' : 'http://localhost:3001/data-generate-message';

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: bluetoothMessage }),
    })
    .then(response => response.json())
    .then(data => {
      setMessages(prev => [...prev, { content: data.message || data.content, sender: 'api' }]);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = { content: inputText, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    const endpoint = useChatModel ? 'http://localhost:3001/chat-generate-message' : 'http://localhost:3001/data-generate-message';

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: inputText }),
    })
    .then(response => response.json())
    .then(data => {
      setMessages(prev => [...prev, { content: data.message || data.content, sender: 'api' }]);
      setInputText('');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  useEffect(() => {
    console.log("ChatComponent received message: ", bluetoothMessage);
    if (bluetoothMessage) {
      handleBluetoothMessage(bluetoothMessage);
    }
  }, [bluetoothMessage]);
  

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full mt-2 space-x-3 max-w-xs ${msg.sender === 'user' ? 'ml-auto justify-end' : ''}`}>
              <div className={`${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'} p-3 rounded-lg`}>
              <ReactMarkdown components={components}>{msg.content}</ReactMarkdown>
              </div>
              <span className="text-xs text-gray-500 leading-none">Just now</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-300 p-4 flex">
          <input 
            className="flex items-center h-10 w-full rounded px-3 text-sm" 
            type="text"
            placeholder="Type your message…"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={sendMessage}
          >
            Send
          </button>
          <button 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() => setUseChatModel(!useChatModel)}
          >
            Toggle Model
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
