const TEMPLATE = `
  <div class="card">
    <div class="card-image"></div>
    <div class="card-header"></div>
    <div class="card-body"></div>
    <report-menu/>    
</div>
  </div>
`;

export default class Card extends HTMLElement {
  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.querySelector('.card-image')!.innerHTML = `<img src="${this.getAttribute('img')}"/>`;
    this.querySelector('.card-header')!.innerHTML = this.getAttribute('name')!;
    this.querySelector('.card-body')!.innerHTML = this.getAttribute('blurb')!;
    this.addEventListener('click', () => {
      window.open(this.getAttribute('url')!, '_blank');
    });
  }
}
