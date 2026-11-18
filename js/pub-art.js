/* Generative H&E-style specimen art: one motif per publication topic. Deterministic per publication. */
(function () {
  "use strict";
  const rng = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const PAL = {
    melanocytic: ["#f3d1df", "#e9a9c4", "#3d2766", "#7a4a2e"],
    adnexal: ["#f1cfe0", "#d99ac0", "#4a3190", "#7d5cc4"],
    vascular: ["#f7dbe0", "#ee9fb0", "#8f2c4a", "#c0485f"],
    infectious: ["#efdcec", "#d6a8d2", "#3b2d78", "#1f8f78"],
    soft: ["#f4d6e4", "#df9fc4", "#5a2f86", "#b9569a"],
    epithelial: ["#f6dce6", "#e7a4c0", "#46308e", "#a24b9c"],
    neural: ["#eed7ea", "#d3a2d0", "#3f2c80", "#8a5bc2"],
    ossification: ["#f6dccf", "#e8aab0", "#3c2a70", "#c4617a"],
    practice: ["#e9e3f4", "#b9b1e0", "#34408f", "#5b86e8"]
  };
  const f = (n) => +n.toFixed(1);
  function nuc(r, x, y, c, rx, ry, rot, o) { return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${f(rot)} ${f(x)} ${f(y)})" fill="${c}" opacity="${o || .85}"/>`; }
  function art(p, w, h) {
    const R = rng(p.n * 7919 + 13), C = PAL[p.cat] || PAL.practice, W = 400, H = 260, id = "pa" + p.n;
    let s = "";
    // stroma strands
    for (let i = 0; i < 14; i++) { const y = R() * H; s += `<path d="M-20 ${f(y)} C 100 ${f(y + R() * 60 - 30)}, 260 ${f(y + R() * 60 - 30)}, 420 ${f(y + R() * 50 - 25)}" stroke="${C[1]}" stroke-width="${f(5 + R() * 9)}" fill="none" opacity=".45" stroke-linecap="round"/>`; }
    const m = p.cat;
    if (m === "melanocytic") {
      s += `<path d="M0 0H400V34Q300 48 200 34T0 38Z" fill="${C[1]}" opacity=".9"/>`;
      for (let i = 0; i < 26; i++) s += nuc(0, i * 16 + R() * 8, 26 + R() * 8, C[2], 3.4, 4.4, R() * 40, .75);
      for (let n = 0; n < 6; n++) { const cx = 50 + R() * 300, cy = 80 + R() * 150, k = 12 + (R() * 12 | 0);
        for (let i = 0; i < k; i++) { const a = R() * 6.28, d = R() * 30; s += nuc(0, cx + Math.cos(a) * d, cy + Math.sin(a) * d * .8, C[2], 4.2, 3.8, R() * 180, .85); if (R() > .55) s += `<circle cx="${f(cx + Math.cos(a) * d + 4)}" cy="${f(cy + Math.sin(a) * d)}" r="1.6" fill="${C[3]}" opacity=".9"/>`; } }
    } else if (m === "adnexal" || m === "practice") {
      const k = m === "practice" ? 0 : 3 + (R() * 3 | 0);
      for (let n = 0; n < k; n++) { const cx = 60 + R() * 280, cy = 50 + R() * 170, rx = 38 + R() * 34, ry = 28 + R() * 26;
        s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${C[3]}" opacity=".55"/>`;
        for (let i = 0; i < 34; i++) { const a = i / 34 * 6.28; s += nuc(0, cx + Math.cos(a) * rx * .92, cy + Math.sin(a) * ry * .92, C[2], 4.6, 2.6, a * 57 + 90, .9); }
        for (let i = 0; i < 22; i++) { const a = R() * 6.28, d = R() * .75; s += nuc(0, cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, C[2], 3.6, 3, R() * 180, .7); } }
      if (m === "practice") for (let i = 0; i < 140; i++) s += nuc(0, R() * W, R() * H, C[2], 3.8, 3.2, R() * 180, .6);
    } else if (m === "vascular") {
      for (let n = 0; n < 9; n++) { const cx = 30 + R() * 340, cy = 30 + R() * 200, r = 12 + R() * 14;
        s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r + 9)}" fill="${C[1]}" opacity=".75"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#fff4f4" stroke="${C[3]}" stroke-width="2"/>`;
        for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; s += nuc(0, cx + Math.cos(a) * r, cy + Math.sin(a) * r, C[2], 3.4, 2, a * 57 + 90, .9); } }
      for (let i = 0; i < 90; i++) s += `<circle cx="${f(R() * W)}" cy="${f(R() * H)}" r="${f(2.2 + R() * 1.6)}" fill="${C[2]}" opacity=".7"/>`;
    } else if (m === "infectious") {
      for (let i = 0; i < 170; i++) s += `<circle cx="${f(R() * W)}" cy="${f(R() * H)}" r="${f(2.4 + R() * 2)}" fill="${C[2]}" opacity=".75"/>`;
      for (let i = 0; i < 70; i++) { const x = R() * W, y = R() * H; s += `<rect x="${f(x)}" y="${f(y)}" width="7" height="2.2" rx="1.1" transform="rotate(${f(R() * 180)} ${f(x)} ${f(y)})" fill="${C[3]}" opacity=".9"/>`; }
      for (let n = 0; n < 2; n++) { const cx = 90 + R() * 220, cy = 70 + R() * 120; s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="26" fill="${C[1]}" opacity=".9" stroke="${C[2]}" stroke-width="1"/>`; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; s += nuc(0, cx + Math.cos(a) * 15, cy + Math.sin(a) * 15, C[2], 3.6, 3, 0, .9); } }
    } else if (m === "soft") {
      for (let n = 0; n < 16; n++) { const x = R() * W, y = R() * H, c = `M${f(x)} ${f(y)} q ${f(R() * 90 - 45)} ${f(R() * 90 - 45)} ${f(R() * 140 - 70)} ${f(R() * 60 - 30)}`;
        s += `<path d="${c}" stroke="${C[3]}" stroke-width="7" fill="none" opacity=".4" stroke-linecap="round"/>`; }
      for (let i = 0; i < 120; i++) { const x = R() * W, y = R() * H; s += nuc(0, x, y, C[2], 7, 2.2, (x * .6 + y * .9) % 180, .7); }
    } else if (m === "epithelial") {
      s += `<path d="M0 0H400V28Q300 40 200 24T0 30Z" fill="#f9eaf0" opacity=".95"/><path d="M0 30Q100 46 200 28T400 32V70Q300 84 200 66T0 72Z" fill="${C[3]}" opacity=".55"/>`;
      for (let i = 0; i < 70; i++) s += nuc(0, R() * W, 38 + R() * 30, C[2], 4, 3.4, R() * 180, .85);
      for (let n = 0; n < 6; n++) { const cx = 40 + R() * 320, cy = 110 + R() * 120, r = 16 + R() * 14; s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(r * 1.4)}" ry="${f(r)}" fill="${C[3]}" opacity=".5"/>`; for (let i = 0; i < 18; i++) { const a = R() * 6.28, d = R(); s += nuc(0, cx + Math.cos(a) * r * 1.3 * d, cy + Math.sin(a) * r * d, C[2], 3.6, 3, 0, .85); } if (R() > .5) s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="6" fill="#fbe9ef" stroke="${C[1]}" stroke-width="2"/>`; }
    } else if (m === "neural") {
      for (let n = 0; n < 6; n++) { const cx = 40 + R() * 320, cy = 40 + R() * 180, r = 14 + R() * 8; s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r - 4)}" fill="#fbeef5" opacity=".9"/>`; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28; s += nuc(0, cx + Math.cos(a) * r, cy + Math.sin(a) * r, C[2], 4.4, 2.8, a * 57 + 90, .9); } }
      for (let i = 0; i < 50; i++) { const x = R() * W, y = R() * H; s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(5 + R() * 4)}" fill="${C[1]}" opacity=".7"/><circle cx="${f(x)}" cy="${f(y)}" r="2.4" fill="${C[2]}"/>`; }
    } else if (m === "ossification") {
      for (let i = 0; i < 9; i++) s += `<path d="M-10 ${f(30 + i * 26)} Q 120 ${f(10 + i * 26 + R() * 40)} 220 ${f(40 + i * 26)} T 420 ${f(30 + i * 26)}" stroke="${C[3]}" stroke-width="12" opacity=".35" fill="none"/>`;
      for (let i = 0; i < 40; i++) s += nuc(0, R() * W, R() * H, C[2], 3.4, 1.8, R() * 180, .85);
      for (let i = 0; i < 40; i++) s += `<circle cx="${f(R() * W)}" cy="${f(R() * H)}" r="${f(2 + R() * 2)}" fill="${C[2]}" opacity=".6"/>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stylised ${p.catLabel} histology illustration"><defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C[0]}"/><stop offset="1" stop-color="${C[1]}"/></linearGradient><filter id="${id}f" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${p.n}"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter><radialGradient id="${id}v" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1a1250" stop-opacity=".28"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id}g)"/><g filter="url(#${id}f)">${s}</g><rect width="${W}" height="${H}" fill="url(#${id}v)"/></svg>`;
  }
  window.PubArt = { svg: art };
})();
