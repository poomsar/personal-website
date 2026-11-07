// justified rows + lightbox for an album page
const grid = document.querySelector('.grid');
const figs = grid ? [...grid.querySelectorAll('figure')] : [];
const GAP = 3;

function build() {
  const W = grid.clientWidth - GAP * 2;
  const maxH = innerWidth < 700 ? 300 : 440;
  grid.innerHTML = '';
  let row = [], sum = 0;
  const flush = (last) => {
    const avail = W - GAP * (row.length - 1);
    let h = avail / sum;
    if (last) h = Math.min(h, maxH);
    const r = document.createElement('div');
    r.className = 'row';
    row.forEach(f => {
      f.style.width = (+f.dataset.ar * h) + 'px';
      f.style.height = h + 'px';
      r.appendChild(f);
    });
    grid.appendChild(r);
    row = []; sum = 0;
  };
  figs.forEach(f => {
    row.push(f); sum += +f.dataset.ar;
    if (sum * maxH > W - GAP * (row.length - 1)) flush(false);
  });
  if (row.length) flush(true);
}

if (grid) {
  build();
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 150); });
}

const lb = document.querySelector('.lb');
if (lb) {
  const big = lb.querySelector('img');
  const cap = lb.querySelector('.c');
  const shots = [...document.querySelectorAll('[data-shot]')].sort((a, b) => a.dataset.pos - b.dataset.pos);
  let i = 0;
  const show = (k) => {
    i = (k + shots.length) % shots.length;
    big.src = shots[i].dataset.full || shots[i].src;
    cap.textContent = (i + 1) + ' / ' + shots.length;
  };
  shots.forEach(sh => sh.addEventListener('click', () => { show(+sh.dataset.pos); lb.classList.add('open'); }));
  lb.addEventListener('click', e => { if (e.target.tagName !== 'IMG') lb.classList.remove('open'); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowRight') show(i + 1);
    if (e.key === 'ArrowLeft') show(i - 1);
  });
}
