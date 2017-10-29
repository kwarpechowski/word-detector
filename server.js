const express = require('express');
const natural = require('natural');
const FIXED = 15;
const MAX_SLICE = 10;

let classifierAll = null;
let classifierWithoutSubtype = null;
let classifierPersonOrg = null;
let classifierCustom = null;

const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));

natural.BayesClassifier.load('trained/classifier_all.json', null, function(err, c) {
  classifierAll = c;
});

natural.BayesClassifier.load('trained/classifier_without_subtype.json', null, function(err, c) {
  classifierWithoutSubtype = c;
});

natural.BayesClassifier.load('trained/custom.json', null, function(err, c) {
  classifierCustom = c;
});


natural.BayesClassifier.load('trained/classifier_person_org.json', null, function(err, c) {
  classifierPersonOrg = c;
});




const getRank = (word, classifier) => {
  const classification = classifier.getClassifications(word);
  return classification.map(r => {
    r.value = r.value.toFixed(FIXED);
    return r;
  })
  .sort((a,b) => b.value - a.value)
  .slice(0, MAX_SLICE)
  .reduce((p, c) => {
      p[c.label] = c.value;
    return p;
  }, {});
}


const getRanks = txt => {
  const ranks = [];
  ranks.push({
    name: 'max',
    data: getRank(txt, classifierAll)
  });

  ranks.push({
    name: 'without subtype',
    data: getRank(txt, classifierWithoutSubtype)
  });

  ranks.push({
    name: 'person org',
    data: getRank(txt, classifierPersonOrg)
  });

  return ranks;
}

generateWords = (words, index) => {
  const data = [];
  for(let i = 0; i <= words.length - index; i++) {
    data.push(words.slice(i, i+index).join(" "));
  }

  return data;
}

app.get('/',  (req, res) => {
  let txt = req.query.q.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  let words = txt.split(' ');
  let additional = [];


  if (words.length > 6) {
    additional = additional.concat(generateWords(words, 6))
  }

  if (words.length > 5) {
    additional = additional.concat(generateWords(words, 5))
  }

  if (words.length > 4) {
    additional = additional.concat(generateWords(words, 4))
  }

  if (words.length > 3) {
    additional = additional.concat(generateWords(words, 3))
  }

  if (words.length > 2) {
    additional = additional.concat(generateWords(words, 2))
  }

  words = additional.concat(words);


  const rank = words.map(word => {
    return {
      word: word,
      ranks: getRanks(word),
      customRank: getRank(word, classifierCustom)
    }
  }).filter(w => {
    const rank = w.customRank;
    const rankKeys = Object.keys(rank);

    if(req.query.disable) {
      return true;
    }


if (rank[rankKeys[0]] < 0.000000001) {
  return false;
}



if (rank[rankKeys[0]] === rank[rankKeys[1]]) {
  return false;
}

// if (rank[rankKeys[1]] === rank[rankKeys[2]]) {
//   return false;
// }
//   //
  if(rankKeys[0] === 'other') {
    return false;
  }
//
if (rank[rankKeys[0]] > 0.3 && rank[rankKeys[1]] > 0.3) {
  return false;
}

if (rank[rankKeys[0]] / rank[rankKeys[1]] < 1) {
  return false;
}

    return true;

});

// .sort((a,b) => {
//   const rankKeysA = Object.keys(a.customRank);
//   const rankKeysB = Object.keys(b.customRank);
//   return b.customRank[rankKeysB[0]] - a.customRank[rankKeysA[0]]
// });
  res.render('stats', {
    rank: rank,
    query: req.query.q
  });
});


app.get('/setCustom', (req, res) => {
  const cat = req.query.cat;
const q = req.query.q;
const v = req.query.v;

classifierCustom.removeDocument(v, 'orgName');
classifierCustom.removeDocument(v, 'other');
classifierCustom.removeDocument(v, 'persName');

classifierCustom.addDocument(v, cat);
  classifierCustom.train();
  classifierCustom.save('trained/custom.json', (err, classifier) => {
    res.redirect(301, '/?q='+q);
  });
});



app.listen(3000, function () {
  console.log('App listening on port 3000!');
});