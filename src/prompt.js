const inquirer = require('inquirer');
const inquirerAutocompletePrompt = require('inquirer-autocomplete-prompt');

inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt);

const askForNewTask = async () => {
  const answer = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Type the name of the new task:',
  }]);

  return answer.name;
};

const askMainMenu = async (options) => {
  const answer = await inquirer.prompt([{
    type: 'autocomplete',
    name: 'option',
    message: 'Select an option',
    source: function (answersSoFar, input) {
      if (input === undefined) input = '';
      return new Promise((resolve, reject) => {
        const values = Object.values(options);
        resolve(values.filter((e, i) => e.toLowerCase().includes(input.toLowerCase())));
      });
    }
  }]);

  return answer.option;
};

const askWhatTask = async (tasks) => {
  const answer = await inquirer.prompt([{
    type: 'autocomplete',
    name: 'task',
    message: 'Select what task are you about to start',
    source: function (answersSoFar, input) {
      if (input === undefined) {
        input = '';
      }
      return new Promise((resolve, reject) => {
        resolve(tasks.filter((e, i) => e.toLowerCase().includes(input.toLowerCase())));
      });
    }
  }]);

  return answer.task;
};

module.exports.askMainMenu = askMainMenu;
module.exports.askForNewTask = askForNewTask;
module.exports.askWhatTask = askWhatTask;
