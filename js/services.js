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
    const hs = () => header.classList.toggle("is-scrolled", scrollY > 24);
    addEventListener("scroll", hs, { passive: true }); hs();

    /* Reveal */
    const els = $$("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) els.forEach(e => e.classList.add("is-in"));
    else { const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { threshold: .15, rootMargin: "0px 0px -6% 0px" }); els.forEach(e => io.observe(e)); }

    /* Magnetic pills */
    if (fine && !reduce) $$("[data-magnetic]").forEach(el => {
        el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
        el.addEventListener("pointerleave", () => el.style.transform = "");
    });

    /* Hero slide stack: tilts with the cursor; legend lifts the matching slide (hover + keyboard focus) */
    const sw = $("[data-stack]");
    if (sw) {
        if (fine && !reduce) $(".s-hero").addEventListener("pointermove", e => {
            sw.style.setProperty("--ry", ((e.clientX / innerWidth - .5) * 24).toFixed(1)); sw.style.setProperty("--rx", ((.5 - e.clientY / innerHeight) * 14).toFixed(1));
        });
        $$("[data-lift]", sw).forEach(a => { const on = () => sw.dataset.lift = a.dataset.lift, off = () => delete sw.dataset.lift;
            a.addEventListener("pointerenter", on); a.addEventListener("focus", on); a.addEventListener("pointerleave", off); a.addEventListener("blur", off); });
    }

    /* Core services: the sticky stage follows whichever service is centred */
    const items = $$(".svc-item"), imgs = $$(".stage-img"), dots = $$(".stage-dots i"), num = $(".stage-num"), name = $(".stage-name");
    if (items.length && "IntersectionObserver" in window) {
        const set = i => { items.forEach((s, j) => s.classList.toggle("on", j === i)); imgs.forEach((m, j) => m.classList.toggle("on", j === i)); dots.forEach((d, j) => d.classList.toggle("on", j === i));
            num.textContent = "0" + (i + 1); name.textContent = $("h2", items[i]).textContent; };
        set(0);
        const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) set(+en.target.dataset.i); }), { rootMargin: "-45% 0px -45% 0px" });
        items.forEach(s => io.observe(s));
    }

    /* Stage tilt + light */
    const st = $(".stage");
    if (st && fine && !reduce) {
        st.addEventListener("pointermove", e => { const r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            st.style.setProperty("--ry", ((x - .5) * 8).toFixed(2)); st.style.setProperty("--rx", ((.5 - y) * 8).toFixed(2)); st.style.setProperty("--mx", x * 100 + "%"); st.style.setProperty("--my", y * 100 + "%"); });
        st.addEventListener("pointerleave", () => { st.style.setProperty("--rx", 0); st.style.setProperty("--ry", 0); });
    }

    /* Additional services: tabs, auto-advance driven by the progress bar, 3D tilt */
    const xs = $("[data-xs]");
    if (xs) {
        const tabs = $$(".xs-tab", xs), panels = $$(".xs-panel", xs), stage = $("[data-xs-stage]", xs);
        const pick = (i, focus) => { tabs.forEach((t, j) => { const on = j === i; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; panels[j].hidden = !on; panels[j].classList.toggle("on", on); }); if (focus) tabs[i].focus(); };
        tabs.forEach((t, i) => { t.addEventListener("click", () => pick(i)); t.addEventListener("keydown", e => { const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (k) { e.preventDefault(); pick((i + k + tabs.length) % tabs.length, true); } }); });
        if (!reduce) {
            xs.addEventListener("animationend", e => { if (e.animationName === "fill") pick((tabs.findIndex(t => t.getAttribute("aria-selected") === "true") + 1) % tabs.length); });
            const pause = on => xs.classList.toggle("paused", on); let seen = true;
            xs.addEventListener("pointerenter", () => pause(true)); xs.addEventListener("pointerleave", () => pause(!seen)); xs.addEventListener("focusin", () => pause(true)); xs.addEventListener("focusout", () => pause(!seen));
            new IntersectionObserver(([e]) => { seen = e.isIntersecting; pause(!seen); }, { threshold: .3 }).observe(xs);
        }
        if (fine && !reduce) { stage.addEventListener("pointermove", e => { const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; stage.style.setProperty("--ry", ((x - .5) * 7).toFixed(2)); stage.style.setProperty("--rx", ((.5 - y) * 7).toFixed(2)); stage.style.setProperty("--mx", x * 100 + "%"); stage.style.setProperty("--my", y * 100 + "%"); }); stage.addEventListener("pointerleave", () => { stage.style.setProperty("--rx", 0); stage.style.setProperty("--ry", 0); }); }
    }

    /* FAQ: one open at a time */
    $$("[data-faq] details").forEach(d => d.addEventListener("toggle", () => { if (d.open) $$("[data-faq] details").forEach(o => o !== d && (o.open = false)); }));

    /* FAQ orbs drift against the cursor */
    const fl = $("[data-float]");
    if (fl && fine && !reduce) $(".faq").addEventListener("pointermove", e => { fl.style.setProperty("--fx", ((e.clientX / innerWidth - .5) * 2).toFixed(2)); fl.style.setProperty("--fy", ((e.clientY / innerHeight - .5) * 2).toFixed(2)); });

    /* Cell field (hero + CTA): canvas 2D, paused offscreen */
    function field(host, n) {
        const cv = $(".a-canvas", host), ctx = cv.getContext("2d"); if (!ctx) return;
        let W, H, dpr, vis = false, raf = 0, t = 0, mx = -1e3, my = -1e3, sx = .5, sy = .5, tx = .5, ty = .5;
        const cells = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), z: .25 + Math.random() * .75, r: 30 + Math.random() * 80, p: Math.random() * 6.28, s: .15 + Math.random() * .3 })).sort((a, b) => a.z - b.z);
        const size = () => { dpr = Math.min(devicePixelRatio || 1, 1.5); W = host.clientWidth; H = host.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
        const draw = () => {
            ctx.clearRect(0, 0, W, H); const sc = W < 700 ? .65 : 1, off = -host.getBoundingClientRect().top;
            for (const c of cells) {
                const x = ((c.x * W + Math.sin(t * c.s + c.p) * 34 + (sx - .5) * c.z * 90) % (W + 200) + W + 200) % (W + 200) - 100;
                const y = ((c.y * H + Math.cos(t * c.s * .8 + c.p) * 26 + (sy - .5) * c.z * 60 - off * c.z * .22) % (H + 200) + H + 200) % (H + 200) - 100;
                const f = clamp(1 - Math.hypot(x - mx, y - my) / 260), r = c.r * c.z * sc * 1.35 * (1 + f * .18), a = c.z * (1 + f * 1.1);
                const g = ctx.createRadialGradient(x, y, r * .1, x, y, r);
                g.addColorStop(0, `rgba(229,143,176,${.3 * a})`); g.addColorStop(.7, `rgba(23,101,163,${.12 * a})`); g.addColorStop(1, "rgba(23,101,163,0)");
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.strokeStyle = `rgba(95,208,230,${.16 * a})`; ctx.lineWidth = 1; ctx.stroke();
                ctx.fillStyle = `rgba(95,150,220,${.3 * a})`; ctx.beginPath(); ctx.arc(x + r * .12, y - r * .08, r * .3, 0, 6.283); ctx.fill();
            }
        };
        const loop = () => { t += .016; sx += (tx - sx) * .05; sy += (ty - sy) * .05; draw(); raf = vis ? requestAnimationFrame(loop) : 0; };
        size(); draw(); host.classList.add("gl"); addEventListener("resize", () => { size(); draw(); });
        if (reduce) return;
        host.addEventListener("pointermove", e => { const r = host.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; tx = mx / W; ty = my / H; });
        host.addEventListener("pointerleave", () => { mx = my = -1e3; tx = ty = .5; });
        new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); }).observe(host);
    }
    const small = matchMedia("(max-width: 700px)").matches;
    field($("[data-hero]"), small ? 14 : 28); field($("[data-cta]"), small ? 10 : 20);
})();
