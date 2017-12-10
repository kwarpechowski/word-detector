const result_all = require('./result.json');
const natural = require('natural');

natural.BayesClassifier.load('classifier.json', null, function(err, classifierPersonOrg) {
  let test_entries = Object.entries(result_all);
  const size = test_entries.length * 0.1;

  test_entries = test_entries.splice(test_entries.length - size);

  let falseCount = 0;
  let TP = 0;
  let FP = 0;
  let FN = 0;
  let TN = 0;


  test_entries.forEach(x => {
    const c =  classifierPersonOrg.getClassifications(x[0])[0].label;
    if (x[1] === c) {
      TP += 1;
    }else if(x[1] === 'other' && x[0] !== c) {
      FP += 1;
    }else if (x[1] !== 'other' && c === 'other') {
      FN += 1;
    }else if (x[1] === 'other' && c === 'other') {
      TN += 1;
    }

  });

  const prec = TP/(TP+FP);
  const F1 = (TP+TP)/(TP+TP+FP+FN);
  const recall = TP/(TP+TN);

  console.log('prec', prec);
  console.log('F1', F1);
  console.log('recall', recall);
});

