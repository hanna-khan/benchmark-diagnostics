(() => {
    "use strict";
    const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* Turnaround explorer: choose a case type, the dial sweeps to its window; auto-advances */
    const tt = $("[data-tt]");
    if (tt) {
        const opts = $$(".tt-opt", tt), gauge = $(".gauge", tt), read = $(".tt-read", tt), name = $("[data-tt-name]", tt), time = $("[data-tt-time]", tt), pips = $$(".pips i", tt);
        const pick = i => {
            const o = opts[i], a = +o.dataset.a, b = +o.dataset.b;
            opts.forEach((x, j) => x.setAttribute("aria-pressed", j === i));
            gauge.style.setProperty("--a", a); gauge.style.setProperty("--b", b);
            pips.forEach((p, k) => p.classList.toggle("on", k + 1 > a && k + 1 <= b));
            read.classList.add("swap");
            setTimeout(() => { name.textContent = $(".t", o).textContent; time.textContent = $(".d", o).textContent; read.classList.remove("swap"); }, reduce ? 0 : 250);
        };
        opts.forEach((o, i) => o.addEventListener("click", () => pick(i)));
        pick(0);
        if (!reduce) {
            tt.addEventListener("animationend", e => { if (e.animationName === "ttfill") pick((opts.findIndex(o => o.getAttribute("aria-pressed") === "true") + 1) % opts.length); });
            let seen = false; const pause = on => tt.classList.toggle("paused", on);
            tt.addEventListener("pointerenter", () => pause(true)); tt.addEventListener("pointerleave", () => pause(!seen)); tt.addEventListener("focusin", () => pause(true)); tt.addEventListener("focusout", () => pause(!seen));
            new IntersectionObserver(([e]) => { seen = e.isIntersecting; pause(!seen); }, { threshold: .3 }).observe(tt); pause(true);
        }
    }

    /* FAQ: one open at a time; orbs drift with the cursor */
    $$("[data-faq] details").forEach(d => d.addEventListener("toggle", () => { if (d.open) $$("[data-faq] details").forEach(o => o !== d && (o.open = false)); }));
    const fl = $("[data-float]"), faq = $("#faq");
    if (fl && faq && fine && !reduce) faq.addEventListener("pointermove", e => { fl.style.setProperty("--fx", ((e.clientX / innerWidth - .5) * 2).toFixed(2)); fl.style.setProperty("--fy", ((e.clientY / innerHeight - .5) * 2).toFixed(2)); });
})();
