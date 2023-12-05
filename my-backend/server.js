const { OpenAI } = require("openai");
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { PythonShell } = require('python-shell');

require('dotenv').config();

const { DiscussServiceClient, TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

const port = 3001;

// Object to hold conversation histories for different users/sessions
let conversationHistories = {};

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});


// Initialize clients for both models
const chatClient = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(process.env.API_KEY),
});

const textClient = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(process.env.API_KEY),
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Assuming your API key is stored in an environment variable
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{"role": "user", "content": "Can you write code to plot y = x + 2"}],
    model: "gpt-3.5-turbo",
  });

  console.log("OPEN AI: ",completion.choices[0]);
}

// Function to check if the message is gyroscope data
function isGyroscopeData(message) {
    // Check if the message is an array of three numbers
    return Array.isArray(message.content) && 
           message.content.length === 3 &&
           message.content.every(num => typeof num === 'number');
}



// Function to format code snippets in the response
function formatCodeSnippet(responseContent) {
    const codeSnippetRegex = /(?:```)([\s\S]*?)(?:```)/g;
    return responseContent.replace(codeSnippetRegex, (match, code) => {
        return "```" + code.trim() + "```"; // Wrap with Markdown code block
    });
}

async function generateChatMessage(userId, messages) {
    let conversation = conversationHistories[userId] || [];

    // Add only new messages to the conversation history
    // Assuming 'messages' contains only the new messages
    conversation = [...conversation, ...messages];
    console.log("convos: ", messages)
    try {
        const result = await chatClient.generateMessage({
            model: "models/chat-bison-001",
            prompt: { messages: conversation },
        });

        if (result && result[0] && result[0].candidates && result[0].candidates[0]) {
            const response = result[0].candidates[0].content;
            conversation.push({ content: response, sender: 'assistant' });
            conversationHistories[userId] = conversation;

            const formattedResponse = formatCodeSnippet(response);
            return formattedResponse;
        } else {
            console.error("Unexpected response structure:", result);
            return ""; // or handle the error appropriately
        }
    } catch (error) {
        console.error("Error in generateChatMessage:", error);
        return ""; // Handle the error appropriately
    }
}




// Function to generate text message
async function generateTextMessage(userId, messages) {
    let conversation = conversationHistories[userId] || [];
    conversation = [...conversation, ...messages];
    console.log(conversation.map(msg => ({ role: msg.sender, content: msg.content })));

    if (messages.length > 0 && isGyroscopeData(messages[messages.length - 1])) {
        // Handle gyroscope data here
        // For example, you can generate a request to visualize the data
        // or store the data for later processing
        console.log("Gyroscope data received:", messages[messages.length - 1].content);
        return "Gyroscope data processing..."; // Placeholder response
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: conversation.map(msg => ({ role: msg.sender, content: msg.content })),
            model: "gpt-3.5-turbo",
        });

        const responseContent = completion.choices[0].message.content;
        conversation.push({ content: responseContent, sender: 'assistant' });
        conversationHistories[userId] = conversation;

        return responseContent;
    } catch (error) {
        console.error("Error generating message:", error);
        throw error;
    }
}



app.post('/chat-generate-message', async (req, res) => {
    
    try {
        const { userId, messages } = req.body;
        //console.log("herererere" , req.body)

        if (!userId || !messages || !Array.isArray(messages)) {
            return res.status(400).send('User ID and messages array are required');
        }

       const responseContent = await generateChatMessage(userId, messages);
        console.log("response is: ", responseContent)

        // Extract Python code from the response
        const codeRegex = /```python\n([\s\S]*?)```/; // Regex to extract code from markdown format
        const codeMatch = responseContent.match(codeRegex);
        if (codeMatch) {
            const pythonCode = codeMatch[1];
            const scriptPath = 'C:\\Users\\mathe\\Documents\\GitHub\\STM32-Bluetooth-Communication\\test.py';

            fs.writeFileSync(scriptPath, pythonCode);

            // Wrap PythonShell.run in a Promise
            const runPythonScript = () => {
                return new Promise((resolve, reject) => {
                    PythonShell.run(scriptPath, null, (err, results) => {
                        if (err) {
                            console.error('Python execution error:', err);
                            reject(new Error('Python execution error: ' + err.message));
                        } else {
                            console.log('Python execution results:', results);
                            resolve(results);
                        }
                    });
                });
            };
            
            
            try {
                console.log("I AM HERE!!!!!3");
                res.json({ content: responseContent});
                const results = await runPythonScript();
                res.json({ content: responseContent});
            } catch (pythonError) {
                console.log("I AM HERE!!!!!4", pythonError);
                res.json({ content: responseContent, codeOutput: 'Error executing Python script: ' + pythonError.message });
            }
        } else {
            //console.log("I AM HERE!!!!!5")
            res.json({ content: responseContent });
        }

    } catch (error) {
        console.log("I AM HERE!!!!!6")
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

let temp;

app.post('/data-generate-message', async (req, res) => {
    try {
        const promptText = req.body.messages[req.body.messages.length - 1].content;
        const { userId, messages } = req.body;
        
      //console.log(messages)
        if (!promptText) {
            return res.status(400).send('No prompt text specified');
        }

        const responseContent = await generateTextMessage(userId, messages);
       // console.log(responseContent);

        // Extract Python code from the response
        const codeRegex = /```python\n([\s\S]*?)```/; // Regex to extract code from markdown format
        const codeMatch = responseContent.match(codeRegex);
        if (codeMatch) {
            const pythonCode = codeMatch[1];
            const scriptPath = 'C:\\Users\\mathe\\Documents\\GitHub\\STM32-Bluetooth-Communication\\test.py';

            fs.writeFileSync(scriptPath, pythonCode);

            // Wrap PythonShell.run in a Promise
            const runPythonScript = () => {
                return new Promise((resolve, reject) => {
                    PythonShell.run(scriptPath, null, (err, results) => {
                        if (err) {
                            console.error('Python execution error:', err);
                            reject(new Error('Python execution error: ' + err.message));
                        } else {
                            console.log('Python execution results:', results);
                            resolve(results);
                        }
                    });
                });
            };
            
            
            try {
                console.log("I AM HERE!!!!!3");
                res.json({ content: responseContent});
                const results = await runPythonScript();
                res.json({ content: responseContent});
            }  catch (error) {
                console.log("Error in /data-generate-message:", error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            console.log("I AM HERE!!!!!5")
            res.json({ content: responseContent });
        }

    } catch (error) {
        console.log("I AM HERE!!!!!6")
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
