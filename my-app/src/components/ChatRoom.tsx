import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import GyroscopePlot from './gyroscopePlot';

interface ChatComponentProps {
  bluetoothMessage: string;
  onSendResponseMessage: (message: string) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ bluetoothMessage, onSendResponseMessage }) => {
  const [messages, setMessages] = useState<{ content: string, sender: 'user' | 'assistant' }[]>([]);
  const [inputText, setInputText] = useState('');
  const [useChatModel, setUseChatModel] = useState(true);
  const [userId, setUserId] = useState('');
  const [gyroData, setGyroData] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    setUserId(generateUserId());
  }, []);

  const isGyroscopeData = (message) => {
    // Implement a check to determine if the message is gyroscope data
    // For example, a simple check could be based on the format of the message
    return message.split(',').length === 3;
};

// Function to parse gyroscope data
const parseGyroscopeData = (message) => {
  const cleanedMessage = message.replace(/[\[\]\s]/g, '');
  const [x, y, z] = cleanedMessage.split(',').map(Number);
  setGyroData(prevData => [...prevData, { x, y, z }]);
  console.log("Gyroscope Data: ", { x, y, z }); // Add this line for debugging
};


const sendApiRequest = (updatedMessages) => {
  const endpoint = useChatModel ? 'http://localhost:3001/chat-generate-message' : 'http://localhost:3001/data-generate-message';

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, messages: updatedMessages }),
  })
    .then(response => response.json())
    .then(data => {
      const apiResponse = data.message || data.content;
      setMessages(prev => [...prev, { content: data.message || data.content, sender: 'assistant' }]);
      onSendResponseMessage(apiResponse);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};



const handleBluetoothMessage = (bluetoothMessage) => {
  if (!bluetoothMessage.trim()) return;

  if (isGyroscopeData(bluetoothMessage)) {
    parseGyroscopeData(bluetoothMessage);
  } else {
    // Handle regular messages
    const newMessage = { content: bluetoothMessage, sender: 'user' };
    const updatedMessages = [...messages, newMessage];
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Make an API call for regular messages
    sendApiRequest(updatedMessages);
  }
};


  const sendMessage = () => {
    if (!inputText.trim()) return;
  
    const newMessage = { content: inputText, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
  
    const endpoint = useChatModel ? 'http://localhost:3001/chat-generate-message' : 'http://localhost:3001/data-generate-message';
  
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, messages: [...messages, newMessage] }),
    })
      .then(response => {
        // Check if the response is an image
        const contentType = response.headers.get("content-type");
        //console.log("Here: ", contentType);
        if (contentType && contentType.includes("image")) {
          return response.blob();
        }
        return response.json();
      })
      .then(data => {
        if (data instanceof Blob) {
          // Convert blob to URL and set it as the message content
          const imageUrl = URL.createObjectURL(data);
          setMessages(prev => [...prev, { content: `<img src="${imageUrl}" alt="Generated Plot"/>`, sender: 'assistant' }]);
        } else {
          // Handle non-image response
          setMessages(prev => [...prev, { content: data.message || data.content, sender: 'assistant' }]);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  

  const components = {
    code({ node, inline, className, children, ...props }) {
      // Check if the content is a code block
      const isCodeBlock = className && /language-(\w+)/.test(className);
      if (inline || !isCodeBlock) {
        // Handle inline code or non-code content
        return <code className={className} {...props}>{children}</code>;
      } else {
        // Handle code blocks
        const language = className.match(/language-(\w+)/)[1];
        return (
          <SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div" {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }
    },
  };
  

  useEffect(() => {
    console.log("ChatComponent received message: ", bluetoothMessage);
    if (bluetoothMessage) {
      handleBluetoothMessage(bluetoothMessage);
    }
  }, [bluetoothMessage]);


  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10 ">
    {/* Tab container with modern styling */}
    <div className="mb-15 rounded-xl shadow-md transform -translate-y-80 top-[-5] absolute border-b bg-gray-100 z-20 mt-12">
      
      <button
        className={`px-4 py-2 text-sm font-medium ${activeTab === 'chat' ? 'border-b-2 border-blue-500 text-blue-500 rounded-s' : 'text-gray-500 hover:text-blue-500'}`}
        onClick={() => setActiveTab('chat')}
      >
        Chat
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium  ${activeTab === 'gyro' ? 'border-b-2 border-blue-500 text-blue-500 rounded-md' : 'text-gray-500 hover:text-blue-50'}`}
        onClick={() => setActiveTab('gyro')}
      >
        Gyroscope
      </button>
    </div>
  
      {/* Conditional rendering based on the active tab */}
      {activeTab === 'chat' ? (
    
        <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden ">
          <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex w-full mt-10 space-x-3 max-w-xs ${msg.sender === 'user' ? 'ml-auto justify-end' : ''}`}>
                <div className={`${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'} p-3 rounded-lg`}>
                  {msg.sender === 'gyro' ? (
                    <div key={index}>Gyroscope Data: {msg.content}</div>
                  ) : (
                    <ReactMarkdown components={components}>{msg.content}</ReactMarkdown>
                  )}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
  
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={sendMessage}
            >
              Send
            </button>
            <label className="relative inline-flex cursor-pointer items-center ml-2">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={!useChatModel}
            onChange={() => setUseChatModel(!useChatModel)}
          />
          <div
            className="peer flex h-8 items-center gap-4 rounded-full bg-orange-600 px-3 after:absolute after:left-1 after:h-6 after:w-16 after:rounded-full after:bg-white/50 after:transition-all after:content-[''] peer-checked:bg-slate-700 peer-checked:after:translate-x-full peer-focus:outline-none dark:border-slate-700 dark:bg-slate-700 text-sm text-white"
          >
            <span>Google</span>
            <span>OpenAI</span>
          </div>
        </label>
          </div>
        </div>
      ) : (
        <div className="gyroscope-plot-container">
          {gyroData && gyroData.length > 0 ? (
            <GyroscopePlot data={gyroData} />
          ) : (
            <p>No gyroscope data available.</p>
          )}
        </div>
      )}
    </div>
  );
          };
  

export default ChatComponent;

const generateUserId = () => {
  return Math.random().toString(36).substring(2, 15);
};
