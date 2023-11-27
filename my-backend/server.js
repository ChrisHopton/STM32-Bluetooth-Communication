const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { DiscussServiceClient, TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

const port = 3001;

// Initialize clients for both models
const chatClient = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(process.env.API_KEY),
});

const textClient = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(process.env.API_KEY),
});

// Function to format code snippets in the response
function formatCodeSnippet(responseContent) {
    const codeSnippetRegex = /(?:```)([\s\S]*?)(?:```)/g;
    return responseContent.replace(codeSnippetRegex, (match, code) => {
        return "```" + code.trim() + "```"; // Wrap with Markdown code block
    });
}

async function generateChatMessage(promptText) {
    const result = await chatClient.generateMessage({
        model: "models/chat-bison-001",
        temperature: 0.1,
        candidateCount: 1,
        topP: 0.8,
        topK: 10,
        prompt: {
            messages: [{ content: promptText }],
        },
    });

    let response =  result[0].candidates[0].content;

    // Format response for code snippets
    const formattedResponse = formatCodeSnippet(response);
    return response;
}


// Function to generate text message
async function generateTextMessage(promptText) {
    try {
        const result = await textClient.generateText({
            model: "models/text-bison-001",
            prompt: {
                text: promptText,
            },
            temperature: 0,
            candidateCount: 1,
        });

        const validResponse = result.find(res => res !== null);
        if (validResponse && validResponse.candidates && validResponse.candidates.length > 0) {
            return validResponse.candidates[0].output;
        } else {
            throw new Error('No valid response received from the API');
        }
    } catch (error) {
        console.error("Error generating message:", error);
        throw error;
    }
}

app.post('/chat-generate-message', async (req, res) => {
    try {
        const promptText = req.body.prompt;
        if (!promptText) {
            return res.status(400).send('No prompt text specified');
        }

        const message = await generateChatMessage(promptText);
        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/data-generate-message', async (req, res) => {
    try {
        const promptText = req.body.prompt;
        if (!promptText) {
            return res.status(400).send('No prompt text specified');
        }

        const responseContent = await generateTextMessage(promptText);
        res.json({ content: responseContent });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
