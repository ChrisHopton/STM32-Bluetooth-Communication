
import React, { useState, useEffect } from 'react';
import BluetoothComponent from './components/BluetoothComponent';
import ChatComponent from './components/ChatRoom';


const ParentComponent = () => {
  const [bluetoothMessage, setBluetoothMessage] = useState('');

  const onReceiveBluetoothMessage = (message) => {
    setBluetoothMessage(message);
  };
  console.log("Here is the message: " ,bluetoothMessage)
  return (
    
    <div>
      <BluetoothComponent onReceiveBluetoothMessage={onReceiveBluetoothMessage} />
      <ChatComponent bluetoothMessage={bluetoothMessage} />
    </div>
  );
};

export default ParentComponent;



