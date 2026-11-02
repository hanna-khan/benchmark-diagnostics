(() => {
    "use strict";
    const doc = document.documentElement, $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    requestAnimationFrame(() => requestAnimationFrame(() => doc.classList.add("loaded")));

    /* Header + menu */
    const header = $("[data-header]"), toggle = $(".menu-toggle"), nav = $("#main-navigation");
    toggle.addEventListener("click", () => { const o = toggle.getAttribute("aria-expanded") !== "true"; toggle.setAttribute("aria-expanded", o); toggle.setAttribute("aria-label", o ? "Close navigation menu" : "Open navigation menu"); nav.classList.toggle("is-open", o); document.body.style.overflow = o ? "hidden" : ""; });
    addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("is-open")) { toggle.click(); toggle.focus(); } });
    $$("a", nav).forEach(a => a.addEventListener("click", () => nav.classList.contains("is-open") && toggle.click()));
    const hs = () => header.classList.toggle("is-scrolled", scrollY > 24); addEventListener("scroll", hs, { passive: true }); hs();

    /* Reveal (+ "settled" so tilt isn't delayed afterwards) */
    const els = $$("[data-reveal]"), settle = e => setTimeout(() => e.classList.add("settled"), 1100 + (parseFloat(getComputedStyle(e).getPropertyValue("--d")) || 0) * 1000);
    if (reduce || !("IntersectionObserver" in window)) els.forEach(e => { e.classList.add("is-in", "settled"); });
    else { const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); settle(en.target); io.unobserve(en.target); } }), { threshold: .15, rootMargin: "0px 0px -6% 0px" }); els.forEach(e => io.observe(e)); }

    /* Magnetic pills */
    if (fine && !reduce) $$("[data-magnetic]").forEach(el => {
        el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
        el.addEventListener("pointerleave", () => el.style.transform = "");
    });

    /* Tilt + light, delegated so JS-rendered report cards work too */
    if (fine && !reduce) {
        const sel = "[data-tilt], .monthly-reports-grid .research-card";
        document.addEventListener("pointermove", e => { const el = e.target.closest && e.target.closest(sel); if (!el) return;
            const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height, k = el.classList.contains("monthly-report-hidden") ? 0 : 8;
            el.style.setProperty("--ry", ((x - .5) * k).toFixed(2)); el.style.setProperty("--rx", ((.5 - y) * k).toFixed(2)); el.style.setProperty("--mx", x * 100 + "%"); el.style.setProperty("--my", y * 100 + "%"); });
        document.addEventListener("pointerout", e => { const el = e.target.closest && e.target.closest(sel); if (el && !el.contains(e.relatedTarget)) { el.style.setProperty("--rx", 0); el.style.setProperty("--ry", 0); } });
    }

    /* Hero parallax variables for orbs / paper fan */
    const hero = $("[data-hero]"), par = $$("[data-parallax]");
    if (hero && par.length && fine && !reduce) hero.addEventListener("pointermove", e => par.forEach(p => { p.style.setProperty("--px", ((e.clientX / innerWidth - .5) * 2).toFixed(2)); p.style.setProperty("--py", ((e.clientY / innerHeight - .5) * 2).toFixed(2)); }));

    /* Research hero cylinder: slow spin, cursor steers, drag to fling */
    const cw = $("[data-cyl]");
    if (cw) {
        const cyl = $(".cyl", cw); let rot = -20, v = reduce ? 0 : .18, target = v, vis = true, drag = null, last = 0;
        const apply = () => cyl.style.setProperty("--rot", rot.toFixed(2) + "deg"); apply();
        if (!reduce) {
            hero.addEventListener("pointermove", e => { if (!drag) target = .18 + (e.clientX / innerWidth - .5) * 1.1; }); hero.addEventListener("pointerleave", () => target = .18);
            cw.addEventListener("pointerdown", e => { drag = e.clientX; last = 0; cw.setPointerCapture(e.pointerId); });
            cw.addEventListener("pointermove", e => { if (drag === null) return; last = (e.clientX - drag) * .4; rot += last; drag = e.clientX; apply(); });
            const end = () => { if (drag !== null) { v = last; drag = null; } }; cw.addEventListener("pointerup", end); cw.addEventListener("pointercancel", end);
            new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(cw);
            (function tick() { if (vis && drag === null) { v += (target - v) * .04; rot += v; apply(); } requestAnimationFrame(tick); })();
        }
    }

    /* Cell field (hero + CTA) */
    function field(host, n) {
        const cv = $(".a-canvas", host), ctx = cv && cv.getContext("2d"); if (!ctx) return;
        let W, H, dpr, vis = false, raf = 0, t = 0, mx = -1e3, my = -1e3, sx = .5, sy = .5, tx = .5, ty = .5;
        const cells = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), z: .25 + Math.random() * .75, r: 30 + Math.random() * 80, p: Math.random() * 6.28, s: .15 + Math.random() * .3 })).sort((a, b) => a.z - b.z);
        const size = () => { dpr = Math.min(devicePixelRatio || 1, 1.5); W = host.clientWidth; H = host.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
        const draw = () => { ctx.clearRect(0, 0, W, H); const sc = W < 700 ? .65 : 1, off = -host.getBoundingClientRect().top;
            for (const c of cells) {
                const x = ((c.x * W + Math.sin(t * c.s + c.p) * 34 + (sx - .5) * c.z * 90) % (W + 200) + W + 200) % (W + 200) - 100, y = ((c.y * H + Math.cos(t * c.s * .8 + c.p) * 26 + (sy - .5) * c.z * 60 - off * c.z * .22) % (H + 200) + H + 200) % (H + 200) - 100;
                const f = clamp(1 - Math.hypot(x - mx, y - my) / 260), r = c.r * c.z * sc * 1.35 * (1 + f * .18), a = c.z * (1 + f * 1.1), g = ctx.createRadialGradient(x, y, r * .1, x, y, r);
                g.addColorStop(0, `rgba(229,143,176,${.3 * a})`); g.addColorStop(.7, `rgba(23,101,163,${.12 * a})`); g.addColorStop(1, "rgba(23,101,163,0)");
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.strokeStyle = `rgba(95,208,230,${.16 * a})`; ctx.lineWidth = 1; ctx.stroke();
                ctx.fillStyle = `rgba(95,150,220,${.3 * a})`; ctx.beginPath(); ctx.arc(x + r * .12, y - r * .08, r * .3, 0, 6.283); ctx.fill(); } };
        const loop = () => { t += .016; sx += (tx - sx) * .05; sy += (ty - sy) * .05; draw(); raf = vis ? requestAnimationFrame(loop) : 0; };
        size(); draw(); host.classList.add("gl"); addEventListener("resize", () => { size(); draw(); });
        if (reduce) return;
        host.addEventListener("pointermove", e => { const r = host.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; tx = mx / W; ty = my / H; });
        host.addEventListener("pointerleave", () => { mx = my = -1e3; tx = ty = .5; });
        new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); }).observe(host);
    }
    const small = matchMedia("(max-width: 700px)").matches;
    if (hero) field(hero, small ? 14 : 28); const cta = $("[data-cta]"); if (cta) field(cta, small ? 10 : 20);

    /* Contact: progress ring + fetch submit (falls back to normal post) */
    const form = $("[data-form]");
    if (form) {
        const bar = $(".bar", form), pct = $("[data-pct]", form), note = $(".form-note", form), btn = $("button[type=submit]", form), req = ["full-name", "email", "message"];
        const update = () => { const done = req.filter(n => { const f = form.elements[n]; return f.value.trim() && f.checkValidity(); }).length + (form.querySelector("input[name=subject]:checked") ? 1 : 0), p = Math.round(done / 4 * 100); bar.style.strokeDashoffset = 100 - p; pct.textContent = p + "%"; };
        form.addEventListener("input", update); form.addEventListener("change", update); update();
        form.addEventListener("submit", async e => {
            if (!window.fetch || !window.FormData) return; e.preventDefault(); btn.disabled = true; note.textContent = "";
            try { const r = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }); if (!r.ok) throw 0; form.classList.add("is-sent"); form.reset(); update(); }
            catch (_) { note.textContent = "Something went wrong. Please try again or call (440) 359-7115."; }
            btn.disabled = false;
        });
    }

    /* Contact: highlight today + live open badge from posted hours (Eastern Time) */
    const hrs = $("[data-hours]");
    if (hrs) {
        const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date()).map(x => [x.type, x.value]));
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), mins = +p.hour * 60 + +p.minute, open = day >= 1 && day <= 5 && mins >= 420 && mins < 990;
        $$(".oh-card", hrs).forEach(c => c.classList.toggle("today", c.dataset.days.split(",").includes(String(day))));
        const b = $("[data-open]", hrs); b.hidden = false; b.classList.toggle("is-open", open); $("span", b).textContent = (open ? "Open now" : "Closed now") + " · Eastern Time";
    }
})();
