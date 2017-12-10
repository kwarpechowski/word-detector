const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const path = require('path');
const natural = require('natural');

natural.BayesClassifier.load('classifier.json', null, function(err, classifierPersonOrg) {

  async function xml2json(xml) {
    return new Promise((resolve, reject) => {
      parser.parseString(xml, function (err, json) {
      if (err)
        reject(err);
      else
        resolve(json);
    });

  });
  }


  async function readFile (filePath)  {
    let F = 0;
    let T = 0;

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath);
      const result =  await xml2json(file);

      result.chunkList.chunk.forEach(c => {
        c.sentence[0].tok.forEach(t => {

        const categories = t.ann.filter(a => a._ !== '0').map(a => {
        return a.$.chan;
    })

      const persName = categories.indexOf('nam_liv_person') >= 0;
      const orgName = categories.indexOf('nam_org_institution') >= 0;

      let result = 'other';

      if (persName) {
        result = 'persName';
      }

      if (orgName) {
        result = 'orgName';
      }

      const word = t.orth[0];

      const moj =  classifierPersonOrg.getClassifications(word)[0].label;

      if (result === moj) {
        T+= 1;
      } else {
        F += 1;
      }
    })
    })
    }

    return {
      T: T,
      F: F
    };
  };

  readFile('./liner.xml').then(r => {
    const ALL = r.T + r.F;
    console.log(r.T/ALL)
  })


});