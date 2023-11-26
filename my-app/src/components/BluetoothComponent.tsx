import React, { useState, useEffect } from 'react';

const BluetoothComponent = () => {
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [dataCharacteristic, setDataCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [inputData, setInputData] = useState('');


  useEffect(() => {
    // Any additional setup can go here
  }, []);

  const handleConnectClick = () => {
    navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // Replace with your service UUID
    })
    .then(device => {
      log(`Connecting to ${device.name}...`);
      setConnectedDevice(device);
      return device.gatt.connect();
    })
    .then(server => server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb')) // Replace with your service UUID
    .then(service => service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb')) // Replace with your characteristic UUID
    .then(characteristic => {
      log('Connected. Ready to send and receive data.');
      setDataCharacteristic(characteristic);
      return characteristic.startNotifications();
    })
    .then(() => {
      log('Notifications started');
      dataCharacteristic?.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    })
    .catch(error => {
      log('Error: ' + error);
    });
  };

  const handleCharacteristicValueChanged = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    let decoder = new TextDecoder('utf-8');
    let message = '';
  
    // Read bytes one by one and decode accordingly
    for (let i = 0; i < value.byteLength; i++) {
      message += String.fromCharCode(value.getUint8(i));
    }
  
    log('Received: ' + message);
  };
  

  const handleSendClick = () => {
    let dataToSend = inputData; // Assuming inputData is a state variable holding input data
    dataToSend += '\r\n'; // Append \r for CR and \n for NL
    const data = new TextEncoder().encode(dataToSend);
  
    if (dataCharacteristic) {
      const method = dataCharacteristic.properties.writeWithoutResponse ? 'writeValueWithoutResponse' : 'writeValue';
  
      // Use setTimeout to delay the sending of data
      setTimeout(() => {
        dataCharacteristic[method](data)
        .then(() => {
          log('Data sent: ' + dataToSend);
        })
        .catch(error => {
          log('Send Error: ' + error);
        });
      }, 100); // 100 ms delay
    } else {
      log('Characteristic not found.');
    }
  };
  

  const log = (text: string) => {
    // Implement a logging mechanism, possibly updating state to render logs
  };

return (
    <div>
      <button onClick={handleConnectClick}>Connect</button>
      <input
        type="text"
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
      />
      <button onClick={handleSendClick}>Send Data</button>
      {/* ... other components */}
    </div>
  );
};

export default BluetoothComponent;
