const fs = require('fs');

const FILE_TASK_LIST = './tasks.json';
const FILE_LOG = './log.csv';

const readTasks = () => {
  return JSON.parse(fs.readFileSync(FILE_TASK_LIST));
};

const writeTasks = (taskList) => {
  fs.writeFileSync(FILE_TASK_LIST, JSON.stringify(taskList));
};

const writeToLog = (text) => {
  fs.appendFileSync(FILE_LOG, `${text}\n`);
};

module.exports.readTasks = readTasks;
module.exports.writeTasks = writeTasks;
module.exports.writeToLog = writeToLog;
