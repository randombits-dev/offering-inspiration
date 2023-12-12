import fs from 'fs';

const projects = JSON.parse(fs.readFileSync("src/data/projectsWithUrl.json", 'utf8'));
const buyable = JSON.parse(fs.readFileSync("src/data/buyable.json", 'utf8'));
const notBuyable = JSON.parse(fs.readFileSync("src/data/not.json", 'utf8'));
const bad = JSON.parse(fs.readFileSync("src/data/bad.json", 'utf8'));
const ignoredUrls = JSON.parse(fs.readFileSync("src/data/ignoreUrls.json", 'utf8'));
const seen = buyable.concat(notBuyable).concat(bad);
const seenMap = {};
seen.forEach(s => seenMap[s.id] = true);

projects.filter(p => !seenMap[p.id]).forEach((project) => {
    const match = ignoredUrls.find(url => project.url.indexOf(url) > -1);
    if (match) {
        console.log("reject", project.url);
        notBuyable.push({id: "" + project.id});
    } else {
        console.log("accept", project.url);
        buyable.push({id: "" + project.id});
    }
});

fs.writeFileSync('src/data/not.json', JSON.stringify(notBuyable));
fs.writeFileSync('src/data/buyable.json', JSON.stringify(buyable));
