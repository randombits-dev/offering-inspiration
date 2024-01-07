import"./hoisted.xg8AAIAA.js";const l=`
  <div class="title">
    <a href="/"><img class="icon" src="/logo.svg"/></a>
    <div class="title-cat"></div>
    <div class="title-percent"></div>
    <div class="title-total"></div>
  </div>
    <div class="card-list"></div>
    <div id="nextPage"></div>
`;class h extends HTMLElement{constructor(){super();let i=[],e=0;const c=12;this.innerHTML=l;function n(){if(e>=i.length)return;const s=document.querySelector(".card-list");i.slice(e,e+c).forEach(t=>{const r=document.createElement("project-card");r.setAttribute("id",t.id),r.setAttribute("name",t.name),r.setAttribute("blurb",t.blurb),r.setAttribute("img",t.img),r.setAttribute("url",t.url),r.setAttribute("date",t.funded),s.appendChild(r)}),e+=c}fetch(`/Merged/${this.getAttribute("cat")}.json`).then(s=>s.json()).then(s=>{i=s.sort(()=>Math.random()-.5),this.querySelector(".title-cat").innerHTML=this.getAttribute("cat"),this.querySelector(".title-total").innerHTML=i.length+" items",n(),n()}),window.addEventListener("scroll",()=>{const{scrollTop:s,scrollHeight:t,clientHeight:r}=document.documentElement,a=s/(t-r),d=Math.round(a*Math.min(e,i.length)/i.length*100);this.querySelector(".title-percent").innerHTML=d+"% viewed"}),new IntersectionObserver(s=>{s.forEach(t=>{t.isIntersecting&&n()})},{root:null,rootMargin:"0px",threshold:.1}).observe(this.querySelector("#nextPage"))}}customElements.define("category-projects",h);const m=`
  <div class="card">
    <div class="card-image"></div>
    <div class="card-header"></div>
    <div class="card-body"></div>
    <report-menu/>    
</div>
  </div>
`;class g extends HTMLElement{connectedCallback(){this.innerHTML=m,this.querySelector(".card-image").innerHTML=`<img src="${this.getAttribute("img")}"/>`,this.querySelector(".card-header").innerHTML=this.getAttribute("name"),this.querySelector(".card-body").innerHTML=this.getAttribute("blurb"),this.addEventListener("click",()=>{window.open(this.getAttribute("url"),"_blank")})}}customElements.define("project-card",g);const u='<svg xmlns="http://www.w3.org/2000/svg" fill="green" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',v=`
    <span id="icon">
    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
   </span>
    <span id="title">Report</span>
  <div class="card-report-menu">
    <div class="card-report-menu__item" data-report="link">Broken Link</div>
    <div class="card-report-menu__item" data-report="purchasable">Product Not Purchasable</div>
    <div class="card-report-menu__item">Cancel</div>
  </div>
`;class p extends HTMLElement{clickListener=i=>{i.stopPropagation();const e=i.target;if(e.classList.contains("card-report-menu__item")){if(e.dataset.report){const n=e.closest("project-card")?.getAttribute("id");fetch(atob("aHR0cHM6Ly9naWZ0LWFwaS5yYW5kb21iaXRzLndvcmtlcnMuZGV2"),{method:"PUT",body:JSON.stringify({id:n,reason:e.innerText})}),this.querySelector("#title").innerHTML="Thanks!",this.querySelector("#icon").innerHTML=u,this.removeEventListener("click",this.clickListener)}this.toggle()}else this.toggle()};connectedCallback(){this.innerHTML=v,this.addEventListener("click",this.clickListener)}toggle(){this.classList.toggle("show")}}customElements.define("report-menu",p);
