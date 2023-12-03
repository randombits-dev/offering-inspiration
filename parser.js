import fs from 'fs';

const buyable = JSON.parse(fs.readFileSync("src/data/buyable.json", 'utf8'));
const buyMap = {};
buyable.forEach(s => buyMap[s.id] = s);

const data = fs.readFileSync('raw/Kickstarter_2023-11-16T03_20_10_045Z.json', 'utf8');
const lines = data.split('\n');

const projects = [];
const projectsWithUrl = [];
const categories = {};
const buyableProjects = [];

lines.forEach((line) => {
  try {
    const project = JSON.parse(line);
    const data = project.data;
    if (data.state === 'successful') {

      const item = {
        id: data.id,
        name: data.name,
        blurb: data.blurb,
        url: data.profile.link_url,
        cat: data.category.parent_name,
        cat2: data.category.name,
        funded: data.deadline,
        pledged: data.usd_pledged,
        backers: data.backers_count,
        imgs: {
          full: data.photo.full,
          sm: data.photo.little
        }
      };
      projects.push(item);

      if (data.profile.link_url) {
        projectsWithUrl.push(item);
      }

      if (!categories[item.cat]) {
        categories[item.cat] = new Set();
      }
      categories[item.cat].add(item.cat2);

      if (buyMap[item.id]) {
        buyableProjects.push({...item, ...buyMap[item.id]});
      }
    }
  } catch (e) {
    console.log('Error parsing JSON', e);
  }
});

const catOut = Object.entries(categories).map(([key, value]) => {
  return {name: key, sub: new Array(...value)};
});

fs.writeFileSync('src/data/categories.json', JSON.stringify(catOut));
fs.writeFileSync('src/data/projects.json', JSON.stringify(projects));
fs.writeFileSync('src/data/projectsWithUrl.json', JSON.stringify(projectsWithUrl));
fs.writeFileSync('src/data/buyableProjects.json', JSON.stringify(buyableProjects));
