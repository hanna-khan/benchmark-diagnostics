/* Benchmark Diagnostics — homepage behaviour.
   Zero dependencies. Every effect is progressive enhancement:
   content, links and navigation work with this file disabled. */
(() => {
    "use strict";
    const doc = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const lerp = (a, b, t) => a + (b - a) * t;

    /* ---------- Header + mobile navigation ---------- */
    const header = document.querySelector("[data-header]");
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 40);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const setMenu = open => {
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open);
        toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        doc.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
    nav.addEventListener("click", e => e.target.closest("a") && setMenu(false));
    addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); } });
    matchMedia("(min-width: 981px)").addEventListener("change", e => e.matches && setMenu(false));

    /* ---------- Entrance + scroll reveals ---------- */
    requestAnimationFrame(() => requestAnimationFrame(() => doc.classList.add("loaded")));
    const revealEls = $$("[data-reveal]");
    if ("IntersectionObserver" in window && !reduce) {
        revealEls.forEach(el => {
            // stagger siblings inside the same grid/list
            const i = [...el.parentElement.children].indexOf(el);
            el.style.setProperty("--d", Math.min(i, 5) * 0.08 + "s");
        });
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add("is-in"));
    }

    /* ---------- Cursor light, tilt, magnetic buttons ---------- */
    if (finePointer && !reduce) {
        $$("[data-spot]").forEach(el => el.addEventListener("pointermove", e => {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--mx", e.clientX - r.left + "px");
            el.style.setProperty("--my", e.clientY - r.top + "px");
        }));

        $$("[data-tilt]").forEach(el => {
            el.addEventListener("pointermove", e => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                el.style.transition = "transform .1s linear";
                el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
            });
            el.addEventListener("pointerleave", () => {
                el.style.transition = "transform .8s cubic-bezier(.22,1,.36,1)";
                el.style.transform = "";
            });
        });

        $$("[data-magnetic]").forEach(el => {
            const label = el.firstElementChild;
            el.addEventListener("pointermove", e => {
                const r = el.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
                label.style.transform = `translate(${dx * 0.08}px, ${dy * 0.12}px)`;
            });
            el.addEventListener("pointerleave", () => { el.style.transform = ""; label.style.transform = ""; });
        });
    }

    /* ---------- Closing CTA: 3D double helix (raw WebGL points) ---------- */
    (() => {
        const cta = document.querySelector(".cta");
        const cv = cta && cta.querySelector(".cta-canvas");
        const g = cv && cv.getContext("webgl", { antialias: false, alpha: true, powerPreference: "low-power" });
        if (!g) return;
        const VS = `attribute vec3 aP;attribute vec2 aK;
uniform float uAng,uTilt,uAsp,uScale,uAlpha,uDpr;uniform vec2 uOff;varying vec4 vC;
void main(){
 float c=cos(uAng),s=sin(uAng);
 vec3 p=vec3(aP.x*c+aP.z*s,aP.y,-aP.x*s+aP.z*c);
 float ct=cos(uTilt),st=sin(uTilt);
 p.xy=vec2(p.x*ct-p.y*st,p.x*st+p.y*ct);
 float k=1./(1.-p.z*.45);
 vec2 q=p.xy*k*uScale+uOff;
 gl_Position=vec4(q.x/uAsp,q.y,0.,1.);
 float depth=p.z*.5+.5;
 vec3 col=aK.x<.5?vec3(.37,.82,.90):(aK.x<1.5?vec3(.93,.56,.70):vec3(.55,.75,1.));
 float a=(aK.x>1.5?.4:.95)*(.25+.75*depth)*uAlpha;
 vC=vec4(col,a);
 gl_PointSize=(aK.x>1.5?3.:7.+aK.y*3.)*k*uDpr*uScale*1.7;}`;
        const FS = `precision mediump float;varying vec4 vC;
void main(){float a=smoothstep(.5,.05,length(gl_PointCoord-.5))*vC.a;gl_FragColor=vec4(vC.rgb*a,a);}`;
        const sh = (t, src) => { const x = g.createShader(t); g.shaderSource(x, src); g.compileShader(x); return g.getShaderParameter(x, g.COMPILE_STATUS) ? x : null; };
        const v = sh(g.VERTEX_SHADER, VS), f = sh(g.FRAGMENT_SHADER, FS);
        if (!v || !f) return;
        const pr = g.createProgram(); g.attachShader(pr, v); g.attachShader(pr, f); g.linkProgram(pr);
        if (!g.getProgramParameter(pr, g.LINK_STATUS)) return;
        g.useProgram(pr);

        // geometry: two strands + base-pair rungs, built once
        const STEPS = 230, TURNS = 3.4, R = 0.38, H = 1.9, data = [];
        for (let i = 0; i < STEPS; i++) {
            const y = -H + (2 * H * i) / (STEPS - 1), th = (y / H) * TURNS * Math.PI;
            const A = [R * Math.cos(th), y, R * Math.sin(th)], B = [-A[0], y, -A[2]];
            data.push(...A, 0, Math.random(), ...B, 1, Math.random());
            if (i % 6 === 0) for (let k = 1; k < 6; k++) { const m = k / 6; data.push(A[0] + (B[0] - A[0]) * m, y, A[2] + (B[2] - A[2]) * m, 2, Math.random()); }
        }
        const buf = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, buf);
        g.bufferData(g.ARRAY_BUFFER, new Float32Array(data), g.STATIC_DRAW);
        const COUNT = data.length / 5; // 3 position + 2 attribute floats per point
        const aP = g.getAttribLocation(pr, "aP"), aK = g.getAttribLocation(pr, "aK");
        g.enableVertexAttribArray(aP); g.vertexAttribPointer(aP, 3, g.FLOAT, false, 20, 0);
        g.enableVertexAttribArray(aK); g.vertexAttribPointer(aK, 2, g.FLOAT, false, 20, 12);
        const U = n => g.getUniformLocation(pr, n);
        const uAng = U("uAng"), uTilt = U("uTilt"), uAsp = U("uAsp"), uScale = U("uScale"), uAlpha = U("uAlpha"), uDpr = U("uDpr"), uOff = U("uOff");
        g.enable(g.BLEND); g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);

        let scale = 1, mx = 0, my = 0, tx = 0, ty = 0, W = 1, H2 = 1, dpr = 1;
        const resize = () => {
            dpr = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1 : 1.5) * scale;
            W = Math.max(1, Math.round(cta.clientWidth * dpr)); H2 = Math.max(1, Math.round(cta.clientHeight * dpr));
            cv.width = W; cv.height = H2; g.viewport(0, 0, W, H2);
        };
        resize();
        if (finePointer) cta.addEventListener("pointermove", e => {
            const r = cta.getBoundingClientRect();
            tx = ((e.clientX - r.left) / r.width) * 2 - 1; ty = ((e.clientY - r.top) / r.height) * 2 - 1;
        });
        const draw = now => {
            const t = now / 1000, asp = W / H2, narrow = asp < 0.9;
            mx = lerp(mx, tx, 0.05); my = lerp(my, ty, 0.05);
            g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
            g.uniform1f(uAsp, asp); g.uniform1f(uDpr, dpr);
            // large helix right, smaller counter-rotating helix left; both react gently to the cursor
            g.uniform1f(uScale, narrow ? 0.42 : 0.62); g.uniform1f(uAlpha, narrow ? 0.5 : 1);
            g.uniform1f(uTilt, 0.3 + my * 0.12); g.uniform1f(uAng, t * 0.35 + mx * 0.9);
            g.uniform2f(uOff, asp * (narrow ? 0.85 : 0.7) + mx * 0.04, narrow ? 0.3 : 0.02 - my * 0.03);
            g.drawArrays(g.POINTS, 0, COUNT);
            g.uniform1f(uScale, narrow ? 0.3 : 0.44); g.uniform1f(uAlpha, narrow ? 0.4 : 0.7);
            g.uniform1f(uTilt, -0.26 + my * 0.1); g.uniform1f(uAng, -t * 0.28 + 1.7 + mx * 0.7);
            g.uniform2f(uOff, -asp * (narrow ? 0.85 : 0.76) + mx * 0.03, narrow ? -0.45 : -0.12);
            g.drawArrays(g.POINTS, 0, COUNT);
        };
        new ResizeObserver(() => { resize(); draw(performance.now()); }).observe(cta);
        draw(1200);
        cta.classList.add("gl");
        if (reduce) return;
        let run = false, vis = false, raf = 0, last = 0, ema = 16, n = 0;
        const loop = now => {
            draw(now);
            if (last) ema = ema * 0.9 + Math.min(now - last, 200) * 0.1;
            last = now;
            if (++n % 20 === 0 && ema > 30 && scale > 0.4) { scale = Math.max(0.4, scale * 0.75); resize(); }
            raf = requestAnimationFrame(loop);
        };
        const sync = () => {
            const want = vis && !document.hidden;
            if (want && !run) { run = true; last = 0; raf = requestAnimationFrame(loop); }
            else if (!want && run) { run = false; cancelAnimationFrame(raf); }
        };
        new IntersectionObserver(([e]) => { vis = e.isIntersecting; sync(); }).observe(cta);
        document.addEventListener("visibilitychange", sync);
        addEventListener("pagehide", () => { cancelAnimationFrame(raf); const x = g.getExtension("WEBGL_lose_context"); x && x.loseContext(); });
    })();

    /* ---------- Hero: microscope-lens tissue shader (raw WebGL, ~4 KB) ---------- */
    const hero = document.querySelector(".hero");
    const canvas = hero.querySelector(".hero-canvas");
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return; // CSS fallback stays visible

    const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const FRAG = `precision highp float;
uniform vec2 uR,uM;uniform float uT;
vec2 h2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
vec3 vor(vec2 p,float t){vec2 g=floor(p),f=fract(p);float d1=8.,d2=8.;vec2 id=vec2(0.);
 for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 o=vec2(float(i),float(j));vec2 r=h2(g+o);
  r=.5+.38*sin(t+6.2831*r);vec2 v=o+r-f;float d=dot(v,v);
  if(d<d1){d2=d1;d1=d;id=g+o;}else if(d<d2){d2=d;}}
 return vec3(sqrt(d1),sqrt(d2),h2(id).x);}
void main(){
 vec2 uv=gl_FragCoord.xy/uR;float asp=uR.x/uR.y;
 vec2 p=(uv-.5)*vec2(asp,1.),m=(uM-.5)*vec2(asp,1.);
 float R=.27;float dl=length(p-m);
 float lens=smoothstep(R,R-.035,dl);
 vec2 q=mix(p,m+(p-m)*.6,lens);            // magnify inside the lens
 float sc=8.;
 vec3 v=vor(q*sc,uT*.22);
 float edge=smoothstep(.0,.07,v.y-v.x);    // 0 on cell membranes
 float nuc=smoothstep(.30,.24,v.x);        // nucleus
 vec3 navy=vec3(.016,.063,.118);
 vec3 col=navy+vec3(.03,.10,.16)*(1.-edge)+vec3(.015,.04,.08)*nuc;
 vec3 eos=mix(vec3(.50,.17,.34),vec3(.92,.52,.68),v.z);   // eosin
 vec3 hem=vec3(.17,.13,.40);                               // hematoxylin
 vec3 tis=eos*(.30+.7*edge);
 tis=mix(tis,hem,nuc*.9);
 tis+=vec3(.28,.78,.90)*(1.-edge)*.22;
 tis+=vec3(.9,.8,1.)*smoothstep(.12,.0,v.x)*nuc*.12;
 col=mix(col,tis,lens);
 col+=vec3(.37,.82,.90)*smoothstep(.007,.0,abs(dl-R))*.7;   // lens rim
 col*=mix(.45,1.,smoothstep(.15,.85,uv.x));                 // keep headline area calm
 col*=1.-.55*dot(uv-.5,uv-.5);
 gl_FragColor=vec4(col,1.);}`;

    const compile = (type, src) => {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "uR"), uM = gl.getUniformLocation(prog, "uM"), uT = gl.getUniformLocation(prog, "uT");

    const small = innerWidth < 760;
    const dprCap = small ? 1 : 1.5;
    let W = 1, H = 1, scale = 1; // scale drops automatically on slow devices
    const resize = () => {
        const dpr = Math.min(devicePixelRatio || 1, dprCap) * scale;
        W = Math.max(1, Math.round(hero.clientWidth * dpr));
        H = Math.max(1, Math.round(hero.clientHeight * dpr));
        canvas.width = W; canvas.height = H;
        gl.viewport(0, 0, W, H);
        gl.uniform2f(uR, W, H);
    };
    resize();
    new ResizeObserver(() => { resize(); draw(); }).observe(hero);

    // lens target (0..1, origin bottom-left). Idle path drifts on the right; pointer takes over.
    let mx = 0.78, my = 0.55, tx = mx, ty = my, lastPointer = -1e9, t0 = performance.now();
    if (finePointer) hero.addEventListener("pointermove", e => {
        const r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width; ty = 1 - (e.clientY - r.top) / r.height;
        lastPointer = performance.now();
    });

    function draw(now = performance.now()) {
        const t = (now - t0) / 1000;
        if (now - lastPointer > 2500) { tx = 0.78 + 0.07 * Math.sin(t * 0.35); ty = 0.5 + 0.14 * Math.sin(t * 0.27 + 1); }
        mx = lerp(mx, tx, 0.06); my = lerp(my, ty, 0.06);
        gl.uniform2f(uM, mx, my);
        gl.uniform1f(uT, t);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    draw();
    hero.classList.add("gl");
    if (reduce) return; // single static frame

    // Render only while the hero is visible and the tab is active
    let running = false, visible = true, raf = 0;
    let last = 0, ema = 16, frames = 0;
    const loop = now => {
        draw(now);
        // adaptive quality: if frames are slow, render at lower resolution (canvas is CSS-scaled)
        if (last) ema = ema * 0.9 + Math.min(now - last, 200) * 0.1;
        last = now;
        if (++frames % 20 === 0 && ema > 30 && scale > 0.4) { scale = Math.max(0.4, scale * 0.75); resize(); }
        raf = requestAnimationFrame(loop);
    };
    const sync = () => {
        const want = visible && !document.hidden;
        if (want && !running) { running = true; last = 0; raf = requestAnimationFrame(loop); }
        else if (!want && running) { running = false; cancelAnimationFrame(raf); }
    };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(hero);
    document.addEventListener("visibilitychange", sync);
    sync();

    canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); cancelAnimationFrame(raf); running = false; hero.classList.remove("gl"); });
    addEventListener("pagehide", () => { cancelAnimationFrame(raf); gl.deleteProgram(prog); gl.deleteBuffer(buf); const x = gl.getExtension("WEBGL_lose_context"); x && x.loseContext(); });
})();
