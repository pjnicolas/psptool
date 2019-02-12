const fs = require('fs');

fs.writeFileSync('./notebook/output-tables.tex', '');
const template = String(fs.readFileSync('./notebook/template-table.tex'));
let log = String(fs.readFileSync('./log.csv'));

let database = {};
log.split('\n').filter((e, i) => e !== '' && i > 0).map(e => {
  const line = e.split(';');
  return {
    task: line[0],
    date: line[1].split(' ')[0],
    description: line[4],
  }
}).forEach(e => {
  if (database[e.task] === undefined) {
    database[e.task] = [];
  }

  database[e.task].push({
    date: e.date,
    description: e.description,
  });
});

Object.keys(database).forEach(k => {
  const title = k;
  const tasks = database[k].map(e => `${e.date} & ${e.description} \\\\`)
    .reduce((prev, curr) => `${prev}\n${curr}`, '');
  const output = template.replace('TITLE', title).replace('TASKS', tasks);
  // console.log(output);
  fs.appendFileSync('./notebook/output-tables.tex', `${output}\n`);
});


// console.log(output);
