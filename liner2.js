const result_all = require('./result.json');
const natural = require('natural');
const fs = require('fs');

let test_entries = Object.entries(result_all);
const size = test_entries.length * 0.1;

test_entries = test_entries.splice(test_entries.length - size);

let test = '';

test_entries.forEach(x => {
  test += x[0] + '\n';
});

fs.writeFileSync('liner.txt', test);
