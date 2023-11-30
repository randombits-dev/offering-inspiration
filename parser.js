import fs from 'fs';

const parseFile = (fileName) => {
  const data = fs.readFileSync(fileName, 'utf8');
  const lines = data.split('\n');

  const projects = [];
  const projectsWithUrl = [];

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


      }
    } catch (e) {
      console.log('Error parsing JSON', e);
    }
  });

  fs.writeFileSync('data/projects.json', JSON.stringify(projects));
  fs.writeFileSync('data/projectsWithUrl.json', JSON.stringify(projectsWithUrl));
};

parseFile('raw/Kickstarter_2023-11-16T03_20_10_045Z.json');
