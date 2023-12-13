import fs from 'fs';
import readline from 'readline';

const ignoredUrls = JSON.parse(fs.readFileSync("src/data/ignoreUrls.json", 'utf8'));

const files = fs.readdirSync('X:/Kick');
const categories = {};
const categories2 = {};
const seen = new Set();

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
      if (data.state === 'successful') {

        const cat = data.category.parent_name || 'none';
        const cat2 = data.category.name || 'none';

        const item = {
          id: data.id,
          name: data.name,
          blurb: data.blurb,
          url: data.profile.link_url,
          // cat: data.category.parent_name,
          // cat2: data.category.name,
          // funded: data.deadline,
          // pledged: data.usd_pledged,
          // backers: data.backers_count,
          img: data.photo.ed
        };


        if (item.url) {
          const match = ignoredUrls.find(url => item.url.indexOf(url) > -1);
          if (!match) {
            if (!categories[cat]) {
              categories[cat] = {};
            }
            if (!categories2[cat2]) {
              categories2[cat2] = [];
            }
            categories2[cat2].push(item);
            categories[cat][cat2] = categories2[cat2];
          }
        }


      }
    } catch (e) {
      console.log('Error parsing JSON', e);
    }
  }
}

const catOut = Object.entries(categories).filter(([key, value]) => key && key !== 'none').map(([key, value]) => {
  const sub = Object.entries(value).map(([key2, value2]) => {
    try {
      fs.mkdirSync(`public/${key}`);
    } catch (e) {
      // ignore
    }
    fs.writeFileSync(`public/${key}/${key2}.json`, JSON.stringify(value2));
    return key2;
  });
  return {name: key, sub};
});

if (categories2['none']) {
  fs.writeFileSync('public/none.json', JSON.stringify(categories2['none']));
}

fs.writeFileSync('src/data/categories.json', JSON.stringify(catOut));
