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


// Function to format code snippets in the response
function formatCodeSnippet(responseContent) {
    const codeSnippetRegex = /(?:```)([\s\S]*?)(?:```)/g;
    return responseContent.replace(codeSnippetRegex, (match, code) => {
        return "```" + code.trim() + "```"; // Wrap with Markdown code block
    });
}

async function generateChatMessage(userId, messages) {
    // Add the new message to the conversation history
    const conversation = conversationHistories[userId] || [];
    conversation.push(...messages);

    const result = await chatClient.generateMessage({
        model: "models/chat-bison-001",

        prompt: { 
            messages: conversation },
    });

    // Add the AI's response to the conversation history
    const response = result[0].candidates[0].content;
    conversation.push({ content: response });

    // Update the stored conversation history
    conversationHistories[userId] = conversation;

    // Format response for code snippets
    const formattedResponse = formatCodeSnippet(response);
    return formattedResponse;
}



// Function to generate text message
async function generateTextMessage(promptText) {
    try {
        //console.log("here,", promptText)
        const completion = await openai.chat.completions.create({
            messages: [{"role": "user", "content": promptText}],
            model: "gpt-4-1106-preview",
        });
       // console.log("herere", completion.choices[0].message.content)
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating message:", error);
        throw error;
    }
}


app.post('/chat-generate-message', async (req, res) => {
    
    try {
        const { userId, messages } = req.body;

        if (!userId || !messages || !Array.isArray(messages)) {
            return res.status(400).send('User ID and messages array are required');
        }

        const responseContent = await generateChatMessage(userId, messages);

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
            console.log("I AM HERE!!!!!5")
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
        const promptText = req.body.messages[0].content;
       // console.log(promptText)
        if (!promptText) {
            return res.status(400).send('No prompt text specified');
        }

        const responseContent = await generateTextMessage(promptText);
        console.log(responseContent);

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
