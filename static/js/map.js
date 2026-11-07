// travel map
function initMap() {
  const places = window.PLACES || [];
  const map = L.map('map', { scrollWheelZoom: false, worldCopyJump: true, zoomControl: true, minZoom: 2 });
  L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ', maxZoom: 16
  }).addTo(map);
  L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }).addTo(map);

  const group = L.featureGroup().addTo(map);
  places.forEach(p => {
    const m = L.marker([p.lat, p.lon], {
      icon: L.divIcon({ className: '', html: '<div class="pin"></div>', iconSize: [10, 10], iconAnchor: [5, 5] }),
      keyboard: false
    }).addTo(group);
    m.bindTooltip(p.n, { direction: 'top', offset: [0, -7] });
    m.bindPopup('<strong>' + p.n + '</strong>');
    window['m_' + p.i] = m;
  });

  map.invalidateSize();
  const frame = () => {
    if (innerWidth > 900) map.fitBounds(group.getBounds().pad(0.12), { maxZoom: 4, animate: false });
    else map.setView([18, 95], 2, { animate: false });
  };
  frame();
  setTimeout(frame, 220);

  document.querySelectorAll('.region p').forEach(el => el.addEventListener('click', () => {
    const m = window['m_' + el.dataset.i];
    if (!m) return;
    map.flyTo(m.getLatLng(), 4, { duration: 1.1 });
    m.openPopup();
  }));

  addEventListener('resize', () => map.invalidateSize());
}

if (document.readyState === 'complete') initMap();
else addEventListener('load', initMap);
