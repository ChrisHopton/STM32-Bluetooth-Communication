# STM32-Bluetooth-Communication
- Final Project in MPDD
- Nucleo f746zg w/ BLE HC-10 and Gyroscope + keypad and display
- React webapp can connect to nucleo via bluetooth and receive messages sent from the nucleo board. The webapp will send an API request to either Google PaLM 2 or OpenAI and return the response back to the nucleo board.
  - User can toggle between AI models. Previous conversations with one model will carry over to the new model so there is no loss of data.
- Implemented a "data" mode that will start sending formatted gyroscope data to webapp via bluetooth. Web app will distinguish the data format and plot the real-time 3D gyroscope data.
