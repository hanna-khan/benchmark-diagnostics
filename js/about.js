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
        const k = el.classList.contains("mv-panel") ? 5 : el.hasAttribute("data-lead-card") ? 4 : 7;
        el.addEventListener("pointermove", e => {
            const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            el.style.setProperty("--ry", ((x - .5) * k).toFixed(2)); el.style.setProperty("--rx", ((.5 - y) * k).toFixed(2));
            el.style.setProperty("--mx", x * 100 + "%"); el.style.setProperty("--my", y * 100 + "%");
        });
        el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", 0); el.style.setProperty("--ry", 0); });
    });

    /* Soft leadership hover tone (Web Audio; skipped for reduced motion / coarse pointers) */
    if (fine && !reduce && typeof AudioContext !== "undefined") {
        let ctx;
        const chime = () => {
            try {
                ctx = ctx || new AudioContext();
                if (ctx.state === "suspended") ctx.resume();
                const t0 = ctx.currentTime;
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = "sine";
                o.frequency.setValueAtTime(660, t0);
                o.frequency.exponentialRampToValueAtTime(880, t0 + .08);
                g.gain.setValueAtTime(0.0001, t0);
                g.gain.exponentialRampToValueAtTime(0.028, t0 + .02);
                g.gain.exponentialRampToValueAtTime(0.0001, t0 + .22);
                o.connect(g); g.connect(ctx.destination);
                o.start(t0); o.stop(t0 + .24);
            } catch (_) { /* ignore blocked audio */ }
        };
        $$("[data-lead-card]").forEach(el => {
            let armed = true;
            el.addEventListener("pointerenter", () => { if (armed) { armed = false; chime(); } });
            el.addEventListener("pointerleave", () => { armed = true; });
        });
    }

    /* Research & Education: living knowledge model (rotating DNA helix, tilted orbits, labelled satellites).
       Canvas 2D with a tiny 3D rig, paused off-screen, one still frame for reduced motion. */
    (() => {
        const host = $("[data-orbit]"); if (!host) return;
        const cv = $(".rx-canvas", host), ctx = cv.getContext("2d"), tags = $$(".rx-tag", host);
        if (!ctx) return;
        const section = host.closest(".rx"), TAU = Math.PI * 2;
        const BLUE = "91,134,232", PINK = "229,143,176", CYAN = "95,208,230", ICE = "232,239,255";
        let W = 1, H = 1, dpr = 1, vis = false, raf = 0, t = 0, tx = 0, ty = 0, mx = 0, my = 0;
        // helix: two strands + base-pair rungs
        const helix = [], N = 64, TURNS = 2.6, HR = .25, HH = .72;
        for (let i = 0; i < N; i++) {
            const k = i / (N - 1), y = -HH + 2 * HH * k, a = k * TURNS * TAU;
            helix.push({ y, a, rung: i % 3 === 0 });
        }
        // orbits: radius, tilt X / tilt Z, speed, satellites (phase, colour, label index)
        const orbits = [
            { r: .98, tx: 1.18, tz: .25, sp: .22, sats: [{ p: 0, c: BLUE, tag: 0 }, { p: 3.4, c: PINK, tag: 3 }] },
            { r: .80, tx: .62, tz: -.55, sp: -.3, sats: [{ p: 1.4, c: CYAN, tag: 1 }, { p: 4.6, c: BLUE, tag: -1 }] },
            { r: .62, tx: 1.45, tz: -.1, sp: .42, sats: [{ p: 2.6, c: PINK, tag: 2 }] }
        ];
        const dust = Array.from({ length: 46 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1, s: .4 + Math.random() * 1.4, p: Math.random() * TAU }));
        const size = () => {
            dpr = Math.min(devicePixelRatio || 1, 1.75); W = host.clientWidth; H = host.clientHeight;
            cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const out = { x: 0, y: 0, z: 0, k: 1 };
        const rig = (ay, ax) => {
            const ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax), S = Math.min(W, H) * .4;
            return (x, y, z) => {
                const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb, k = 3 / (3 - z2);
                out.x = W / 2 + x1 * k * S; out.y = H / 2 - y1 * k * S; out.z = z2; out.k = k; return out;
            };
        };
        const ringPt = (o, a) => {
            let x = o.r * Math.cos(a), y = 0, z = o.r * Math.sin(a);
            let y1 = y * Math.cos(o.tx) - z * Math.sin(o.tx), z1 = y * Math.sin(o.tx) + z * Math.cos(o.tx);
            const x2 = x * Math.cos(o.tz) - y1 * Math.sin(o.tz), y2 = x * Math.sin(o.tz) + y1 * Math.cos(o.tz);
            return [x2, y2, z1];
        };
        const depthA = z => .35 + .65 * Math.min(1, Math.max(0, (z + 1.2) / 2.4));
        const frame = () => {
            ctx.clearRect(0, 0, W, H);
            const P = rig(t * .1 + mx * .7, .32 + my * .4);
            // soft core glow
            const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * .36);
            g.addColorStop(0, `rgba(${BLUE},.34)`); g.addColorStop(.5, `rgba(${BLUE},.09)`); g.addColorStop(1, `rgba(${BLUE},0)`);
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
            ctx.globalCompositeOperation = "lighter";
            // orbit rings
            orbits.forEach((o, i) => {
                ctx.beginPath();
                for (let s = 0; s <= 90; s++) { const p = ringPt(o, s / 90 * TAU); P(p[0], p[1], p[2]); s ? ctx.lineTo(out.x, out.y) : ctx.moveTo(out.x, out.y); }
                ctx.strokeStyle = `rgba(${i === 1 ? PINK : BLUE},.3)`; ctx.lineWidth = 1; ctx.stroke();
            });
            // ambient dust
            dust.forEach(d => {
                P(d.x * 1.05, d.y * 1.05 + Math.sin(t * .4 + d.p) * .03, d.z * 1.05);
                ctx.fillStyle = `rgba(${ICE},${.35 * depthA(out.z)})`; ctx.beginPath(); ctx.arc(out.x, out.y, d.s * out.k, 0, TAU); ctx.fill();
            });
            // helix (rotates faster than the scene)
            const spin = t * .9;
            const A = [], B = [];
            helix.forEach(h => {
                const a = h.a + spin;
                P(Math.cos(a) * HR, h.y, Math.sin(a) * HR); A.push({ x: out.x, y: out.y, z: out.z, k: out.k });
                P(-Math.cos(a) * HR, h.y, -Math.sin(a) * HR); B.push({ x: out.x, y: out.y, z: out.z, k: out.k });
            });
            helix.forEach((h, i) => {
                if (h.rung) { ctx.strokeStyle = `rgba(${ICE},.22)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(A[i].x, A[i].y); ctx.lineTo(B[i].x, B[i].y); ctx.stroke(); }
            });
            [[A, CYAN], [B, PINK]].forEach(([arr, c]) => arr.forEach(p => {
                const al = depthA(p.z); const r = 3.4 * p.k;
                const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3); gg.addColorStop(0, `rgba(${c},${.9 * al})`); gg.addColorStop(1, `rgba(${c},0)`);
                ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p.x, p.y, r * 3, 0, TAU); ctx.fill();
            }));
            // satellites + labels
            const cen = P(0, 0, 0), cx0 = cen.x, cy0 = cen.y;
            const placed = [];
            orbits.forEach(o => o.sats.forEach(s => {
                const p = ringPt(o, s.p + t * o.sp); P(p[0], p[1], p[2]);
                const al = depthA(out.z), x = out.x, y = out.y, r = 5.5 * out.k;
                if (s.tag >= 0) { ctx.strokeStyle = `rgba(${s.c},${.28 * al})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx0, cy0); ctx.lineTo(x, y); ctx.stroke(); }
                const gg = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4); gg.addColorStop(0, `rgba(${s.c},${al})`); gg.addColorStop(1, `rgba(${s.c},0)`);
                ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, r * 3.4, 0, TAU); ctx.fill();
                ctx.fillStyle = `rgba(${ICE},${al})`; ctx.beginPath(); ctx.arc(x, y, r * .55, 0, TAU); ctx.fill();
                if (s.tag >= 0 && tags[s.tag]) { const el = tags[s.tag]; const left = x < cx0, w = el.offsetWidth || 90, px = left ? x - w - 12 : x + 12; let py = y - 15;
                    placed.forEach(q => { if (px < q.x + q.w && q.x < px + w && Math.abs(py - q.y) < 30) py = q.y + (py >= q.y ? 32 : -32); });
                    placed.push({ x: px, y: py, w });
                    el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`; el.style.opacity = (.25 + .75 * al).toFixed(2); }
            }));
            ctx.globalCompositeOperation = "source-over";
        };
        const loop = () => { t += .016; mx += (tx - mx) * .05; my += (ty - my) * .05; frame(); raf = vis ? requestAnimationFrame(loop) : 0; };
        size(); t = 2.4; frame(); addEventListener("resize", () => { size(); frame(); });
        if (reduce) return;
        if (fine) section.addEventListener("pointermove", e => {
            const r = host.getBoundingClientRect();
            tx = clamp((e.clientX - r.left - r.width / 2) / innerWidth, -.5, .5) * 1.6; ty = clamp((e.clientY - r.top - r.height / 2) / innerHeight, -.5, .5) * 1.2;
        });
        new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); }).observe(host);
    })();

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
