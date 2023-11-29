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
  const [userId, setUserId] = useState('');

  useEffect(() => {
    setUserId(generateUserId());
  }, []);

  // Function to handle messages received from Bluetooth
  const handleBluetoothMessage = (bluetoothMessage) => {
    if (!bluetoothMessage.trim()) return;

    const newMessage = { content: bluetoothMessage, sender: 'user' };
    const updatedMessages = [...messages, newMessage];
    setMessages(prevMessages => [...prevMessages, newMessage]);

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
        console.log("Here: ", contentType);
        if (contentType && contentType.includes("image")) {
          return response.blob();
        }
        return response.json();
      })
      .then(data => {
        if (data instanceof Blob) {
          // Convert blob to URL and set it as the message content
          const imageUrl = URL.createObjectURL(data);
          setMessages(prev => [...prev, { content: `<img src="${imageUrl}" alt="Generated Plot"/>`, sender: 'api' }]);
        } else {
          // Handle non-image response
          setMessages(prev => [...prev, { content: data.message || data.content, sender: 'api' }]);
        }
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
      {/* Render image if message content is an image URL, else render as markdown */}
      {msg.content.startsWith('<img') ? 
        <div dangerouslySetInnerHTML={{ __html: msg.content }} /> :
        <ReactMarkdown components={components}>{msg.content}</ReactMarkdown>
      }
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
    </div>
  );
};

export default ChatComponent;

const generateUserId = () => {
  return Math.random().toString(36).substring(2, 15);
};
