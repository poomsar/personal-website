// header behaviour + mobile menu
const bar = document.querySelector('.bar');
const onScroll = () => bar.classList.toggle('solid', scrollY > 40);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

const menu = document.querySelector('.menu');
if (menu) {
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    document.body.classList.toggle('locked', open);
  };
  document.querySelector('.burger')?.addEventListener('click', () => setMenu(true));
  menu.querySelector('.close')?.addEventListener('click', () => setMenu(false));
  document.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  menu.addEventListener('click', e => { if (e.target === menu) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}
