const fs = require('fs');
const natural = require('natural');
const classifier = new natural.BayesClassifier();

const args = process.argv;
const type = args[2];

const data = JSON.parse(fs.readFileSync(`./result/result_${type}.json`, 'utf8'));

Object.keys(data).forEach(key => {
  console.log(key, data[key]);
  classifier.addDocument(key, data[key]);
});

console.log('start training...');
classifier.train();
console.log('end training');

classifier.save(`./trained/classifier_${type}.json`);



