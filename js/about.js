(() => {
    "use strict";
    const doc = document.documentElement, $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    requestAnimationFrame(() => requestAnimationFrame(() => doc.classList.add("loaded")));

    /* Header + mobile menu */
    const header = $("[data-header]"), toggle = $(".menu-toggle"), nav = $("#main-navigation");
    toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", open); toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        nav.classList.toggle("is-open", open); document.body.style.overflow = open ? "hidden" : "";
    });
    addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("is-open")) { toggle.click(); toggle.focus(); } });
    $$("a", nav).forEach(a => a.addEventListener("click", () => nav.classList.contains("is-open") && toggle.click()));

    /* Scroll reveal */
    const els = $$("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) els.forEach(e => e.classList.add("is-in"));
    else { const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { threshold: .15, rootMargin: "0px 0px -6% 0px" }); els.forEach(e => io.observe(e)); }

    /* Magnetic pills */
    if (fine && !reduce) $$("[data-magnetic]").forEach(el => {
        el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
        el.addEventListener("pointerleave", () => el.style.transform = "");
    });

    /* Tilt + light on panels/cards (pointer only; content is always visible, so touch/keyboard lose nothing) */
    if (fine && !reduce) $$("[data-tilt]").forEach(el => {
        const k = el.classList.contains("mv-panel") ? 5 : 7;
        el.addEventListener("pointermove", e => {
            const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            el.style.setProperty("--ry", ((x - .5) * k).toFixed(2)); el.style.setProperty("--rx", ((.5 - y) * k).toFixed(2));
            el.style.setProperty("--mx", x * 100 + "%"); el.style.setProperty("--my", y * 100 + "%");
        });
        el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", 0); el.style.setProperty("--ry", 0); });
    });

    /* Research orbit follows cursor across the section */
    const orbit = $("[data-orbit]");
    if (orbit && fine && !reduce) orbit.closest(".rx").addEventListener("pointermove", e => {
        const r = orbit.getBoundingClientRect();
        orbit.style.setProperty("--ry", clamp((e.clientX - r.left - r.width / 2) / innerWidth, -.5, .5) * 40);
        orbit.style.setProperty("--rx", clamp((e.clientY - r.top - r.height / 2) / innerHeight, -.5, .5) * -40);
    });

    /* Story: split words (kept in DOM order for screen readers) */
    const story = $("[data-story]"), paras = $$("[data-words]");
    const wordSets = paras.map(p => { const t = p.textContent.trim().split(/\s+/); p.textContent = ""; return t.map((w, i) => { const s = document.createElement("span"); s.className = "w"; s.textContent = w; p.append(s, i < t.length - 1 ? " " : ""); return s; }); });

    /* Cell field: stained-tissue cells, parallax + cursor focus. Canvas 2D, paused offscreen. */
    function field(host, n) {
        const cv = $(".a-canvas", host), ctx = cv.getContext("2d");
        if (!ctx) return;
        let W, H, dpr, vis = false, raf = 0, t = 0, mx = -1e3, my = -1e3, sx = .5, sy = .5, tx = .5, ty = .5;
        const cells = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), z: .25 + Math.random() * .75, r: 30 + Math.random() * 80, p: Math.random() * 6.28, s: .15 + Math.random() * .3 }));
        cells.sort((a, b) => a.z - b.z);
        const size = () => { dpr = Math.min(devicePixelRatio || 1, 1.5); W = host.clientWidth; H = host.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            const sc = W < 700 ? .65 : 1, rect = host.getBoundingClientRect(), off = -rect.top;
            for (const c of cells) {
                const x = ((c.x * W + Math.sin(t * c.s + c.p) * 34 + (sx - .5) * c.z * 90) % (W + 200) + W + 200) % (W + 200) - 100;
                const y = ((c.y * H + Math.cos(t * c.s * .8 + c.p) * 26 + (sy - .5) * c.z * 60 - off * c.z * .22) % (H + 200) + H + 200) % (H + 200) - 100;
                const f = clamp(1 - Math.hypot(x - mx, y - my) / 260), r = c.r * c.z * sc * 1.35 * (1 + f * .18), a = c.z * (1 + f * 1.1);
                let g = ctx.createRadialGradient(x, y, r * .1, x, y, r);
                g.addColorStop(0, `rgba(229,143,176,${.3 * a})`); g.addColorStop(.7, `rgba(23,101,163,${.12 * a})`); g.addColorStop(1, `rgba(23,101,163,0)`);
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
                ctx.strokeStyle = `rgba(95,208,230,${.16 * a})`; ctx.lineWidth = 1; ctx.stroke();
                ctx.fillStyle = `rgba(95,150,220,${.3 * a})`; ctx.beginPath(); ctx.arc(x + r * .12, y - r * .08, r * .3, 0, 6.283); ctx.fill();
            }
        };
        const loop = () => { t += .016; sx += (tx - sx) * .05; sy += (ty - sy) * .05; draw(); raf = vis ? requestAnimationFrame(loop) : 0; };
        const sync = () => { if (vis && !raf && !reduce) raf = requestAnimationFrame(loop); };
        size(); draw(); host.classList.add("gl");
        addEventListener("resize", () => { size(); draw(); });
        if (reduce) return;
        host.addEventListener("pointermove", e => { const r = host.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; tx = mx / W; ty = my / H; });
        host.addEventListener("pointerleave", () => { mx = my = -1e3; tx = ty = .5; });
        new IntersectionObserver(([e]) => { vis = e.isIntersecting; sync(); }).observe(host);
    }
    const hero = $("[data-hero]"), cta = $("[data-cta]");
    field(hero, matchMedia("(max-width: 700px)").matches ? 16 : 34);
    field(cta, matchMedia("(max-width: 700px)").matches ? 10 : 20);

    /* One rAF-throttled scroll handler: hero fade, story image unmask, word highlighting */
    const img = $(".story-img"), heroC = $("[data-hero-content]");
    let ticking = false;
    const onScroll = () => {
        ticking = false;
        header.classList.toggle("is-scrolled", scrollY > 24);
        const vh = innerHeight;
        if (!reduce) hero.style.setProperty("--hs", clamp(scrollY / (vh * .8)).toFixed(3));
        if (reduce) return;
        const r = img.getBoundingClientRect();
        img.style.setProperty("--p", clamp((vh * .95 - r.top) / (vh * .55)).toFixed(3));
        paras.forEach((p, i) => {
            const b = p.getBoundingClientRect(), prog = clamp((vh * .78 - b.top) / (vh * .42 + b.height * .5)), n = wordSets[i].length;
            wordSets[i].forEach((w, j) => w.classList.toggle("on", j < prog * n * 1.05));
        });
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
    addEventListener("scroll", req, { passive: true }); addEventListener("resize", req); onScroll();
})();
