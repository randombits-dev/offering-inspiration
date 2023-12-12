const TEMPLATE = `
  <div class="title">
    <a href="/"><img class="icon" src="/logo.svg"/></a>
    <div class="title-cat"></div>
    <div class="title-percent"></div>
    <div class="title-total"></div>
  </div>
    <div class="card-list"></div>
`;

export class CategoryProjects extends HTMLElement {
  constructor() {
    super();
    let projects: any[] = [];
    let index = 0;
    const pageSize = 12;
    this.innerHTML = TEMPLATE;

    function renderProjects() {

      if (index >= projects.length) {
        return;
      }
      const cardList = document.querySelector('.card-list')!;
      projects.slice(index, index + pageSize).forEach(p => {
        const card = document.createElement('project-card');
        card.setAttribute('id', p.id);
        card.setAttribute('name', p.name);
        card.setAttribute('blurb', p.blurb);
        card.setAttribute('img', p.imgs.med);
        card.setAttribute('url', p.url);
        card.setAttribute('date', p.funded);
        cardList.appendChild(card);
      });

      index += pageSize;
    }


    fetch(`/Merged/${this.getAttribute('cat')}.json`)
        .then(res => res.json())
        .then(data => {
          projects = data.sort(() => Math.random() - 0.5);
          this.querySelector('.title-cat')!.innerHTML = this.getAttribute('cat')!;
          this.querySelector('.title-total')!.innerHTML = projects.length + ' items';
          renderProjects();
          renderProjects();
        });


    window.addEventListener('scroll', () => {
      const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
      const percent = scrollTop / (scrollHeight - clientHeight);
      const itemPercent = Math.round(percent * Math.min(index, projects.length) / projects.length * 100);
      this.querySelector('.title-percent')!.innerHTML = itemPercent + '% viewed';

      if (clientHeight + scrollTop >= scrollHeight - 50) {
        renderProjects();
      }
    });
  }
}

customElements.define('category-projects', CategoryProjects);
