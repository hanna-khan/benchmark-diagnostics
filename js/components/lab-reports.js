/* Monthly Lab Reports — 3D cover-flow. Data unchanged. */
const labReports = [
    { month: 'August', year: 2026, title: 'The Lab Report', file: '../downloads/lab-reports/The Lab Report August 2026.pdf' },
    { month: 'July', year: 2026, title: 'The Lab Report', file: '../downloads/lab-reports/The Lab Report July 2026.pdf' },
    { month: 'June', year: 2026, title: 'The Lab Report', file: '../downloads/lab-reports/The Lab Report_ June 2026.pdf' },
    { month: 'May', year: 2026, title: 'The Lab Report', file: '../downloads/lab-reports/The Lab Report May 2026.pdf' },
    { month: 'April', year: 2026, title: 'The Lab Report', file: '../downloads/lab-reports/The Lab Report_ April 2026.pdf' },
    { month: 'March', year: 2026, title: 'The Lab Report', file: '../downloads/lab-reports/The Lab Report_ March 2026.pdf' },
    { month: 'February', year: 2026, title: 'The Lab Report', file: '../downloads/lab-reports/The Lab Report_ February 2026.pdf' },
    { month: 'January', year: 2026, title: 'The Lab Report', file: '../downloads/lab-reports/The Lab Report_ January 2026.pdf' }
];

document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-rf]');
    if (!root) return;
    const n = labReports.length;
    let active = 0, startX = null, moved = false;
    const pad = v => String(v).padStart(2, '0');

    root.innerHTML = `
        <div class="rf-stage" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Monthly lab reports. Use left and right arrow keys to browse.">
            ${labReports.map((r, i) => `
                <a class="rf-cover" href="${encodeURI(r.file)}" target="_blank" rel="noopener noreferrer" aria-label="View ${r.month} ${r.year} Lab Report" style="--h:${i}">
                    <span class="rf-top">${r.title}</span>
                    <h3><span class="rf-month">${r.month}</span><span class="rf-year">${r.year}</span></h3>
                    <span class="rf-brand">Benchmark Diagnostics</span>
                </a>`).join('')}
        </div>
        <div class="rf-bar">
            <button type="button" class="rf-btn" data-dir="-1" aria-label="Newer report">&larr;</button>
            <div class="rf-meta"><span class="rf-count" aria-live="polite"></span><span class="rf-name"></span></div>
            <button type="button" class="rf-btn" data-dir="1" aria-label="Older report">&rarr;</button>
        </div>
        <a class="rf-open pill pill-ghost" target="_blank" rel="noopener noreferrer"><span>View Report ↗</span></a>`;

    const stage = root.querySelector('.rf-stage'), covers = [...root.querySelectorAll('.rf-cover')];
    const count = root.querySelector('.rf-count'), name = root.querySelector('.rf-name'), open = root.querySelector('.rf-open');

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
        const r = labReports[active];
        count.textContent = `${pad(active + 1)} / ${pad(n)}`;
        name.textContent = `${r.month} ${r.year}`;
        open.href = encodeURI(r.file);
        open.setAttribute('aria-label', `View ${r.month} ${r.year} Lab Report`);
    };
    const go = i => { active = Math.max(0, Math.min(n - 1, i)); render(); };

    root.querySelectorAll('.rf-btn').forEach(b => b.addEventListener('click', () => go(active + Number(b.dataset.dir))));
    stage.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
    });
    covers.forEach((c, i) => c.addEventListener('click', e => { if (moved || i !== active) { e.preventDefault(); if (!moved) go(i); } }));

    stage.addEventListener('pointerdown', e => { startX = e.clientX; moved = false; });
    addEventListener('pointerup', e => {
        if (startX === null) return;
        const d = e.clientX - startX; startX = null;
        if (Math.abs(d) > 50) { moved = true; go(active + (d < 0 ? 1 : -1)); setTimeout(() => moved = false, 50); }
    });
    stage.addEventListener('pointermove', e => {
        const c = covers[active]; if (!c || !matchMedia('(hover: hover)').matches) return;
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
    addEventListener('resize', render);
    render();
});
