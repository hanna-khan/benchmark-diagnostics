(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- list: filter + search ---- */
  const blog = $("[data-blog]");
  if (blog) {
    const cards = $$(".bl-card", blog), grid = $("[data-grid]", blog), chips = $$("[data-filter]", blog);
    const input = $("[data-search]", blog), count = $("[data-count]", blog), empty = $("[data-empty]", blog);
    let cat = "all";
    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let n = 0;
      cards.forEach(c => {
        const ok = (cat === "all" || c.dataset.cat === cat) && (!q || c.dataset.text.includes(q));
        c.hidden = !ok;
        if (ok) { n++; c.classList.add("is-in"); }
      });
      if (cat === "all" && !q) grid.removeAttribute("data-filtered"); else grid.setAttribute("data-filtered", "");
      const visible = cards.filter(c => !c.hidden);
      // keep the featured layout on the first visible card only when unfiltered
      cards.forEach(c => c.classList.remove("is-first"));
      count.textContent = n === 1 ? "Showing 1 article" : `Showing ${n} articles`;
      empty.hidden = n > 0;
    };
    chips.forEach(b => b.addEventListener("click", () => {
      cat = b.dataset.filter;
      chips.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      apply();
    }));
    input.addEventListener("input", apply);
    $("[data-reset]", blog).addEventListener("click", () => {
      input.value = ""; cat = "all";
      chips.forEach(x => x.setAttribute("aria-pressed", String(x.dataset.filter === "all")));
      apply();
    });
  }

  /* ---- article: progress, TOC scrollspy, copy link ---- */
  const art = $("[data-article]");
  if (art) {
    const bar = $("[data-progress]");
    const upd = () => {
      const r = art.getBoundingClientRect();
      const total = r.height - innerHeight * .6;
      const p = Math.min(1, Math.max(0, (-r.top + innerHeight * .2) / Math.max(1, total)));
      bar.style.setProperty("--rp", p.toFixed(4));
    };
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();

    const links = $$("[data-toc] a"), secs = $$("[data-sec]", art);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) links.forEach(a => a.classList.toggle("is-on", a.getAttribute("href") === "#" + e.target.id));
      }), { rootMargin: "-25% 0px -65% 0px" });
      secs.forEach(s => io.observe(s));
    }
    links[0] && links[0].classList.add("is-on");

    const copy = $("[data-copy]");
    copy && copy.addEventListener("click", async () => {
      const label = $("span", copy);
      try { await navigator.clipboard.writeText(location.href); label.textContent = "Link copied"; }
      catch { label.textContent = "Copy failed"; }
      copy.classList.add("is-done");
      setTimeout(() => { label.textContent = "Copy link"; copy.classList.remove("is-done"); }, 1800);
    });
  }
})();
