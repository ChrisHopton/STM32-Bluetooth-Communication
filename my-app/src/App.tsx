
import React, { useState, useEffect } from 'react';
import BluetoothComponent from './components/BluetoothComponent';
import ChatComponent from './components/ChatRoom';


const ParentComponent = () => {
  const [bluetoothMessage, setBluetoothMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const onReceiveBluetoothMessage = (message) => {
    setBluetoothMessage(message);
  };

  const onSendResponseMessage = (message) => {
    setResponseMessage(message);
  };

  return (
    <div>
      <div  className='sticky top-0 dark:bg-slate-900 '>
      <BluetoothComponent 
        onReceiveBluetoothMessage={onReceiveBluetoothMessage}
        onResponseMessage={responseMessage}
      /></div>
      <ChatComponent 
        bluetoothMessage={bluetoothMessage} 
        onSendResponseMessage={onSendResponseMessage}
      />
    </div>
  );
}


export default ParentComponent;



