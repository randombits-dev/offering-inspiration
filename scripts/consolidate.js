import fs from 'fs';
import {parse} from "yaml";

const meta = parse(fs.readFileSync("src/data/meta.yml", 'utf8'));

const urlsToAutoAccept = [
  'etsy.com',
  'amazon.com'
];

const storeFronts = [
  'squareup.com',
  'shopify.com'
];

async function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}


const queueExecuter = (projectsToCheck) => {
  let good = 0;
  let bad = 0;
  let error = 0;
  return new Promise((resolve, reject) => {
    const validProjects = [];
    const invalidProjects = [];
    const check = async () => {
      if (projectsToCheck.length === 0) {
        return false;
      }
      const project = projectsToCheck.shift();
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(projectsToCheck.length + ' left');
      return fetch(project.url, {method: 'HEAD'}).then(res => {
        if (res.status < 400) {
          good++;
          validProjects.push(project);
        } else {
          bad++;
          const isStorefront = storeFronts.find(url => project.url.indexOf(url) > -1);
          if (!isStorefront) {
            const url = new URL(project.url);
            if (url.pathname.length > 2) {
              project.url = `https://${url.hostname}`;
              projectsToCheck.push(project);
            } else {
              invalidProjects.push(project);
            }
          } else {
            invalidProjects.push(project);
          }
        }
        return sleep(1000).then(() => check());
      }).catch(() => {
        error++;
        // console.log('error', project.url);
        return sleep(1000).then(() => check());
      });
    };
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(check());
    }
    Promise.allSettled(promises).then(() => {
      console.log('good', good);
      console.log('bad', bad);
      console.log('error', error);
      resolve({valid: validProjects, bad: invalidProjects});
    });
  });
};

const handleCategory = async (cat, value) => {
  const filesToRead = value.sub.map(sub => `public/${value.cat}/${sub}.json`);
  const queue = [];
  const autoAccept = [];
  filesToRead.forEach(file => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.forEach(project => {
      const match = urlsToAutoAccept.find(url => project.url.indexOf(url) > -1);
      if (match) {
        autoAccept.push(project);
      } else {
        queue.push(project);
      }
    });
  });
  const {valid, bad} = await queueExecuter(queue);
  fs.writeFileSync(`public/Merged/${cat}.json`, JSON.stringify([...valid, ...autoAccept]));
  fs.writeFileSync(`public/Bad/${cat}.json`, JSON.stringify(bad));
};

for (const [key, value] of Object.entries(meta)) {
  console.log('running: ' + key);
  await handleCategory(key, value);
}
