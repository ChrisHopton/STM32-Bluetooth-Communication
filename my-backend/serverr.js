const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function main() {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are a helpful assistant." }],
    });

    console.log(completion.data.choices[0].message.content);
  } catch (error) {
    console.error("Error in OpenAI request:", error);
  }
}

main();
