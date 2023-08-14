require('dotenv').config();
const { OpenAI } = require('langchain/llms/openai');
const inquirer = require('inquirer');

const apiKey = process.env.OPENAI_API_KEY;
const openAIModel = "gpt-3.5-turbo"

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
    model: openAIModel
});
// console.log({ model });


const accrueCalls = (prompts) => {
  // TODO: Iterate prompts array. Consider OOP
}

const callAPI = async (userPrompted) => {
    const defaultQuestion = "How do you implement a linked list in TypeScript?";
    const finalQuestion = userPrompted?userPrompted:defaultQuestion;
    try {
        /**
         * Query the model with the given prompt
         * @param {string} prompt - The prompt to query to the model
         * @returns {Promise<string>} The model's response as a promise
         */
        const res = await model.call(finalQuestion);
        console.log(res);
    }
    catch (err) {
      console.error(err);
    }
};


const askCommandPrompt = async() => {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'manualPrompt',
      message: `Ask ${openAIModel} a question:`,
    },
  ]).then(({manualPrompt}) => {
      callAPI(manualPrompt)
  });
};

const askMode = async() => {
  const choices = [
    'Manual prompt',
    new inquirer.Separator('-- Tech Related --'), 
    'Programming',
    'UI UX',
    new inquirer.Separator('-- Health Related --'), 
    'DNA',
    'Weight Training'
  ];
  
  return await inquirer.prompt([
    {
      type: 'list',
      name: 'selection',
      message: 'Pick an option:',
      choices
    }
  ])
  .then(({selection}) => {
    switch(selection) {
      case "Manual prompt":
        askCommandPrompt();
        break;
      case "Programming":
        console.log("Coming soon!");
        askMode();
        break;
      case "UI UX":
        console.log("Coming soon!");
        askMode();
        break;
      case "DNA":
        console.log("Coming soon!");
        askMode();
        break;
      case "Weight Training":
        console.log("Coming soon!");
        askMode();
        break;
    }
  });
} // askMode

  

  askMode();