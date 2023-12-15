const TEMPLATE = `
  <div class="lite-card">
    <div class="card-header"></div>
    <div class="card-body"></div>
</div>
  </div>
`;

export class Card extends HTMLElement {
  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.querySelector('.card-header')!.innerHTML = this.getAttribute('name')!;
    this.querySelector('.card-body')!.innerHTML = this.getAttribute('blurb')!;
    this.addEventListener('click', () => {
      window.open(this.getAttribute('url')!, '_blank');
    });
  }
}

customElements.define('lite-card', Card);
