import React from 'react';
import BluetoothComponent from './components/BluetoothComponent';
import TextGenerator from './components/OpenAIAPI';
import ChatComponent from './components/ChatRoom';


const App: React.FC = () => {

  return (
    <div className='bg-gray-500'>
      <BluetoothComponent />

      <ChatComponent />
    </div>
  );
};

export default App;
