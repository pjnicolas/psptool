const fs = require('fs');

fs.writeFileSync('./notebook/output-tables.tex', '');
const templateIndex = String(fs.readFileSync('./notebook/template-index.tex'));
const templateTable = String(fs.readFileSync('./notebook/template-table.tex'));
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

let index = '';
let indexPage = 3;
let tables = '';

Object.keys(database).forEach(k => {
  const title = k;
  const tasks = database[k]
    .map(e => `${e.date} & ${e.description} \\\\`)
    .reduce((prev, curr) => `${prev}\n${curr}`, '');
  index += `\n${indexPage} & ${title} & ${database[k][0].date} & ${database[k][database[k].length - 1].date} \\\\`;
  indexPage += 1;
  const output = templateTable.replace('TITLE', title).replace('TASKS', tasks);
  fs.appendFileSync('./notebook/output-tables.tex', `${output}\n`);
  tables += `${output}\n`;
});

const output = templateIndex.replace('INDEX', index);
fs.writeFileSync('./notebook/output-tables.tex', `${output}\n${tables}`);

