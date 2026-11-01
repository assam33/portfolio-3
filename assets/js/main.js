/* ───────── helpers ───────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad2 = n => String(n).padStart(2, "0");
const isSet = v => typeof v === "string" && v.trim() !== "" && v.trim() !== "#";

const ICON = {
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>',
  arrow: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5"/></svg>'
};

/* ───────── fill text ───────── */
function fillText() {
  const map = { ...SITE, initial: SITE.name.trim()[0].toUpperCase() + ".", shortName: SITE.name };
  $$("[data-c]").forEach(el => { const v = map[el.dataset.c]; if (v != null) el.textContent = v; });
  document.title = `${SITE.name} — ${SITE.role}`;
  $("#heroImg").alt = `Portrait of ${SITE.name}`;
  $("#foot").textContent = `© ${new Date().getFullYear()} ${SITE.name} — ${SITE.role}`;
  const resume = $("#resumeLink"), talk = $("#talk");
  if (isSet(SITE.resume)) resume.href = SITE.resume; else resume.hidden = true;
  if (isSet(SITE.email)) talk.href = "mailto:" + SITE.email.trim(); else talk.hidden = true;
  const links = [
    { name: "GitHub", note: "View my projects", href: SITE.github, icon: ICON.code, ext: true },
    { name: "LinkedIn", note: "Connect with me", href: SITE.linkedin, icon: ICON.person, ext: true },
    { name: "Email", note: SITE.email, href: isSet(SITE.email) ? "mailto:" + SITE.email.trim() : "", icon: ICON.mail, ext: false }
  ].filter(l => isSet(l.href));
  const ext = l => l.ext ? ' target="_blank" rel="noopener"' : "";
  $("#heroSocials").innerHTML = links.map(l => `<a href="${esc(l.href)}"${ext(l)} aria-label="${l.name}">${l.icon}</a>`).join("");
  $("#finds").innerHTML = links.map(l => `
    <a class="find" href="${esc(l.href)}"${ext(l)}>
      <span class="ico">${l.icon}</span><span><b>${l.name}</b><small>${esc(l.note)}</small></span>
      <svg class="go" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5"/></svg>
    </a>`).join("");
  $("#findCol").hidden = !links.length;
}

/* ───────── toolkit ───────── */
function renderSkills() {
  const rows = $("#rows"), hint = $("#hint"), sec = $("#skills");
  const touch = matchMedia("(hover: none)").matches;
  const idle = touch ? "Tap a skill." : "Hover a skill.";
  hint.textContent = idle;
  rows.innerHTML = SITE.skills.map(g => `
    <div class="row"><div class="cat">${esc(g.cat)}</div>
      <div class="skills">${g.items.map(([n, d]) => `<button type="button" class="skill" data-desc="${esc(d)}">${esc(n)}</button>`).join("")}</div>
    </div>`).join("");
  let active = null;
  const set = el => {
    if (active) active.classList.remove("active");
    active = el;
    if (el) { el.classList.add("active"); sec.classList.add("hovering"); hint.textContent = el.dataset.desc; hint.classList.add("on"); }
    else { sec.classList.remove("hovering"); hint.textContent = idle; hint.classList.remove("on"); }
  };
  $$(".skill", rows).forEach(b => {
    b.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") set(b); });
    b.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") set(null); });
    b.addEventListener("focus", () => set(b));
    b.addEventListener("blur", () => set(null));
    b.addEventListener("click", () => set(active === b && touch ? null : b));
  });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -18% 0px" });
  $$(".row", rows).forEach(r => io.observe(r));
}

/* ───────── project covers (generated SVG, no external images) ───────── */
function coverUI(kind, a) {
  const L = (x, y, w, o = .16, h = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" opacity="${o}"/>`;
  if (kind === "dashboard") return `
    <rect width="288" height="186" fill="#0d0f13"/><rect width="52" height="186" fill="#111318"/>
    <circle cx="16" cy="16" r="6" fill="${a}"/>${[40, 56, 72, 88, 104].map((y, i) => L(10, y, i ? 26 : 32, i ? .14 : .4)).join("")}
    ${L(64, 14, 70, .55, 6)}${L(64, 26, 44, .2)}
    ${[64, 136, 208].map((x, i) => `<rect x="${x}" y="40" width="66" height="36" rx="5" fill="#15181e"/>${L(x + 8, 49, 28, .2, 3)}${L(x + 8, 60, i === 0 ? 40 : 30, .6, 7)}`).join("")}
    <rect x="64" y="86" width="210" height="88" rx="6" fill="#121419"/>
    <path d="M74 156 L100 140 L124 146 L150 118 L176 126 L202 100 L228 108 L262 94" fill="none" stroke="${a}" stroke-width="2.2"/>
    <path d="M74 156 L100 140 L124 146 L150 118 L176 126 L202 100 L228 108 L262 94 V166 H74Z" fill="${a}" opacity=".12"/>
    ${[100, 150, 202].map(x => `<circle cx="${x}" cy="${x === 100 ? 140 : x === 150 ? 118 : 100}" r="2.6" fill="${a}"/>`).join("")}`;
  if (kind === "shop") return `
    <rect width="288" height="186" fill="#0e0c10"/>
    <rect x="8" y="8" width="272" height="90" rx="6" fill="#16121a"/>
    ${L(20, 30, 74, .8, 9)}${L(20, 46, 56, .6, 9).replace('fill="#fff"', `fill="${a}"`)}${L(20, 64, 60, .2)}
    <rect x="20" y="76" width="40" height="12" rx="6" fill="${a}"/>
    <circle cx="206" cy="53" r="34" fill="${a}" opacity=".22"/><circle cx="206" cy="53" r="22" fill="${a}" opacity=".35"/>
    <path d="M182 62 Q196 44 214 50 L232 56 Q236 64 226 66 L186 68 Q180 66 182 62Z" fill="#f2eef4" opacity=".9"/>
    ${[8, 77, 146, 215].map((x, i) => `<rect x="${x}" y="106" width="65" height="72" rx="5" fill="#16131a"/><rect x="${x + 14}" y="116" width="37" height="34" rx="4" fill="${i % 2 ? a : "#3a3340"}" opacity="${i % 2 ? .55 : 1}"/>${L(x + 8, 158, 36, .3, 3)}${L(x + 8, 166, 22, .5, 3).replace('fill="#fff"', `fill="${a}"`)}`).join("")}`;
  if (kind === "chat") return `
    <rect width="288" height="186" fill="#0c1016"/><rect width="92" height="186" fill="#0f141b"/>
    ${[14, 44, 74, 104, 134].map((y, i) => `<rect x="4" y="${y - 6}" width="84" height="28" rx="5" fill="${i === 1 ? a : "transparent"}" opacity="${i === 1 ? .16 : 1}"/><circle cx="18" cy="${y + 8}" r="8" fill="${i === 1 ? a : "#27303c"}"/>${L(32, y + 2, 44, .45, 3)}${L(32, y + 10, 32, .18, 3)}`).join("")}
    ${L(104, 12, 60, .6, 5)}<rect x="92" y="26" width="196" height="1" fill="#fff" opacity=".06"/>
    <rect x="104" y="38" width="96" height="20" rx="8" fill="#1b2330"/><rect x="172" y="66" width="104" height="20" rx="8" fill="${a}"/>
    <rect x="104" y="94" width="120" height="30" rx="8" fill="#1b2330"/><rect x="196" y="132" width="80" height="20" rx="8" fill="${a}"/>
    <path d="M262 147 l3 3 5-6" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/>
    <rect x="102" y="162" width="178" height="16" rx="8" fill="#141a22" stroke="#fff" stroke-opacity=".08"/>`;
  if (kind === "auth") return `
    <rect width="288" height="186" fill="#0b100d"/>
    <rect x="84" y="14" width="120" height="158" rx="10" fill="#111814" stroke="${a}" stroke-opacity=".35"/>
    <circle cx="144" cy="42" r="13" fill="none" stroke="${a}" stroke-width="2"/><circle cx="144" cy="39" r="4" fill="${a}"/><path d="M136 49 q8 -8 16 0" stroke="${a}" stroke-width="2" fill="none"/>
    ${L(118, 64, 52, .5, 4)}
    <rect x="98" y="78" width="92" height="16" rx="5" fill="#18211c"/>${L(104, 84, 40, .25, 3)}
    <rect x="98" y="100" width="92" height="16" rx="5" fill="#18211c"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${106 + i * 8}" cy="108" r="2" fill="#fff" opacity=".4"/>`).join("")}
    <rect x="98" y="124" width="92" height="18" rx="5" fill="${a}"/>${L(126, 131, 36, .9, 4).replace('fill="#fff"', 'fill="#08130c"')}
    ${L(112, 152, 64, .15, 3)}
    ${[20, 46, 72].map((y, i) => `<rect x="10" y="${y}" width="60" height="18" rx="4" fill="#121a15"/><circle cx="20" cy="${y + 9}" r="3" fill="${a}" opacity="${1 - i * .25}"/>${L(28, y + 7, 34, .25, 3)}`).join("")}`;
  /* docs */ return `
    <rect width="288" height="186" fill="#0d0b14"/>
    <rect x="10" y="10" width="124" height="166" rx="5" fill="#e9e6ef" opacity=".92"/>
    ${[22, 30, 38, 46, 60, 68, 76, 84, 98, 106, 114, 128, 136, 144, 152].map((y, i) => `<rect x="20" y="${y}" width="${i % 4 === 3 ? 60 : 102}" height="3" rx="1.5" fill="#1d1a26" opacity="${i < 1 ? .7 : .25}"/>`).join("")}
    <rect x="18" y="64" width="106" height="24" rx="3" fill="${a}" opacity=".22"/>
    <rect x="146" y="14" width="132" height="26" rx="8" fill="#1a1726"/>${L(154, 25, 90, .4, 3)}
    <rect x="146" y="50" width="132" height="70" rx="8" fill="#16131f" stroke="${a}" stroke-opacity=".4"/>
    ${L(154, 60, 112, .45, 3)}${L(154, 69, 104, .45, 3)}${L(154, 78, 116, .45, 3)}${L(154, 87, 70, .45, 3)}
    <rect x="154" y="98" width="38" height="13" rx="6.5" fill="${a}" opacity=".85"/>${L(160, 103, 26, .9, 3).replace('fill="#fff"', 'fill="#120e1f"')}
    <rect x="146" y="160" width="132" height="16" rx="8" fill="#14121c" stroke="#fff" stroke-opacity=".08"/>`;
}
function cover(p, i) {
  const a = p.accent, id = "cv" + i;
  let seed = (i + 3) * 9973; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const bokeh = Array.from({ length: 12 }, () => `<circle cx="${(R() * 640).toFixed(0)}" cy="${(R() * 200).toFixed(0)}" r="${(4 + R() * 16).toFixed(1)}" fill="${R() > .45 ? a : "#ffb874"}" opacity="${(.08 + R() * .22).toFixed(2)}"/>`).join("");
  return `<svg viewBox="0 0 640 368" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(p.title)} interface preview">
    <defs>
      <radialGradient id="${id}g" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="${a}" stop-opacity=".34"/><stop offset=".55" stop-color="${a}" stop-opacity=".07"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a130e"/><stop offset="1" stop-color="#060504"/></linearGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}" stop-opacity=".35"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></linearGradient>
      <filter id="${id}b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="${id}s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <rect width="640" height="368" fill="#08080a"/>
    <g filter="url(#${id}s)">${bokeh}</g>
    <rect width="640" height="368" fill="url(#${id}g)"/>
    <rect y="292" width="640" height="76" fill="url(#${id}d)"/>
    <rect x="176" y="62" width="288" height="196" rx="10" fill="${a}" opacity=".5" filter="url(#${id}b)"/>
    <rect x="166" y="52" width="308" height="210" rx="11" fill="#0b0b0e" stroke="#2a2b31"/>
    <g transform="translate(176 62)"><svg width="288" height="186" viewBox="0 0 288 186">${coverUI(p.kind, a)}</svg></g>
    <path d="M152 264 H488 L516 294 H124 Z" fill="#1f2025"/>
    <path d="M124 294 H516 V299 Q516 302 512 302 H128 Q124 302 124 299 Z" fill="#111114"/>
    <path d="M150 302 H490 L524 368 H116 Z" fill="url(#${id}r)" opacity=".45"/>
    <g opacity=".95">
      <rect x="36" y="112" width="104" height="70" rx="8" fill="#0f1014" stroke="${a}" stroke-opacity=".45"/>
      <circle cx="52" cy="128" r="6" fill="${a}" opacity=".8"/><rect x="64" y="125" width="58" height="5" rx="2.5" fill="#fff" opacity=".35"/>
      <rect x="48" y="144" width="80" height="4" rx="2" fill="#fff" opacity=".15"/><rect x="48" y="155" width="62" height="4" rx="2" fill="#fff" opacity=".15"/><rect x="48" y="166" width="70" height="4" rx="2" fill="#fff" opacity=".15"/>
      <rect x="498" y="74" width="108" height="84" rx="8" fill="#0f1014" stroke="${a}" stroke-opacity=".45"/>
      <rect x="510" y="86" width="50" height="5" rx="2.5" fill="#fff" opacity=".35"/>
      ${[0, 1, 2].map(k => `<rect x="510" y="${102 + k * 16}" width="10" height="10" rx="3" fill="${a}" opacity="${.9 - k * .25}"/><rect x="526" y="${105 + k * 16}" width="${60 - k * 10}" height="4" rx="2" fill="#fff" opacity=".18"/>`).join("")}
    </g>
  </svg>`;
}
function card(p, i) {
  const links = [["Live", p.live], ["Code", p.code]].filter(([, h]) => isSet(h))
    .map(([t, h]) => `<a class="chip" href="${esc(h)}" target="_blank" rel="noopener">${t} ${ICON.arrow}</a>`).join("");
  const media = isSet(p.image)
    ? `<img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy" decoding="async">`
    : cover(p, i);
  return `<article class="card" style="--acc:${esc(p.accent)}">
    <div class="cover">${media}</div>
    <div class="card-body">
      <div class="meta"><span>${pad2(i + 1)} — ${esc(p.cat)}</span><i></i></div>
      <div class="title-row"><h3>${esc(p.title)}</h3>${links ? `<div class="links">${links}</div>` : ""}</div>
      <p>${esc(p.desc)}</p>
      <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
    </div>
  </article>`;
}
function renderProjects() {
  const ps = SITE.projects, feat = ps.slice(0, 3), rest = ps.slice(3);
  $("#featured").innerHTML = feat.map((p, i) => card(p, i)).join("");
  $("#moreGrid").innerHTML = rest.map((p, i) => card(p, i + 3)).join("");
  $("#total").textContent = `${pad2(ps.length)} total`;
  const btn = $("#viewAll"), more = $("#more");
  if (!rest.length) { btn.hidden = true; return; }
  $("#moreCount").textContent = "+" + rest.length;
  more.inert = true;
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", open);
    more.classList.toggle("open", open);
    more.inert = !open;
    $(".va-text", btn).textContent = open ? "Show fewer" : "View all projects";
    if (!open && lenis) lenis.resize();
  });
}

/* ───────── journey ───────── */
function renderJourney() {
  const wrap = $("#chapters");
  wrap.insertAdjacentHTML("beforeend", SITE.journey.map((c, i) => `
    <article class="chapter">
      <span class="num" aria-hidden="true">${pad2(i + 1)}</span>
      <p class="label">Chapter ${pad2(i + 1)}</p>
      <h3>${esc(c.title)}</h3>
      <p class="txt">${esc(c.text)}</p>
    </article>`).join(""));
}

/* ───────── theme toggle ───────── */
function initTheme() {
  const root = document.documentElement, btn = $("#themeBtn");
  try { const t = localStorage.getItem("portfolio-theme"); if (t === "light" || t === "dark") root.dataset.theme = t; } catch (e) {}
  const current = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const label = () => btn.setAttribute("aria-label", current() === "dark" ? "Switch to light theme" : "Switch to dark theme");
  label();
  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch (e) {}
    label();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", label);
}

/* ════════ HERO SCENE — a night desk drawn on canvas, scrubbed by scroll ════════ */
const Scene = (() => {
  const VW = 1600, VH = 900, FOCUS = [1070, 450];
  const S = { TL: [780, 300], TR: [1330, 240], BL: [810, 660], BR: [1360, 600], FL: [890, 750], FR: [1440, 690] };
  let cv, ctx, W = 0, H = 0, dpr = 1, s = 1, ox = 0, oy = 0, q = 0, bgC, deskC, wakeAt = null, cw = 11.4;
  const MONO = '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace';

  /* code shown on the laptop, tokenized for colour */
  const COL = { kw: "#e3784f", str: "#d8c07a", com: "#59616d", fn: "#8db8ea", key: "#c3b2ef", pun: "#8b929c", def: "#d5d9df" };
  const SRC = () => [
    "// portfolio.config.js",
    "import { craft } from \"./habits\";",
    "",
    "export const developer = {",
    `  name: "${SITE.name}",`,
    `  role: "${SITE.role}",`,
    `  degree: "${SITE.degree}",`,
    `  certified: "${SITE.certificate}",`,
    `  experience: "${SITE.experience}",`,
    "};",
    "",
    "export async function ship(idea) {",
    "  const plan = await craft.design(idea);",
    "  const app = await craft.build(plan);",
    "  return app.deploy({ region: \"edge\" });",
    "}",
    "ship(\"ideas → impact\");"
  ];
  let LINES = [], TOTAL = 0;
  function tokenize() {
    const KW = /^(import|from|export|const|async|await|function|return|let|new)\b/;
    LINES = SRC().map(line => {
      const out = []; let i = 0;
      const push = (t, c) => out.push({ t, c });
      while (i < line.length) {
        const r = line.slice(i);
        let m;
        if (r.startsWith("//")) { push(r, COL.com); break; }
        if ((m = r.match(/^"[^"]*"/))) { push(m[0], COL.str); i += m[0].length; continue; }
        if ((m = r.match(KW))) { push(m[0], COL.kw); i += m[0].length; continue; }
        if ((m = r.match(/^[A-Za-z_]\w*(?=\()/))) { push(m[0], COL.fn); i += m[0].length; continue; }
        if ((m = r.match(/^[A-Za-z_]\w*(?=:)/))) { push(m[0], COL.key); i += m[0].length; continue; }
        if ((m = r.match(/^[A-Za-z_]\w*/))) { push(m[0], COL.def); i += m[0].length; continue; }
        if ((m = r.match(/^\s+/))) { push(m[0], COL.def); i += m[0].length; continue; }
        push(r[0], COL.pun); i++;
      }
      return out;
    });
    TOTAL = LINES.reduce((n, l) => n + l.reduce((k, t) => k + t.t.length, 0) + 1, 0);
  }

  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  function rad(g, x, y, r, c, a, op) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, rgba(c, a)); gr.addColorStop(1, rgba(c, 0));
    g.save(); if (op) g.globalCompositeOperation = op; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
  }
  function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h); }
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  function affine(g, P0, Px, Py, w, h) { g.transform((Px[0] - P0[0]) / w, (Px[1] - P0[1]) / w, (Py[0] - P0[0]) / h, (Py[1] - P0[1]) / h, P0[0], P0[1]); }

  /* background: wall, lamp-lit shelves, window bokeh — pre-rendered and softened */
  function renderBG(k) {
    const c = document.createElement("canvas"); c.width = VW * k; c.height = VH * k;
    const g = c.getContext("2d"); g.scale(k, k);
    let gr = g.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, "#0a0909"); gr.addColorStop(1, "#16120f");
    g.fillStyle = gr; g.fillRect(0, 0, VW, VH);
    rad(g, 330, 250, 640, [255, 150, 85], .15);
    const R = rng(11), BOOK = ["#3a2a20", "#4b3527", "#2c2824", "#5b3b29", "#23272c", "#3e3a32", "#4a2b22", "#2f3a35", "#6a4a33", "#1f2a33"];
    const x0 = 60, x1 = 620;
    g.fillStyle = "#1b130e"; g.fillRect(x0 - 16, 40, 16, 600); g.fillRect(x1, 40, 16, 600);
    [190, 345, 500].forEach(y => {
      let x = x0 + 8;
      while (x < x1 - 24) {
        if (R() < .07) { x += 34 + R() * 50; continue; }
        const w = 14 + R() * 22, h = 84 + R() * 56, col = BOOK[(R() * BOOK.length) | 0];
        if (R() < .06 && x < x1 - 120) { // a leaning book
          g.save(); g.translate(x, y); g.rotate(-.32); g.fillStyle = col; g.fillRect(0, -h, w, h); g.restore(); x += h * .32 + w; continue;
        }
        g.fillStyle = col; g.fillRect(x, y - h, w, h);
        g.fillStyle = "rgba(255,215,170,.08)"; g.fillRect(x, y - h + 12, w, 3); g.fillRect(x, y - 16, w, 2);
        g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(x + w - 2, y - h, 2, h);
        x += w + 2;
      }
      g.fillStyle = "#2c1e15"; g.fillRect(x0 - 16, y, x1 - x0 + 32, 12);
      g.fillStyle = "rgba(255,190,130,.14)"; g.fillRect(x0 - 16, y, x1 - x0 + 32, 2);
    });
    // pot + plant on top shelf corner
    g.fillStyle = "#2a2522"; g.fillRect(540, 150, 44, 40);
    g.fillStyle = "#1f3326";
    for (let i = 0; i < 9; i++) { g.save(); g.translate(562, 150); g.rotate(-1.3 + i * .32); g.beginPath(); g.ellipse(0, -30, 9, 30, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
    // light falloff away from the lamp
    gr = g.createLinearGradient(0, 0, 700, 0); gr.addColorStop(0, "rgba(6,5,5,0)"); gr.addColorStop(1, "rgba(6,5,5,.55)");
    g.fillStyle = gr; g.fillRect(0, 0, 700, 640);
    // window with city bokeh
    const wx = 1150, wy = 70, ww = 420, wh = 470;
    g.fillStyle = "#070a10"; g.fillRect(wx, wy, ww, wh);
    gr = g.createLinearGradient(0, wy, 0, wy + wh); gr.addColorStop(0, "rgba(40,60,110,.18)"); gr.addColorStop(1, "rgba(120,80,60,.10)");
    g.fillStyle = gr; g.fillRect(wx, wy, ww, wh);
    g.save(); g.beginPath(); g.rect(wx, wy, ww, wh); g.clip();
    for (let i = 0; i < 46; i++) {
      const bx = wx + R() * ww, by = wy + wh * .35 + R() * wh * .65, br = 4 + R() * 22, warm = R() > .4;
      rad(g, bx, by, br, warm ? [255, 178, 110] : [140, 175, 255], .18 + R() * .35);
    }
    g.restore();
    g.strokeStyle = "#141110"; g.lineWidth = 14; g.strokeRect(wx, wy, ww, wh);
    g.fillStyle = "#141110"; g.fillRect(wx + ww / 2 - 4, wy, 8, wh); g.fillRect(wx, wy + wh * .45, ww, 8);
    rad(g, 210, 70, 260, [255, 175, 110], .22); // lamp source glow, top-left
    // soften
    if ("filter" in g) {
      const c2 = document.createElement("canvas"); c2.width = c.width; c2.height = c.height;
      const g2 = c2.getContext("2d"); g2.filter = `blur(${(3.2 * k).toFixed(1)}px)`; g2.drawImage(c, 0, 0);
      if (g2.filter && g2.filter !== "none") return c2;
    }
    return c;
  }

  /* desk, notebook, mug — sharp, pre-rendered */
  function renderDesk(k) {
    const c = document.createElement("canvas"); c.width = VW * k; c.height = VH * k;
    const g = c.getContext("2d"); g.scale(k, k);
    g.save();
    g.beginPath(); g.moveTo(0, 612); g.lineTo(VW, 585); g.lineTo(VW, VH); g.lineTo(0, VH); g.closePath();
    let gr = g.createLinearGradient(0, 585, 0, VH); gr.addColorStop(0, "#26170f"); gr.addColorStop(1, "#0d0805");
    g.fillStyle = gr; g.fill(); g.clip();
    const R = rng(29);
    for (let i = 0; i < 170; i++) {
      const y0 = 590 + R() * 320, amp = 1 + R() * 3, f = .003 + R() * .009, ph = R() * 6, tilt = (1 - (y0 - 590) / 320) * -27;
      g.strokeStyle = `rgba(255,${180 + (R() * 40) | 0},140,${(.012 + R() * .035).toFixed(3)})`; g.lineWidth = .7 + R() * 1.6;
      g.beginPath();
      for (let x = 0; x <= VW; x += 20) { const y = y0 + Math.sin(x * f + ph) * amp + (x / VW) * tilt; x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
    }
    // laptop shadow
    g.save(); g.translate(1130, 712); g.rotate(-.1); g.scale(1, .2); rad(g, 0, 0, 430, [0, 0, 0], .7); g.restore();
    // notebook + pen
    const A = [600, 790], B = [820, 768], C = [850, 848], D = [630, 871];
    g.save(); g.translate(0, 6); g.fillStyle = "rgba(0,0,0,.45)"; g.beginPath(); [A, B, C, D].forEach((p, i) => i ? g.lineTo(p[0] + 6, p[1]) : g.moveTo(p[0] + 6, p[1])); g.fill(); g.restore();
    g.fillStyle = "#2a241d"; g.beginPath(); [A, B, C, D].forEach((p, i) => i ? g.lineTo(p[0], p[1] + 5) : g.moveTo(p[0], p[1] + 5)); g.fill();
    g.fillStyle = "#1e1915"; g.beginPath(); [A, B, C, D].forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.fill();
    g.strokeStyle = "rgba(160,70,40,.55)"; g.lineWidth = 3; g.beginPath(); g.moveTo(790, 771); g.lineTo(820, 851); g.stroke();
    g.lineCap = "round"; g.strokeStyle = "#7b5b3a"; g.lineWidth = 6; g.beginPath(); g.moveTo(655, 818); g.lineTo(790, 800); g.stroke();
    g.strokeStyle = "rgba(255,225,180,.35)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(660, 815.5); g.lineTo(786, 798.5); g.stroke();
    g.strokeStyle = "#1a1410"; g.lineWidth = 6; g.beginPath(); g.moveTo(780, 801); g.lineTo(792, 799.5); g.stroke();
    // mug
    const mx = 1520, top = 652, bot = 760, rx = 42, ry = 10;
    rad(g, mx + 8, bot + 4, 70, [0, 0, 0], .55);
    g.beginPath(); g.ellipse(mx + rx + 6, top + 46, 21, 27, 0, -Math.PI / 2.1, Math.PI / 2.1); g.strokeStyle = "#17171a"; g.lineWidth = 10; g.stroke();
    g.beginPath(); g.moveTo(mx - rx, top); g.lineTo(mx - rx, bot); g.ellipse(mx, bot, rx, ry, 0, Math.PI, 0, true); g.lineTo(mx + rx, top); g.ellipse(mx, top, rx, ry, 0, 0, Math.PI, false); g.closePath();
    gr = g.createLinearGradient(mx - rx, 0, mx + rx, 0); gr.addColorStop(0, "#34353b"); gr.addColorStop(.35, "#1d1d21"); gr.addColorStop(1, "#0b0b0d");
    g.fillStyle = gr; g.fill();
    g.beginPath(); g.ellipse(mx, top, rx, ry, 0, 0, Math.PI * 2); g.fillStyle = "#121214"; g.fill();
    g.beginPath(); g.ellipse(mx, top + 2, rx - 5, ry - 3, 0, 0, Math.PI * 2); g.fillStyle = "#1c0f08"; g.fill();
    g.beginPath(); g.ellipse(mx, top, rx, ry, 0, Math.PI * 1.05, Math.PI * 1.95); g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 1.5; g.stroke();
    // warm lamp pool on the desk
    rad(g, 380, 660, 560, [255, 150, 80], .2, "screen");
    g.restore();
    g.strokeStyle = "rgba(255,190,140,.10)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 612); g.lineTo(VW, 585); g.stroke();
    return c;
  }

  function camera(z, dy) {
    const a = s * z * dpr;
    ctx.setTransform(a, 0, 0, a, (ox + s * (FOCUS[0] - z * FOCUS[0])) * dpr, (oy + s * (FOCUS[1] + dy - z * FOCUS[1])) * dpr);
  }

  function drawScreen(on, p, t) {
    ctx.save();
    affine(ctx, S.TL, S.TR, S.BL, 1000, 640);
    rr(ctx, -7, -7, 1014, 654, 22); ctx.fillStyle = "#1a1a1d"; ctx.fill();
    rr(ctx, 0, 0, 1000, 640, 18); ctx.fillStyle = "#060607"; ctx.fill();
    const X = 22, Y = 20, DW = 956, DH = 598;
    ctx.save(); rr(ctx, X, Y, DW, DH, 6); ctx.clip();
    ctx.fillStyle = "#030304"; ctx.fillRect(X, Y, DW, DH);
    ctx.globalAlpha = on;
    ctx.fillStyle = "#0e1218"; ctx.fillRect(X, Y, DW, DH);
    // title bar + tab
    ctx.fillStyle = "#080a0e"; ctx.fillRect(X, Y, DW, 42);
    [["#5a2e28", 20], ["#5a4a28", 40], ["#2a4a32", 60]].forEach(([c, dx]) => { ctx.beginPath(); ctx.arc(X + dx, Y + 21, 6, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); });
    ctx.fillStyle = "#0f1319"; ctx.fillRect(X + 92, Y, 250, 42);
    ctx.fillStyle = "#e3693f"; ctx.fillRect(X + 92, Y, 250, 2);
    ctx.textBaseline = "middle"; ctx.font = `500 15px ${MONO}`; ctx.fillStyle = "#c7ccd4"; ctx.fillText("portfolio.config.js", X + 112, Y + 22);
    // how much code has been typed
    const n = Math.round(TOTAL * (0.15 + 0.85 * clamp((p - .42) / .5)));
    let left = n, cL = 0, cC = 0;
    for (let li = 0; li < LINES.length; li++) {
      const len = LINES[li].reduce((k, tk) => k + tk.t.length, 0);
      if (left > len) { left -= len + 1; cL = li + 1; cC = 0; } else { cL = li; cC = Math.max(0, left); break; }
    }
    cL = Math.min(cL, LINES.length - 1);
    ctx.font = `400 19px ${MONO}`; cw = ctx.measureText("0").width;
    const LH = 28, top = Y + 42 + 30, cx0 = X + 78;
    ctx.fillStyle = "rgba(255,255,255,.035)"; ctx.fillRect(X, top + cL * LH - LH / 2, DW, LH);
    let rem = n;
    for (let li = 0; li <= cL; li++) {
      const y = top + li * LH;
      ctx.textAlign = "right"; ctx.font = `400 16px ${MONO}`; ctx.fillStyle = li === cL ? "#7d8592" : "#353b46"; ctx.fillText(li + 1, X + 54, y);
      ctx.textAlign = "left"; ctx.font = `400 19px ${MONO}`;
      let x = cx0;
      for (const tk of LINES[li]) {
        if (rem <= 0) break;
        const str = tk.t.slice(0, rem);
        ctx.fillStyle = tk.c; ctx.fillText(str, x, y);
        x += str.length * cw; rem -= str.length;
      }
      rem -= 1;
    }
    if (reduce || Math.floor(t / 530) % 2 === 0) { ctx.fillStyle = "#e3693f"; ctx.fillRect(cx0 + cC * cw, top + cL * LH - 11, 2.4, 22); }
    // status bar
    ctx.fillStyle = "#090c11"; ctx.fillRect(X, Y + DH - 28, DW, 28);
    ctx.font = `400 13px ${MONO}`; ctx.fillStyle = "#5a626e"; ctx.fillText("main  ✓ 0 problems", X + 18, Y + DH - 14);
    ctx.textAlign = "right"; ctx.fillText(`Ln ${cL + 1}, Col ${cC + 1}   UTF-8   JavaScript`, X + DW - 18, Y + DH - 14); ctx.textAlign = "left";
    // glass reflection
    ctx.globalAlpha = 1;
    const rg = ctx.createLinearGradient(X, Y, X + DW * .8, Y + DH);
    rg.addColorStop(0, "rgba(255,255,255,.06)"); rg.addColorStop(.42, "rgba(255,255,255,0)"); rg.addColorStop(.5, "rgba(255,255,255,.025)"); rg.addColorStop(.58, "rgba(255,255,255,0)");
    ctx.fillStyle = rg; ctx.fillRect(X, Y, DW, DH);
    ctx.restore();
    ctx.beginPath(); ctx.arc(500, 10, 3, 0, Math.PI * 2); ctx.fillStyle = "#1d1e22"; ctx.fill();
    ctx.restore();
  }

  function drawBase(on) {
    const [FL, FR] = [S.FL, S.FR];
    ctx.beginPath(); ctx.moveTo(FL[0], FL[1]); ctx.lineTo(FR[0], FR[1]); ctx.lineTo(FR[0], FR[1] + 10); ctx.lineTo(FL[0], FL[1] + 10); ctx.closePath();
    ctx.fillStyle = "#101012"; ctx.fill();
    ctx.save();
    affine(ctx, S.BL, S.BR, S.FL, 1000, 300);
    const gr = ctx.createLinearGradient(0, 0, 0, 300);
    const lift = Math.round(12 * on);
    gr.addColorStop(0, `rgb(${42 + lift},${43 + lift},${50 + lift * 1.3})`); gr.addColorStop(1, "#1a1b1f");
    rr(ctx, 0, 0, 1000, 300, 14); ctx.fillStyle = gr; ctx.fill();
    rr(ctx, 66, 24, 868, 156, 10); ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fill();
    const kw = (868 - 6 * 15) / 14, kh = (156 - 6 * 6) / 5;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) {
      if (r === 4 && c > 4 && c <= 9) continue;
      const w = r === 4 && c === 4 ? kw * 6 + 30 : kw, x = 72 + c * (kw + 6), y = 30 + r * (kh + 6);
      ctx.fillStyle = "#121316"; ctx.fillRect(x, y, w, kh);
      ctx.fillStyle = `rgba(170,190,255,${(.035 + .09 * on * (1 - r / 6)).toFixed(3)})`; ctx.fillRect(x, y, w, 2.2);
    }
    rr(ctx, 372, 198, 256, 84, 10); ctx.fillStyle = "rgba(255,255,255,.03)"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(FL[0], FL[1]); ctx.lineTo(FR[0], FR[1]); ctx.stroke();
    ctx.strokeStyle = "#050506"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(S.BL[0], S.BL[1]); ctx.lineTo(S.BR[0], S.BR[1]); ctx.stroke();
  }

  function steam(t) {
    const mx = 1520, top = 646, hgt = 190;
    ctx.save(); ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      const gr = ctx.createLinearGradient(0, top, 0, top - hgt);
      gr.addColorStop(0, "rgba(235,235,245,0)"); gr.addColorStop(.18, "rgba(235,235,245,.07)"); gr.addColorStop(1, "rgba(235,235,245,0)");
      ctx.strokeStyle = gr;
      for (const [lw, a] of [[16, .5], [6, 1]]) {
        ctx.globalAlpha = a; ctx.lineWidth = lw; ctx.beginPath();
        for (let k = 0; k <= 28; k++) {
          const y = top - (k / 28) * hgt, f = k / 28;
          const x = mx + (i - 1) * 13 + Math.sin(y * .035 + t * .0013 + i * 2.1) * 11 * f * 1.5;
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  return {
    init(el) { cv = el; ctx = cv.getContext("2d"); tokenize(); this.resize(); },
    retokenize: tokenize,
    wake(t) { wakeAt = t; },
    resize() {
      W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const ratio = W / H, narrow = ratio < VW / VH;
      if (ratio < .8) {            // phone / portrait: show the whole desk above the headline
        s = Math.max(W / 900, H / VH * .5);
        ox = W * .5 - 1150 * s; oy = H * .34 - FOCUS[1] * s;
      } else if (narrow) {
        s = H / VH; const anchor = ratio > 1.1 ? .62 : .5;
        ox = clamp(W * anchor - FOCUS[0] * s, W - VW * s, 0); oy = 0;
      } else { s = W / VW; ox = 0; oy = (H - VH * s) * .55; }
      const nq = clamp(s * dpr * 1.1, .5, 1.6);
      if (!bgC || Math.abs(nq - q) > .15) { q = nq; bgC = renderBG(q); deskC = renderDesk(q); }
    },
    draw(p, t) {
      if (!W) return;
      const on = wakeAt == null ? 0 : smooth(0, 1, (t - wakeAt) / 1500);
      const e = p * p * (3 - 2 * p), sway = reduce ? 0 : Math.sin(t / 2600) * 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = "#0a0909"; ctx.fillRect(0, 0, cv.width, cv.height);
      camera(1.02 + .07 * e, -10 * e + sway * .5);
      ctx.drawImage(bgC, 0, 0, VW, VH);
      rad(ctx, 1060, 420, 660, [110, 140, 235], .1 * on);
      camera(1.02 + .2 * e, -28 * e + sway);
      ctx.drawImage(deskC, 0, 0, VW, VH);
      ctx.fillStyle = "#0d0805"; ctx.fillRect(-4000, VH - 1, VW + 8000, 4000);
      drawScreen(on, p, t);
      drawBase(on);
      rad(ctx, 1100, 715, 540, [130, 160, 255], .1 * on, "screen");
      steam(reduce ? 0 : t);
    }
  };
})();

/* ───────── scroll-driven state ───────── */
let lenis = null;
const photoIn = $("#photoIn"), heroImg = $("#heroImg");
let photoOp = 1, woke = false;
const hero = $("#top"), stateA = $("#stateA"), stateB = $("#stateB"), frameEl = $("#frame");
const chaptersEl = $("#chapters");
let heroVisible = true, lastFrame = -1, lastP = -1, lastDraw = 0;

function heroProgress() {
  const r = hero.getBoundingClientRect(), stageH = $(".stage").offsetHeight;
  return clamp(-r.top / Math.max(1, r.height - stageH));
}
function applyStates(p) {
  const a = 1 - smooth(.36, .48, p), b = smooth(.52, .64, p);
  stateA.style.opacity = a; stateA.style.transform = `translateY(${(-24 * (1 - a)).toFixed(1)}px)`;
  stateA.style.filter = a < 1 && a > 0 ? `blur(${(6 * (1 - a)).toFixed(1)}px)` : "";
  stateA.style.visibility = a <= 0.001 ? "hidden" : "visible";
  stateB.style.opacity = b; stateB.style.transform = `translateY(${(24 * (1 - b)).toFixed(1)}px)`;
  stateB.style.filter = b < 1 && b > 0 ? `blur(${(6 * (1 - b)).toFixed(1)}px)` : "";
  stateB.style.visibility = b <= 0.001 ? "hidden" : "visible";
  stateA.setAttribute("aria-hidden", a < .5); stateB.setAttribute("aria-hidden", b < .5);
  photoOp = 1 - smooth(.36, .58, p);
  photoIn.style.opacity = photoOp.toFixed(3);
  heroImg.style.transform = `scale(${(1.04 + .16 * smooth(0, .58, p)).toFixed(4)}) translateY(${(-1.5 * smooth(0, .58, p)).toFixed(2)}%)`;
  const f = 1 + Math.round(p * 149);
  if (f !== lastFrame) { frameEl.textContent = String(f).padStart(3, "0"); lastFrame = f; }
}
function updateJourney() {
  const r = chaptersEl.getBoundingClientRect(), vh = innerHeight, mark = vh * .62;
  chaptersEl.style.setProperty("--f", clamp((mark - r.top) / r.height).toFixed(4));
  $$(".chapter", chaptersEl).forEach(c => c.classList.toggle("on", c.getBoundingClientRect().top + 60 < mark));
}
const navLinks = $$("[data-nav]");
function updateNav() {
  const mid = innerHeight * .42; let cur = null;
  for (const id of ["skills", "work", "journey", "contact"]) {
    const r = document.getElementById(id).getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) cur = id;
  }
  navLinks.forEach(a => a.setAttribute("aria-current", a.dataset.nav === cur ? "true" : "false"));
}

function tick(t) {
  if (lenis) lenis.raf(t);
  const p = heroProgress();
  if (p !== lastP) applyStates(p);
  if (!woke && p > .28) { Scene.wake(t); woke = true; }
  if (heroVisible && photoOp < .999 && (p !== lastP || t - lastDraw > 33)) { Scene.draw(p, t); lastDraw = t; }
  lastP = p;
  updateJourney(); updateNav();
  requestAnimationFrame(tick);
}

/* ───────── boot ───────── */
fillText(); renderSkills(); renderProjects(); renderJourney(); initTheme();
Scene.init($("#scene"));
new IntersectionObserver(es => es.forEach(e => {
  heroVisible = e.isIntersecting;
  document.documentElement.classList.toggle("at-hero", e.isIntersecting && e.intersectionRect.top <= 1);
}), { threshold: [0, .01, .99] }).observe($(".stage"));
addEventListener("scroll", () => {
  const r = hero.getBoundingClientRect();
  document.documentElement.classList.toggle("at-hero", r.bottom > 0 && r.top <= 0);
}, { passive: true });
document.documentElement.classList.add("at-hero");
let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { Scene.resize(); lastP = -1; }, 120); });

if (window.Lenis && !reduce) {
  try {
    lenis = new Lenis({ duration: 1.15, easing: x => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true });
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1), el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, { offset: 0 });
    }));
  } catch (e) { lenis = null; }
}

const fontsReady = document.fonts ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1600))]) : Promise.resolve();
fontsReady.then(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.add("ready");
  });
});
if (document.fonts && document.fonts.load) document.fonts.load(`19px "JetBrains Mono"`).then(() => { lastP = -1; }).catch(() => {});
requestAnimationFrame(tick);
