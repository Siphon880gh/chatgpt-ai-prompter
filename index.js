require('dotenv').config();
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require("langchain/prompts");
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

const callAPI = async (userPrompted, cb) => {
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

        if(cb) {
          cb();
        }
    }
    catch (err) {
      console.error(err);
    }
};


const askGeneral = async() => {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'manualPrompt',
      message: `Ask ${openAIModel} a question:`,
    },
  ]).then(({manualPrompt}) => {
      callAPI(manualPrompt, askMode)
  });
};

/**
 * 
 * @function    askRoleJS
 * @description Provide context to the ChatGPT that it should be a specific expert
 *              In addition, the syntax allows for user inputs to be broken down into key value pairs interpolated into a template
 * 
 * @description Nature: This follows a Builder Pattern that builds out the final prompt string. It's just semantic and syntatic sugar 
 *              because you could've done this hard coded without the LangChain's PromptTemplate utility.
 * 
 *  PromptTemplate is two steps. When initiating, it takes in an argument object for settings. The setting `template` is similar to a 
 *  template literal where you write in interpolated keys. You can have many interpolated keys in the template. 
 *
 *  The second setting is inputVariables where you must pass all your interpolated keys into as an array of strings of keys. In the second step.
 *  You use the same instance of PromptTemplate to call the method `format`. Format is really taking input from the user or app. The argument is
 *  an object of the interpolated key(s) against the user value(s). This allows you to break down your user's inputs from an app into different 
 *  parts in your template.
 * 
 * @returns {String}  Returns a string of the final prompt
 * 
 */

const askRoleJS = async() => {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'userPrompt',
      message: 'Ask your Javascript question:'
    }
  ])
  .then(async ({userPrompt}) => {
    
    const prompt = new PromptTemplate({
      template: "You are a javascript expert and will answer the user’s coding questions thoroughly as possible.\n{userPrompt}",
      inputVariables: ["userPrompt"],
    });

    const finalPrompt = await prompt.format({
      userPrompt
    })


    callAPI(finalPrompt);
    //askMode();
  });
}

const askMode = async() => {
  const choices = [
    'Manual prompt',
    new inquirer.Separator('-- Tech Related --'), 
    'Javascript',
    'UI UX',
    new inquirer.Separator('-- Health Related --'), 
    'DNA',
    'Weight Training'
  ];
  
  await inquirer.prompt([
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
        askGeneral();
        break;
      case "Javascript":
        askRoleJS();
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