const fs = require('fs');
const natural = require('natural');
const classifier = new natural.BayesClassifier();

const args = process.argv;
const type = args[2];

const data = JSON.parse(fs.readFileSync('./result.json', 'utf8'));
const keys = Object.keys(data);
const size = keys.length * 0.8;
const elements =  keys.splice(0, size);


elements.forEach(key => {
  console.log(key, data[key]);
  classifier.addDocument(key, data[key]);
});

console.log('start training...');
classifier.train();
console.log('end training');

classifier.save('./classifier.json');



