import fs from 'fs';
import {parse} from "yaml";

const meta = parse(fs.readFileSync("src/data/meta.yml", 'utf8'));
console.log(meta);

Object.entries(meta).forEach(([key, value]) => {
  const filesToRead = value.sub.map(sub => `public/${value.cat}/${sub}.json`);
  const allData = [];
  filesToRead.forEach(file => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    allData.push(...data);
  });
  fs.writeFileSync(`public/Merged/${key}.json`, JSON.stringify(allData));
});
