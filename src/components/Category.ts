const TEMPLATE = `
<style>
    .title {
      position: sticky;
      top: 0;
      z-index: 1;
      background: #eee;
      border-bottom: 2px solid #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-family: 'Edu SA Beginner', sans-serif;
    }
    
    .title-cat {
      font-size: 2rem;
      font-weight: bold;
      padding: 0.5rem 2rem;
    }
    
    .title-total, .title-percent {
      font-size: 1.5rem;
      padding: 0.5rem 2rem;
    }
</style>
    <div class="title">
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
