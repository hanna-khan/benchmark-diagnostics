(() => {
  "use strict";
  const D = window.PUBLICATIONS || [];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const when = (p) => [p.month, p.year].filter(Boolean).join(" ") || "";
  const cardHTML = (p, i) => `<a class="pb-card" style="--d:${Math.min(i, 8) * 0.05}s" href="publication.html?id=${encodeURIComponent(p.id)}">
    <div class="pb-art">${window.PubArt.svg(p)}<span class="pb-badge">${p.type === "Conference Presentation" ? "Conference" : "Journal"}</span>${p.year ? `<span class="pb-year">${p.year}</span>` : ""}</div>
    <div class="pb-body"><span class="pb-cat">${esc(p.catLabel)}</span><h3>${esc(p.title)}</h3><p class="pb-venue">${esc(p.venue)}</p>
    ${p.tags.length ? `<ul class="pb-tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}<span class="pb-go">View publication</span></div></a>`;

  document.querySelectorAll('[data-art]').forEach((el, i) => { el.innerHTML = window.PubArt.svg({ n: 90 + i, cat: el.dataset.art, catLabel: el.dataset.art }); });

  /* ---------- library (research page) ---------- */
  const root = $("#pubs-root");
  if (root) {
    const q = $("#pub-filter"), count = $("[data-pub-count]"), more = $("[data-pub-more]"), sort = $("#pub-sort");
    const topicSel = $("#pub-topic"), typeBox = $("[data-pub-types]");
    const cats = [...new Map(D.map((p) => [p.cat, p.catLabel])).entries()];
    const num = (c) => D.filter((p) => p.cat === c).length;
    topicSel.innerHTML = `<option value="all">All topics (${D.length})</option>` + cats.map(([k, l]) => `<option value="${k}">${esc(l)} (${num(k)})</option>`).join("");
    const types = [["all", "All"], ["Journal Publication", "Journal"], ["Conference Presentation", "Conference"]];
    typeBox.innerHTML = types.map(([k, l], i) => `<button type="button" data-type="${k}" aria-pressed="${i === 0}">${l}</button>`).join("");
    let cat = "all", type = "all", shown = 9;
    const list = () => {
      const n = (q.value || "").trim().toLowerCase();
      let r = D.filter((p) => (cat === "all" || p.cat === cat) && (type === "all" || p.type === type) && (!n || [p.title, p.venue, p.year, p.catLabel, p.abstract, p.tags.join(" ")].join(" ").toLowerCase().includes(n)));
      const dir = sort.value === "old" ? 1 : -1;
      r = r.slice().sort((a, b) => dir * ((a.sortYear || 0) - (b.sortYear || 0)) || a.n - b.n);
      return r;
    };
    const render = (reset) => {
      if (reset) shown = 9;
      const r = list();
      root.innerHTML = r.slice(0, shown).map(cardHTML).join("") || '<p class="pbl-empty">No publications match your filters.</p>';
      count.textContent = `Showing ${Math.min(shown, r.length)} of ${r.length} publication${r.length === 1 ? "" : "s"}`;
      more.hidden = r.length <= shown;
    };
    topicSel.addEventListener("change", () => { cat = topicSel.value; render(true); });
    typeBox.addEventListener("click", (e) => { const b = e.target.closest("[data-type]"); if (!b) return; type = b.dataset.type; typeBox.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); render(true); });
    q.addEventListener("input", () => render(true)); sort.addEventListener("change", () => render(true));
    more.querySelector("button").addEventListener("click", () => { shown += 9; render(false); });
    document.querySelectorAll("[data-pub-type]").forEach((a) => a.addEventListener("click", () => { type = a.dataset.pubType; typeBox.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.type === type))); render(true); }));
    render(true);
  }

  /* ---------- detail page ---------- */
  const pr = $("#pub-root");
  if (pr) {
    const id = new URLSearchParams(location.search).get("id");
    const p = D.find((x) => x.id === id);
    if (!p) {
      pr.innerHTML = '<div class="wrap" style="padding:10rem 0 6rem"><h1 style="color:var(--white)">Publication not found</h1><p style="color:var(--on-dark)">The requested publication could not be found. <a href="research.html#publications-list" style="color:#fff">Return to publications</a>.</p></div>';
      return;
    }
    document.title = `${p.title} | Benchmark Diagnostics`;
    const md = $('meta[name="description"]'); if (md) md.content = p.summary;
    $("#pub-title").textContent = p.title;
    $("#pub-crumb").textContent = p.catLabel;
    $("#pub-lead").textContent = p.venue + (when(p) && !p.venue.includes(String(p.year)) ? " · " + when(p) : "");
    $("#pub-meta").innerHTML = [p.type, p.year || "Year not listed", p.author, `${p.reading} min read`].map((t) => `<li>${esc(t)}</li>`).join("");
    $("#pub-art").innerHTML = window.PubArt.svg(p);
    const cite = `Usmani A. ${p.title.replace(/[.?]$/, (m) => m)}${/[.?]$/.test(p.title) ? "" : "."} ${p.type === "Conference Presentation" ? "Presented at: " : ""}${p.venue}${when(p) && !p.venue.includes(String(p.year)) ? ", " + when(p) : ""}.${p.doi ? " doi:" + p.doi : ""}`;
    const multi = p.sections.length > 1;
    const secs = (multi ? p.sections.map((s, i) => ({ id: "s" + (i + 1), h: s.heading })) : [{ id: "abstract", h: "Abstract" }]).concat( [{ id: "details", h: "Publication details" }, { id: "cite", h: "Cite this work" }]);
    $("[data-toc]").innerHTML = secs.map((s) => `<li><a href="#${s.id}">${esc(s.h)}</a></li>`).join("");
    const kw = `<ul class="ar-tags" aria-label="Keywords">${[p.catLabel].concat(p.tags).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    let h = multi ? `<div data-reveal>${kw}</div>` : `<section id="abstract" data-sec><div class="pd-abstract"><h2><span class="n">01</span>Abstract</h2><p class="lead">${esc(p.abstract)}</p></div>${kw}</section>`;
    if (multi) p.sections.forEach((s, i) => { h += `<section id="s${i + 1}" data-sec><div class="pd-sec"><h2><span class="n">${String(i + 1).padStart(2, "0")}</span>${esc(s.heading)}</h2><p>${esc(s.body)}</p></div></section>`; });
    h += `<section id="details" data-sec><h2><span class="n">${String(secs.length - 1).padStart(2, "0")}</span>Publication details</h2><dl class="pd-facts">
      <div class="wide"><dt>Title</dt><dd>${esc(p.title)}</dd></div><div><dt>Author</dt><dd>${esc(p.author)}, Dermatopathologist, Benchmark Diagnostics, LLC</dd></div><div><dt>Type</dt><dd>${esc(p.type)}</dd></div>
      <div class="wide"><dt>${p.type === "Conference Presentation" ? "Presented at" : "Published in"}</dt><dd>${esc(p.venue)}</dd></div><div><dt>Year</dt><dd>${esc(when(p) || "Not listed")}</dd></div><div><dt>Topic</dt><dd>${esc(p.catLabel)}</dd></div>${p.doi ? `<div class="wide"><dt>DOI</dt><dd><a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener noreferrer">${esc(p.doi)}</a></dd></div>` : ""}</dl>
      <p class="pd-note">Abstract text is shown as supplied by the author. The published full text, including figures and references, is available from the venue named above.</p></section>
      <section id="cite" data-sec><div class="pd-cite"><h2>Cite this work</h2><p id="pub-cite">${esc(cite)}</p><button type="button" class="pill pill-solid" data-cite><span>Copy citation</span></button></div></section>`;
    $("[data-article]").insertAdjacentHTML("afterbegin", h);
    /* prev / next + related */
    const sorted = D.slice().sort((a, b) => (b.sortYear || 0) - (a.sortYear || 0) || a.n - b.n);
    const i = sorted.findIndex((x) => x.id === p.id), prev = sorted[i - 1], next = sorted[i + 1];
    $("[data-pub-nav]").innerHTML = `${prev ? `<a href="publication.html?id=${encodeURIComponent(prev.id)}" rel="prev"><small>← Newer</small><span>${esc(prev.title)}</span></a>` : "<span></span>"}${next ? `<a href="publication.html?id=${encodeURIComponent(next.id)}" rel="next"><small>Older →</small><span>${esc(next.title)}</span></a>` : "<span></span>"}`;
    const rel = D.filter((x) => x.id !== p.id && x.cat === p.cat).sort((a, b) => Math.abs((a.sortYear || 0) - (p.sortYear || 0)) - Math.abs((b.sortYear || 0) - (p.sortYear || 0))).slice(0, 3);
    const fill = rel.length < 3 ? rel.concat(D.filter((x) => x.id !== p.id && !rel.includes(x)).slice(0, 3 - rel.length)) : rel;
    $("[data-pub-related]").innerHTML = fill.map(cardHTML).join("");
    $("[data-cite]").addEventListener("click", async (e) => { const b = e.currentTarget, l = b.querySelector("span"); try { await navigator.clipboard.writeText(cite); l.textContent = "Citation copied"; } catch (_) { l.textContent = "Copy failed"; } setTimeout(() => (l.textContent = "Copy citation"), 1800); });
    const dl = $("[data-pub-pdfless]"); if (dl) dl.href = `contact.html`;
    /* let blog.js (loaded after) pick up TOC + sections */
    document.dispatchEvent(new Event("pub-ready"));
  }
})();
