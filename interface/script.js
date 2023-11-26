let connectedDevice;
let dataCharacteristic;

document.getElementById('connect').addEventListener('click', function() {
    navigator.bluetooth.requestDevice({
        // The filters for your specific device
        acceptAllDevices: true,
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // Replace with your service UUID
    })
    .then(device => {
        log('Connecting to ' + device.name + '...');
        connectedDevice = device;
        return device.gatt.connect();
    })
    .then(server => server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb')) // Replace with your service UUID
    .then(service => service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb')) // Replace with your characteristic UUID
    .then(characteristic => {
        log('Connected. Ready to send and receive data.');
        dataCharacteristic = characteristic;
        
        // Start notifications.
        return dataCharacteristic.startNotifications();
    })
    .then(() => {
        log('Notifications started');
        dataCharacteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    })
    .catch(error => {
        log('Error: ' + error);
    });
});

function handleCharacteristicValueChanged(event) {
    let value = event.target.value;
    let decoder = new TextDecoder('utf-8');
    let message = '';
    
    // Read bytes one by one and decode accordingly
    for (let i = 0; i < value.byteLength; i++) {
        message += String.fromCharCode(value.getUint8(i));
    }
    
    log('Received: ' + message);
}



document.getElementById('sendData').addEventListener('click', function() {
    let dataToSend = document.getElementById('inputData').value;
    console.log(dataToSend);
    dataToSend += '\r\n'; // Append \r for CR and \n for NL
    console.log(dataToSend);
    const data = new TextEncoder().encode(dataToSend);
    console.log(data);

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
});


function log(text) {
    document.getElementById('log').textContent += text + '\n';
}


