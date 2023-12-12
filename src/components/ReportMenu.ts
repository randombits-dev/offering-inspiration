const checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" fill="green" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';

const TEMPLATE = `
    <span id="icon">
    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
   </span>
    <span id="title">Report</span>
  <div class="card-report-menu">
    <div class="card-report-menu__item" data-report="link">Broken Link</div>
    <div class="card-report-menu__item" data-report="purchasable">Product Not Purchasable</div>
    <div class="card-report-menu__item">Cancel</div>
  </div>
`;

export default class ReportMenu extends HTMLElement {
  clickListener = (e: MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.classList.contains('card-report-menu__item')) {
      if (target.dataset.report) {
        const card = target.closest('my-card');
        const id = card?.getAttribute('id');
        void fetch(atob(`aHR0cHM6Ly9naWZ0LWFwaS5yYW5kb21iaXRzLndvcmtlcnMuZGV2`), {
          method: 'PUT',
          body: JSON.stringify({
            id,
            reason: target.innerText,
          })
        });
        this.querySelector('#title')!.innerHTML = 'Thanks!';
        this.querySelector('#icon')!.innerHTML = checkSvg;
        this.removeEventListener('click', this.clickListener);
      }
      this.toggle();
    } else {
      this.toggle();
    }
  };

  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.addEventListener('click', this.clickListener);
  }

  toggle() {
    this.classList.toggle('show');
  }
}

