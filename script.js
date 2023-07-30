require('dotenv').config();
const { OpenAI } = require('langchain/llms/openai');

const apiKey = process.env.OPENAI_API_KEY;

/**
 * OpenAI constructor
 * @constructor
 * @param {Object} options - Options for OpenAI API
 * @param {int} options.apiKey - The temperature property represents variability in the words selected in a response. Temperature ranges from 0 to 1 with 0 meaning higher precision but less creativity and 1 meaning lower precision but more variation and creativity.
 * 
 */
const model = new OpenAI({ 
    openAIApiKey: process.env.OPENAI_API_KEY, 
    temperature: 0,
    model: 'gpt-3.5-turbo'
});
// console.log({ model });



const promptFunc = async () => {
    try {
        /**
         * Query the model with the given prompt
         * @param {string} prompt - The prompt to query to the model
         * @returns {Promise<string>} The model's response as a promise
         */
        const res = await model.call("How do you implement a linked list in TypeScript?");
        console.log(res);
    }
    catch (err) {
      console.error(err);
    }
};

promptFunc();