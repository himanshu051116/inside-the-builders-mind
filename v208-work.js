// Keep the V20.7 interactive Work experience whole while replacing its top-level
// navigation with real pages. Legacy archive controls remain functional.
function setup(){
  document.body.classList.add('v208WorkPage');
  const nav=document.getElementById('main-nav');
  const links={
    '#v20-workspace':'/work/',
    '#case-files':'/evidence/',
    '#field-proof':'/evidence/#captures',
    '#interactive-lab':'/lab/',
    '#about':'/#about',
    '#contact':'/#contact'
  };
  nav?.querySelectorAll('a[href]').forEach(a=>{
    const dest=links[a.getAttribute('href')];if(dest)a.href=dest;
  });
  const brand=document.querySelector('.header .brand');
  if(brand)brand.href='/';
  const menu=document.querySelector('.headerInner .nav');
  if(menu&&!menu.querySelector('[href="/projects/"]')){
    const a=document.createElement('a');a.href='/projects/';a.textContent='Project index';menu.prepend(a);
  }
  const head=document.querySelector('.headerContact');if(head)head.href='/#contact';
  // The existing V19 proof player still belongs to the DOM for both recordings.
  // It is opened by the V20 workspace's actual video control.
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
else setup();
