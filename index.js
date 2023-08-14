require('dotenv').config();
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
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


const chainOfThoughtPrompts = (prompts) => {
  // TODO: Iterate prompts array. Consider OOP
}

/**
 * 
 * @function    getTextResponse
 * @description Respond to user in plain text. No structured JSON.
 * 
 */ 
const getTextResponse = async (userPrompted, cb) => {
    const defaultQuestion = "How do you implement a linked list in TypeScript?";
    const finalQuestion = userPrompted?userPrompted:defaultQuestion;
    try {
        /**
         * Query the model with the given prompt
         * @param {string} prompt - The prompt to query to the model
         * @returns {Promise<string>} The model's response as a promise
         */
        const res = await model.call(finalQuestion);
        
        console.log("RESPONSE:")
        console.log(res);

        if(cb) {
          cb();
        }
    }
    catch (err) {
      console.error(err);
    }
};

/**
 * 
 * @function    getStructResponse
 * @description Respond as an JSON object that can be parsed in building out an app. 
 *              StructuredOutputParser instance as parser has a utility method that will parse the JSON response into a native type.
 * 
 */ 
const getStructResponse = async (userPrompted, parser, cb) => {
    const defaultQuestion = "How do you implement a linked list in TypeScript?";
    const finalQuestion = userPrompted?userPrompted:defaultQuestion;
    try {
        /**
         * Query the model with the given prompt
         * @param {string} prompt - The prompt to query to the model
         * @returns {Promise<string>} The model's response as a promise
         */
        const res = await model.call(finalQuestion);

        const structured = await parser.parse(res)

        console.log("RESPONSE:")
        console.log(structured)

        if(cb) {
          cb();
        }
    }
    catch (err) {
      console.error(err);
    }
};


/**
 * 
 * @function    askGeneral
 * @description Ask in plain text. No templates. No expertise.
 * 
 */ 
const askGeneral = async() => {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'manualPrompt',
      message: `Ask ${openAIModel} a question:`,
    },
  ]).then(({manualPrompt}) => {
    getTextResponse(manualPrompt, askMode)
  });
};

/**
 * 
 * @function           askRole
 * @description        Provide context to the ChatGPT that it should be a specific expert
 *                     In addition, the syntax allows for user inputs to be broken down into key value pairs interpolated into a template
 * 
 *                     Nature: This follows a Builder Pattern that builds out the final prompt string. It's just semantic and syntatic sugar 
 *                     because you could've done this hard coded without the LangChain's PromptTemplate utility.
 *        
 *                     PromptTemplate is two steps. When initiating, it takes in an argument object for settings. The setting `template` is 
 *                     similar to a template literal where you write in interpolated keys. You can have many interpolated keys in the template. 
 *
 *                     The second setting is inputVariables where you must pass all your interpolated keys into as an array of strings of keys. 
 *                     In the second step, you use the same instance of PromptTemplate to call the method `format`. Format is really taking input 
 *                     from the user or app. The argument is an object of the interpolated key(s) against the user value(s). This allows you to 
 *                     break down your user's inputs from an app into different parts in your template.
 * 
 * @returns {String}  Returns a string of the final prompt
 * 
 */

const askRole = async(role) => {
  switch(role) {
    case "JS":
      (async function() {
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
          console.log({finalPrompt})
      
      
          getTextResponse(finalPrompt, askMode);
        });
      })();
      break;
  }

} // askRole


/**
 * @function    askRoleJS_ForStructuredOutput
 * @description This is adding on top of askRole() that had used PromptTemplate. For its explanation, go to askRole() JSDocs documentation.
 *              User asks Javascript question and the answer will be returned in JSON that can be parsed as if rendering inside a Javascript tutor app.
 *
 *              Used StructuredOutputParser which follows a Builder Pattern with primarily two steps and an useful utility method. 
 *              Firstly, it receives an argument object of names and descriptions in the form of key-value pairs, describing the object properties you want AI
 *              to answer with. Then on the second step, it gives you format instructions that PromptTemplate understands, which is essentially a subtemplate
 *              that you can interpolate into your main template explaining to ChatGPT what the JSON format looks like. Eg. "ere is the JSON Schema instance 
 *              your output must adhere to. Include the enclosing markdown codeblock:..."
 *
 *              So PromptTemplate receives the usual inputVariables that you would pass in at the second Builder step with a <PromptTemplate>.format call, 
 *              but also a partialVariables object that contains the format instructions passed in at instantialization. The name inputVariables implies that
 *              it's from the user inputs which is passed in at the Builder Pattern's second step of sending arguments to interpolate into the template, and the name
 *              partialVariables is just a general term for subtemplates being interpolated into the main template (versus individual values of strings/integers/etc).
 * 
 * @return {void}
 * 
 */
const askRoleJS_ForStructuredOutput = async() => {
  console.log("User asks Javascript question and the answer will be returned in JSON that can be parsed as if part of a Javascript tutor app");

  // const parser = StructuredOutputParser.fromNamesAndDescriptions({
  //     code: "Javascript code that answers the user's question",
  //     explanation: "Detailed explanation of the example code provided"
  // });
  // const parser = StructuredOutputParser.fromNamesAndDescriptions({
  //     code: "Detailed explanation of the example code provided",
  //     explanation: "Javascript code that answers the user's question",
  // });
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    "code": "Javascript code that answers the user's question",
    "explanation": "Detailed explanation of the example code provided",
    "source": "source used to answer the user's question, should be a website.",
  });


  const formatInstructions = parser.getFormatInstructions();

  await inquirer.prompt([
    {
      type: 'input',
      name: 'userPrompt',
      message: 'Ask your Javascript question through the pretend app:',
    }
  ])
  .then(async ({userPrompt}) => {
    
    const prompt = new PromptTemplate({
      template: "You are a javascript expert and will answer the user’s coding questions thoroughly as possible.\n{userPrompt}\n{formatInstructions}",
      inputVariables: ["userPrompt"],
      partialVariables: { formatInstructions: formatInstructions } // Looks like this is old syntax and now need CompletionRequest
    });

    const finalPrompt = await prompt.format({
      userPrompt
    })
    console.log({formatInstructions})
    // console.log({finalPrompt})


    getStructResponse(finalPrompt, parser, askMode);
  });
}


const askMode = async() => {
  const choices = [
    'Manual prompt',
    new inquirer.Separator('-- Tech Related --'), 
    'Javascript',
    'Build A Javascript Tutoring App',
    'UI UX Suggestions (Coming Soon)',
    new inquirer.Separator('-- Health Related --'), 
    'Do I have DNA for? (Coming Soon)',
    'Weight Training (Coming Soon)'
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
        askRole("JS");
        break;
      case "Build A Javascript Tutoring App":
        askRoleJS_ForStructuredOutput();
        break;
      default:
        console.log("Coming soon!");
        askMode();
    }
  });
} // askMode

  

  askMode();