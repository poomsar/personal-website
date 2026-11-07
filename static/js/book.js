// flip book
const el = document.getElementById('book');
if (el && window.St) {
  const fit = () => {
    const w = Math.min(1200, innerWidth * 0.94);
    el.style.width = w + 'px';
    el.style.height = Math.round(w * 792 / 1224) + 'px';
  };
  fit();

  const pf = new St.PageFlip(el, {
    width: 612, height: 792, size: 'stretch',
    minWidth: 260, maxWidth: 600, minHeight: 340, maxHeight: 780,
    showCover: false, usePortrait: true, mobileScrollSupport: true,
    drawShadow: true, maxShadowOpacity: 0.28, flippingTime: 750,
    showPageCorners: true, useMouseEvents: true
  });
  pf.loadFromHTML(el.querySelectorAll('.page'));

  const num = document.getElementById('num');
  const total = el.querySelectorAll('.page').length;
  const sync = () => num.textContent = (pf.getCurrentPageIndex() + 1) + ' / ' + total;
  pf.on('flip', sync);
  sync();

  document.getElementById('next').onclick = () => pf.flipNext();
  document.getElementById('prev').onclick = () => pf.flipPrev();
  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') pf.flipNext();
    if (e.key === 'ArrowLeft') pf.flipPrev();
  });
}
