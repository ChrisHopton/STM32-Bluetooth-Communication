import React from 'react';
import BluetoothComponent from './components/BluetoothComponent';
import useOpenAI from './components/OpenAIAPI';
import ChatInterface from './components/OpenAIAPI';

const App: React.FC = () => {

  return (
    <div className='bg-gray-500'>
      <BluetoothComponent />
      <ChatInterface/>
    </div>
  );
};

export default App;
