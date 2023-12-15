import fs from 'fs';
import readline from 'readline';

const files = fs.readdirSync('X:/Kick');
const categories = {};
const categories2 = {};
const seen = new Set();
let total = 0;
let successful = 0;

for await (const file of files) {
  // if (file.indexOf('Kickstarter_2023') !== 0) continue;
  const fileStream = fs.createReadStream(`X:/Kick/${file}`);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const project = JSON.parse(line);

      const data = project.data;
      if (seen.has(data.id)) {
        continue;
      }
      seen.add(data.id);
      total++;

      const cat = data.category.parent_name || 'none';
      const cat2 = data.category.name || 'none';

      if (!categories[cat]) {
        categories[cat] = {};
      }
      if (!categories2[cat2]) {
        categories2[cat2] = {total: 0, successful: 0};
      }
      categories2[cat2].total++;
      categories[cat][cat2] = categories2[cat2];

      if (data.state === 'successful') {
        successful++;
        categories2[cat2].successful++;
      }
    } catch (e) {
      console.log('Error parsing JSON', e);
    }
  }
}

const catOut = Object.entries(categories).filter(([key, value]) => key && key !== 'none').map(([key, value]) => {
  const sub = Object.values(value).reduce((count, item) => {
    return {total: count.total + item.total, successful: count.successful + item.successful};
  }, {total: 0, successful: 0});
  return {name: key, total: sub.total, successful: sub.successful};
});

fs.writeFileSync('data/count.json', JSON.stringify(catOut));
