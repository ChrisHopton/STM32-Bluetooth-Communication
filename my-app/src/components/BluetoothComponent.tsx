import React, { useState } from 'react';

const BluetoothComponent = ({ onReceiveBluetoothMessage  }) => {
    // State and functions from BluetoothComponent
    const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
    const [dataCharacteristic, setDataCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
    const [inputData, setInputData] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    const log = (message: string) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    const handleConnectClick = () => {
        navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
        })
        .then(device => {
            log(`Connecting to ${device.name}...`);
            setConnectedDevice(device);
            return device.gatt.connect();
        })
        .then(server => server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb'))
        .then(service => service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb'))
        .then(characteristic => {
            log('Connected. Ready to send and receive data.');
            setDataCharacteristic(characteristic);
            characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
            return characteristic.startNotifications();
        })
        .then(() => {
            log('Notifications started');
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
    
        for (let i = 0; i < value.byteLength; i++) {
            message += String.fromCharCode(value.getUint8(i));
        }
    
        message = message.trim(); // This will remove any whitespace or control characters from both ends
        message = message.replace(/\x00/g, ''); // Replace with the actual character code

    
        log('Received: ' + message);
        onReceiveBluetoothMessage(message);
    };
    

    const handleSendClick = () => {
        let dataToSend = inputData + '\r\n';
        const data = new TextEncoder().encode(dataToSend);

        if (dataCharacteristic) {
            const method = dataCharacteristic.properties.writeWithoutResponse ? 'writeValueWithoutResponse' : 'writeValue';

            setTimeout(() => {
                dataCharacteristic[method](data)
                .then(() => {
                    log('Data sent: ' + dataToSend);
                })
                .catch(error => {
                    log('Send Error: ' + error);
                });
            }, 100);
        } else {
            log('Characteristic not found.');
        }
    };

    return (
        <div>
            {/* Navbar code */}
            <nav className="flex dark:bg-slate-900 items-center relative justify-between bg-white px-5 py-6 w-full">
                {/* Navbar content */}
                {/* Bluetooth connect button */}
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2" onClick={handleConnectClick}>
                    {connectedDevice ? `Connected: ${connectedDevice.name}` : 'Connect Bluetooth'}
                </button>
                {/* Rest of the Navbar content */}
            </nav>

            {/* Bluetooth details popover (hidden or shown based on state) */}
            {connectedDevice && (
                <div className="popover-details">
                    {/* You can structure this popover as needed */}
                    <input 
                        type="text" 
                        className="border border-gray-400 p-2 rounded mb-2" 
                        value={inputData} 
                        onChange={(e) => setInputData(e.target.value)} 
                    />
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSendClick}>Send Data</button>

                    <div className="mt-4 border border-gray-300 p-4 h-64 overflow-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className="mb-2">{msg}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BluetoothComponent;
