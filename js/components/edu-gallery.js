/* Educational Resources hero — same cover-flow pattern as Monthly Lab Reports */
const eduGallery = [
    { title: 'Research', label: 'Pathology Research', image: '../assets/images/research/research-hero.jpg' },
    { title: 'Featured Case', label: 'Case Spotlight', image: '../assets/images/research/featured-research.png' },
    { title: 'Lab Reports', label: 'Laboratory Communications', image: '../assets/images/research/laboratory-communications.png' },
    { title: 'Education', label: 'Educational Presentations', image: '../assets/images/research/educational-presentation.png' },
    { title: 'Perspectives', label: 'Pathology Perspectives', image: '../assets/images/research/blogs-pathology.png' },
    { title: 'Publications', label: 'Scientific Publications', image: '../assets/images/research/featured-journal-article.png' }
];

document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-eg]');
    if (!root) return;
    const n = eduGallery.length;
    let active = 0, startX = null, moved = false;
    const pad = v => String(v).padStart(2, '0');

    root.innerHTML = `
        <div class="rf-stage eg-stage" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Educational resources gallery. Use left and right arrow keys to browse.">
            ${eduGallery.map((item, i) => `
                <button type="button" class="rf-cover eg-cover" style="--h:${i}" aria-label="${item.label}">
                    <img src="${item.image}" alt="" loading="lazy">
                    <span class="rf-top">${item.title}</span>
                    <h3><span class="rf-month">${item.label}</span></h3>
                </button>`).join('')}
        </div>
        <div class="rf-bar">
            <button type="button" class="rf-btn" data-dir="-1" aria-label="Previous resource">&larr;</button>
            <div class="rf-meta"><span class="rf-count" aria-live="polite"></span><span class="rf-name"></span></div>
            <button type="button" class="rf-btn" data-dir="1" aria-label="Next resource">&rarr;</button>
        </div>`;

    const stage = root.querySelector('.rf-stage'), covers = [...root.querySelectorAll('.rf-cover')];
    const count = root.querySelector('.rf-count'), name = root.querySelector('.rf-name');

    const render = () => {
        const gap = innerWidth < 640 ? 46 : 58;
        covers.forEach((c, i) => {
            const o = i - active, a = Math.abs(o), s = Math.sign(o);
            c.style.transform = `translate(-50%,-50%) translateX(${o * gap}%) translateZ(${-a * 140}px) rotateY(${-s * Math.min(a, 2) * 36}deg) scale(${a ? .86 : 1})`;
            c.style.zIndex = n - a;
            c.style.opacity = a > 3 ? 0 : 1 - a * .18;
            c.style.pointerEvents = a > 3 ? 'none' : 'auto';
            c.classList.toggle('is-active', !a);
            c.tabIndex = a ? -1 : 0;
        });
        const item = eduGallery[active];
        count.textContent = `${pad(active + 1)} / ${pad(n)}`;
        name.textContent = item.label;
    };
    const go = i => { active = Math.max(0, Math.min(n - 1, i)); render(); };

    root.querySelectorAll('.rf-btn').forEach(b => b.addEventListener('click', () => go(active + Number(b.dataset.dir))));
    stage.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
    });
    covers.forEach((c, i) => c.addEventListener('click', () => { if (!moved) go(i); }));

    stage.addEventListener('pointerdown', e => { startX = e.clientX; moved = false; });
    addEventListener('pointerup', e => {
        if (startX === null) return;
        const d = e.clientX - startX; startX = null;
        if (Math.abs(d) > 50) { moved = true; go(active + (d < 0 ? 1 : -1)); setTimeout(() => moved = false, 50); }
    });
    addEventListener('resize', render);
    render();
});
