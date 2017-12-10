const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const path = require('path');

const allData = [];


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
  const rData = {};

  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath);
    const result =  await xml2json(file);
    const data = result.teiCorpus.TEI[0].text[0].body[0].p;
    data.forEach(d => {
      d.s.forEach(e => {
      if (e.seg) {
      e.seg.forEach(f => {
        const obj = {};
      f.fs.forEach(g => {
        g.f.forEach(h => {
        let data = h;

      if (data.string) {
        data = data.string[0];
      } else if(data.symbol) {
        data = data.symbol[0].$.value;
      }

      obj[h.$.name] = data;
    })
    });

      if (obj.type === 'persName' || obj.type === 'orgName' ) {
        if (obj.orth) {
          rData[obj.orth] = obj.type;
        }

        if (obj.base) {
          rData[obj.base] = obj.type;
        }
      } else if(obj.type) {
        if (obj.orth) {
          rData[obj.orth] = 'other'
        }

        if (obj.base) {
          rData[obj.base] = 'other';
        }
      }
    })
    }
  })
  })
  }

  return rData;
};

async function getAll() {
  const dir = './data/';
  const fileName = 'ann_named.xml';
  let allData = {};

  const dirs = fs.readdirSync(dir)
    .filter(f => fs.statSync(path.join(dir, f))
    .isDirectory());

  for (let f of dirs) {
    const data = await readFile( dir + '/' + f + '/' + fileName);
    allData = Object.assign(allData, data);
  }

  fs.writeFileSync('./result.json', JSON.stringify(allData));
}

getAll();



