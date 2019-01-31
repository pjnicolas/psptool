const moment = require('moment');
const keypress = require('keypress');

const prompt = require('./prompt');
const { writeToLog, readTasks, writeTasks } = require('./persist');

const makeDoubleString = n => Number(n) < 10 ? '0' + n : String(n);

const OPTIONS = {
  START: 'START a task',
  TEMPORAL: 'Start a TEMPORAL task',
  CREATE: 'CREATE a new task',
  REMOVE: 'REMOVE a existing task',
};

const STATE = {
  WORKING: 0,
  RESTING: 1,
};

let tasks = readTasks();

const makeRequest = async () => {
  let repeat = true;

  while (repeat) {
    const option = await prompt.askMainMenu(OPTIONS);

    switch (option) {
      case OPTIONS.START:
        repeat = false;
        const whatTaskStart = await prompt.askWhatTask(tasks);
        startTask(whatTaskStart);
        break;
      case OPTIONS.TEMPORAL:
        repeat = false;
        const temporalTask = await prompt.askForNewTask();
        startTask(temporalTask);
        break;
      case OPTIONS.CREATE:
        const newTask = await prompt.askForNewTask();
        tasks.push(newTask);
        writeTasks(tasks);
        break;
      case OPTIONS.REMOVE:
        const whatTaskRemove = await prompt.askWhatTask(tasks);
        tasks = tasks.filter(e => e !== whatTaskRemove);
        writeTasks(tasks);
        break;
    }
  }

};

const startTask = (name) => {
  let start = moment();
  const veryStart = start.format('DD/MM/YYYY HH:mm:ss');
  let state = STATE.WORKING;
  let workingTime = 0;
  let restingTime = 0;
  let returnPressed = false;
  let escapePressed = false;
  console.log(`Task started at: [${start.format('DD/MM/YYYY HH:mm:ss')}]`);

  // Setting up keypress
  keypress(process.stdin);
  process.stdin.on('keypress', (ch, key) => {
    if (key && key.ctrl && key.name == 'c') {
      process.exit();
    }

    if (key.name === 'return') {
      returnPressed = true;
    } else if (key.name === 'escape') {
      escapePressed = true;
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();

  // Start the clock
  const interval = setInterval(() => {
    if (escapePressed) {
      escapePressed = false;
      clearInterval(interval);

      if (state === STATE.WORKING) {
        workingTime += moment.duration(moment().diff(start)).asMinutes();
      }

      const logWorkingTime = workingTime.toFixed(2);
      const logRestingTime = restingTime.toFixed(2);

      console.log();
      console.log('Saving data in log...');
      console.log(`   Task name: ${name}`);
      console.log(`  Start time: ${veryStart}`);
      console.log(`Working time: ${logWorkingTime}`);
      console.log(`Resting time: ${logRestingTime}`);

      writeToLog(`${name};${veryStart};${logWorkingTime};${logRestingTime}`);

      // TODO: Clean exit
      process.exit();
      return;
    } else if (returnPressed) {
      returnPressed = false;

      const newStart = moment();
      const extraTime = moment.duration(newStart.diff(start)).asMinutes();
      if (state === STATE.WORKING) {
        workingTime += extraTime;
      } else if (state === STATE.RESTING) {
        restingTime += extraTime;
      }

      start = newStart;
      state = state === STATE.WORKING ? STATE.RESTING : STATE.WORKING;
      process.stdout.write(` - END AT [${start.format('DD/MM/YYYY HH:mm:ss')}]\n`);
    }
    const diffTime = moment.duration(moment().diff(start));
    const diffSeconds = makeDoubleString(diffTime.get("seconds"));
    const diffMinutes = makeDoubleString(diffTime.get("minutes"));
    const diffHours = Math.floor(diffTime.asHours());

    process.stdout.write('\r');
    if (state == STATE.WORKING) {
      process.stdout.write('Working: ');
    } else if (state == STATE.RESTING) {
      process.stdout.write('Resting: ');
    }
    process.stdout.write(`${diffHours}:${diffMinutes}:${diffSeconds}`);

  }, 50);
};

makeRequest();
