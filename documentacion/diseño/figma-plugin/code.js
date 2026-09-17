/* ============================================================================
   SIGBI Sistema de Gestion Bibliotecaria Inteligente
   Generador del design system y las pantallas como capas nativas de Figma.

   Basado en Material 3, que es lo que impone Angular Material 22
   (mat.theme()). Cada token de color aqui tiene su equivalente en
   --mat-sys-* del frontend real.
   ========================================================================= */

/* ---------------------------------------------------------------- tokens -- */
var C = {
  p:'#4F46E5', op:'#FFFFFF', pc:'#E0E7FF', opc:'#1E1B4B', ph:'#4338CA',
  sec:'#5B5B7A', secc:'#DDE0F5',
  t:'#C2410C', ot:'#FFFFFF', tc:'#FFE8D4', otc:'#4A1D05',
  err:'#B3261E', errc:'#FEE2E2', oerrc:'#5C0A0A',
  ok:'#047857', okc:'#D1FAE5',
  surf:'#FFFFFF', sc1:'#F6F7FE', sc2:'#EEF1FD', sc3:'#E4E9FB',
  on:'#1B1B34', onv:'#4A4A6A', out:'#7C7CA0', outv:'#C5CBEA',
  white:'#FFFFFF', scrim:'#000000'
};

/* Un tono propio por categoría: da vida a la tabla y distingue sin depender
   solo del color, porque el nombre va siempre escrito al lado. */
var CAT = {
  'Narrativa':   ['#E0E7FF', '#312E81'],
  'Informática': ['#CFFAFE', '#155E75'],
  'Ciencia':     ['#D1FAE5', '#065F46'],
  'Historia':    ['#FEF3C7', '#78350F'],
  'Infantil':    ['#FCE7F3', '#9D174D'],
  'Hemeroteca':  ['#E2E8F0', '#1E293B']
};

var DARK = {
  p:'#A5B4FC', op:'#1E1B4B', pc:'#3730A3', opc:'#E0E7FF', ph:'#C7D2FE',
  sec:'#B4B7D4', secc:'#3A3E5E',
  t:'#FDBA74', ot:'#4A1D05', tc:'#7C2D12', otc:'#FFE8D4',
  err:'#FFB4AB', errc:'#93000A', oerrc:'#FFDAD6',
  ok:'#6EE7B7', okc:'#064E3B',
  surf:'#111225', sc1:'#171930', sc2:'#1E2139', sc3:'#282C48',
  on:'#E6E7F5', onv:'#B9BCD8', out:'#8B8FB4', outv:'#3A3E5E',
  white:'#FFFFFF', scrim:'#000000'
};

/* Escala de espaciado 4/8 y radios M3 */
var SP = [4, 8, 12, 16, 24, 32, 48];
var R  = { xs:4, sm:8, md:12, lg:16, xl:28, full:999 };

var FONT = {};

/* ------------------------------------------------------------- utilidades -- */
function hex(h) {
  h = h.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255
  };
}
function solid(h, a) {
  return { type: 'SOLID', color: hex(h), opacity: a === undefined ? 1 : a };
}
function shadow(y, blur, alpha, spread) {
  return {
    type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: alpha },
    offset: { x: 0, y: y }, radius: blur, spread: spread || 0,
    visible: true, blendMode: 'NORMAL'
  };
}
var E1 = [shadow(1, 3, 0.10), shadow(1, 2, 0.16)];
var E2 = [shadow(2, 6, 0.10), shadow(1, 2, 0.16)];
var E3 = [shadow(8, 24, 0.16), shadow(2, 6, 0.10)];

/* Frame con auto-layout */
function F(name, o) {
  o = o || {};
  var f = figma.createFrame();
  f.name = name;
  f.fills = o.bg ? [solid(o.bg)] : [];
  if (o.dir) {
    f.layoutMode = o.dir;
    f.primaryAxisSizingMode = 'AUTO';
    f.counterAxisSizingMode = 'AUTO';
    f.itemSpacing = o.gap || 0;
    var p = o.pad || 0;
    if (typeof p === 'number') { p = [p, p, p, p]; }
    f.paddingTop = p[0]; f.paddingRight = p[1];
    f.paddingBottom = p[2]; f.paddingLeft = p[3];
    if (o.align) f.counterAxisAlignItems = o.align;
    if (o.justify) f.primaryAxisAlignItems = o.justify;
  }
  if (o.r !== undefined) f.cornerRadius = o.r;
  if (o.stroke) {
    f.strokes = [solid(o.stroke)];
    f.strokeWeight = o.sw || 1;
    f.strokeAlign = 'INSIDE';
  }
  if (o.shadow) f.effects = o.shadow;
  if (o.w && o.h) {
    f.resize(o.w, o.h);
    if (o.dir) { f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED'; }
  } else if (o.w) {
    f.resize(o.w, f.height || 1);
    if (o.dir === 'VERTICAL') f.counterAxisSizingMode = 'FIXED';
    if (o.dir === 'HORIZONTAL') f.primaryAxisSizingMode = 'FIXED';
  } else if (o.h) {
    f.resize(f.width || 1, o.h);
    if (o.dir === 'VERTICAL') f.primaryAxisSizingMode = 'FIXED';
    if (o.dir === 'HORIZONTAL') f.counterAxisSizingMode = 'FIXED';
  }
  if (o.clip !== undefined) f.clipsContent = o.clip;
  return f;
}

/* Texto */
function T(chars, o) {
  o = o || {};
  var t = figma.createText();
  t.fontName = o.font || FONT.uiR;
  t.characters = String(chars);
  t.fontSize = o.size || 14;
  if (o.lh) t.lineHeight = { value: o.lh, unit: 'PIXELS' };
  if (o.ls !== undefined && o.ls !== null) t.letterSpacing = { value: o.ls, unit: 'PIXELS' };
  t.fills = [solid(o.color || C.on)];
  if (o.w) { t.textAutoResize = 'HEIGHT'; t.resize(o.w, t.height); }
  else { t.textAutoResize = 'WIDTH_AND_HEIGHT'; }
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.name) t.name = o.name;
  return t;
}

/* Deja que un hijo ocupe todo el eje principal del padre */
function fill(node) { try { node.layoutSizingHorizontal = 'FILL'; } catch (e) {} return node; }
function grow(node) { try { node.layoutGrow = 1; } catch (e) {} return node; }

/* Hueco rigido: separa sin depender del gap del contenedor */
function spacer(w, h) {
  var s = figma.createFrame();
  s.name = 'spacer';
  s.fills = [];
  s.resize(w || 1, h || 1);
  return s;
}
/* El separador elastico debe adjuntarse ANTES de fijar layoutGrow: Figma
   rechaza layoutGrow en un nodo cuyo padre todavia no existe. */
function push(parent) {
  var s = spacer(1, 1);
  parent.appendChild(s);
  s.layoutGrow = 1;
  return s;
}

/* --------------------------------------------------------------- iconos --- */
/* Trazos estilo Lucide, rejilla 24, stroke 1.75 - un único lenguaje visual */
var ICONS = {
  book: 'M12 7v14 M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  tag: 'M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z M7.5 7.5h.01',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7 M16 19l2 2 4-4',
  sparkles: 'M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  dashboard: 'M3 3h7v9H3z M14 3h7v5h-7z M14 12h7v9h-7z M3 16h7v5H3z',
  search: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16 M21 21l-4.3-4.3',
  plus: 'M5 12h14 M12 5v14',
  pencil: 'M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z M15 5l4 4',
  trash: 'M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M10 11v6 M14 11v6',
  chevronR: 'M9 18l6-6-6-6',
  chevronL: 'M15 18l-6-6 6-6',
  chevronD: 'M6 9l6 6 6-6',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  filter: 'M3 6h18 M7 12h10 M10 18h4',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18 M6 6l12 12',
  send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
  alert: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 8v4 M12 16h.01',
  chart: 'M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3',
  user: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M6.2 19a6 6 0 0 1 11.6 0',
  arrowR: 'M5 12h14 M12 5l7 7-7 7',
  arrowUp: 'M12 19V5 M5 12l7-7 7 7',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 6v6l4 2',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2 M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 10 0v4',
  mail: 'M22 6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'
};

function icon(name, color, size) {
  size = size || 20;
  var d = ICONS[name] || ICONS.book;
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
    '" viewBox="0 0 24 24" fill="none" stroke="' + color +
    '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="' + d + '"/></svg>';
  var node = figma.createNodeFromSvg(svg);
  node.name = 'ic/' + name;
  node.resize(size, size);
  try { node.constrainProportions = true; } catch (e) {}
  return node;
}

/* ==========================================================================
   COMPONENTES  -  anatomia Material 3 tal como la renderiza Angular Material
   ========================================================================== */

/* Botón relleno: alto 40, radio full, label-large 14/500 */
function btnFilled(label, ic, tone) {
  var bg = tone === 'danger' ? C.err : C.p;
  var fg = C.white;
  var b = F('btn/filled/' + label, {
    dir: 'HORIZONTAL', gap: 8, pad: [10, 24, 10, ic ? 16 : 24],
    bg: bg, r: R.full, align: 'CENTER', justify: 'CENTER', h: 40
  });
  if (ic) b.appendChild(icon(ic, fg, 18));
  b.appendChild(T(label, { font: FONT.uiM, size: 14, lh: 20, ls: 0.1, color: fg }));
  return b;
}

/* Botón contorneado */
function btnOutlined(label, ic) {
  var b = F('btn/outlined/' + label, {
    dir: 'HORIZONTAL', gap: 8, pad: [10, 24, 10, ic ? 16 : 24],
    stroke: C.outv, r: R.full, align: 'CENTER', justify: 'CENTER', h: 40
  });
  if (ic) b.appendChild(icon(ic, C.p, 18));
  b.appendChild(T(label, { font: FONT.uiM, size: 14, lh: 20, ls: 0.1, color: C.p }));
  return b;
}


/* Botón de icono - area táctil 40x40, cumple el mínimo de 44 con el gap */
function btnIcon(name, color) {
  var b = F('btn/icon/' + name, {
    dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER',
    w: 40, h: 40, r: R.full
  });
  b.appendChild(icon(name, color || C.onv, 20));
  return b;
}



/* Tarjeta elevada M3 */
function card(o) {
  o = o || {};
  return F(o.name || 'card', {
    dir: o.dir || 'VERTICAL', gap: o.gap === undefined ? 16 : o.gap,
    pad: o.pad === undefined ? 20 : o.pad,
    bg: o.bg || C.white, r: R.md, w: o.w, h: o.h,
    stroke: o.stroke === null ? null : (o.stroke || C.outv),
    shadow: o.shadow, align: o.align, justify: o.justify
  });
}


/* --------------------------------------------------------------- tablas -- */





/* ==========================================================================
   SHELL DE APLICACION  -  sidenav 248 + barra superior, sobre 1440x900
   Replica la anatomia real del layout Angular (mat-sidenav + mat-toolbar).
   ========================================================================== */
var NAV = [
  { label: 'Panel',      ic: 'dashboard' },
  { label: 'Libros',     ic: 'book' },
  { label: 'Categorías', ic: 'tag' },
  { label: 'Clientes',   ic: 'users' },
  { label: 'Reservas',   ic: 'calendar' },
  { label: 'Asistente',  ic: 'sparkles' }
];

function navItem(item, active) {
  var n = F('nav/' + item.label, {
    dir: 'HORIZONTAL', gap: 12, pad: [0, 16, 0, 16], h: 48, w: 224,
    r: R.full, bg: active ? C.pc : null, align: 'CENTER'
  });
  n.appendChild(icon(item.ic, active ? C.opc : C.onv, 20));
  n.appendChild(T(item.label, {
    font: active ? FONT.uiM : FONT.uiR, size: 14, lh: 20, ls: 0.1,
    color: active ? C.opc : C.onv
  }));
  return n;
}

function appShell(pageTitle, activeLabel, o) {
  o = o || {};
  /* El artboard lleva el nombre del componente Angular equivalente */
  var root = F(o.name || 'screen', {
    dir: 'HORIZONTAL', gap: 0, w: 1440, h: 900, bg: C.surf, clip: true
  });

  /* --- Sidenav --- */
  var rail = F('sidenav', { dir: 'VERTICAL', gap: 4, pad: [16, 12, 16, 12], w: 248, h: 900, bg: C.sc2 });

  var brand = F('brand', { dir: 'HORIZONTAL', gap: 10, pad: [8, 12, 20, 12], align: 'CENTER' });
  brand.appendChild(icon('book', C.p, 28));
  var bt = F('brand-text', { dir: 'VERTICAL', gap: 1 });
  bt.appendChild(T('SIGBI', { font: FONT.dispB, size: 21, lh: 26, ls: 0.6, color: C.p }));
  /* Ancho fijo de 166 px para que parta en dos líneas igual que el código: el menú mide
     248, menos 12+12 de relleno, menos el icono de 26 y su separacion de 10 (DV-26). */
  bt.appendChild(T('Sistema de Gestión Bibliotecaria Inteligente', { size: 11, lh: 14, ls: 0.3, color: C.onv, w: 166 }));
  brand.appendChild(bt);
  rail.appendChild(brand);

  for (var i = 0; i < NAV.length; i++) {
    rail.appendChild(navItem(NAV[i], NAV[i].label === activeLabel));
  }

  push(rail);

  var divi = figma.createRectangle();
  divi.resize(224, 1); divi.fills = [solid(C.outv)]; divi.name = 'divider';
  rail.appendChild(divi);

  var userRow = F('user', { dir: 'HORIZONTAL', gap: 12, pad: [12, 8, 12, 8], align: 'CENTER', w: 224 });
  /* La aplicación no muestra un nombre propio: PA-02 dejo la sesión sin implementar,
     asi que el pie del menu rotula el perfil, no a una persona. */
  var av = F('avatar', { dir: 'HORIZONTAL', w: 36, h: 36, r: R.full, bg: C.pc, align: 'CENTER', justify: 'CENTER' });
  av.appendChild(icon('user', C.opc, 20));
  userRow.appendChild(av);
  var ut = F('ut', { dir: 'VERTICAL', gap: 0 });
  ut.appendChild(T('Bibliotecario', { font: FONT.uiM, size: 14, lh: 20, color: C.on }));
  ut.appendChild(T('Personal de biblioteca', { size: 11, lh: 14, color: C.onv }));
  userRow.appendChild(ut);
  grow(ut);
  userRow.appendChild(btnIcon('logout'));
  rail.appendChild(userRow);
  root.appendChild(rail);

  /* --- Columna de contenido --- */
  var col = F('content', { dir: 'VERTICAL', gap: 0, w: 1192, h: 900, bg: C.surf });

  var top = F('topbar', {
    dir: 'HORIZONTAL', gap: 16, pad: [20, 32, 20, 32], w: 1192, h: 80,
    bg: C.surf, align: 'CENTER'
  });
  var tt = F('title-block', { dir: 'VERTICAL', gap: 2 });
  tt.appendChild(T(pageTitle, { font: FONT.dispB, size: 28, lh: 36, color: C.on }));
  if (o.subtitle) tt.appendChild(T(o.subtitle, { size: 13, lh: 18, color: C.onv }));
  top.appendChild(tt);
  push(top);
  if (o.actions) { for (var a = 0; a < o.actions.length; a++) top.appendChild(o.actions[a]); }
  col.appendChild(top);

  var body = F('body', {
    dir: 'VERTICAL', gap: 20, pad: [4, 32, 32, 32], w: 1192, bg: C.surf
  });
  col.appendChild(body);
  fill(body);
  root.appendChild(col);

  /* Los nodos de Figma son proxies y rechazan propiedades ajenas al API,
     asi que el cuerpo se devuelve aparte en vez de colgarlo del nodo. */
  return { root: root, body: body };
}

/* Panel blanco de contenido con cabecera de filtros */
function surfacePanel(w) {
  return F('panel', {
    dir: 'VERTICAL', gap: 0, w: w, bg: C.white, r: R.md,
    stroke: C.outv, clip: true
  });
}


/* ==========================================================================
   PANTALLAS
   ========================================================================== */

/* ---------------------------------------------------------------- login -- */
/* ==========================================================================
   PANTALLAS  -  dibujadas desde la aplicacion en ejecucion, no al reves.
   Cada artboard reproduce lo que sirve Angular en http://localhost:4200, con
   el juego de datos canonico: 24 libros / 18 disponibles / 6 categorias /
   5 clientes / 3 reservas.
   ========================================================================== */

/* Etiqueta de estado y chip de categoría: .sigbi-tag del frontend.
   Alto 26, radio completo, label-large. El texto va siempre dentro, el color
   nunca es la unica senal (PX-03). */
function tag(label, o) {
  o = o || {};
  var bg = C.secc, fg = C.on;
  if (o.tone === 'ok') { bg = C.okc; fg = C.ok; }
  if (o.tone === 'warn') { bg = C.tc; fg = C.otc; }
  if (o.tone === 'err') { bg = C.errc; fg = C.oerrc; }
  if (o.cat && CAT[o.cat]) { bg = CAT[o.cat][0]; fg = CAT[o.cat][1]; }
  var t = F('tag/' + label, {
    dir: 'HORIZONTAL', gap: 4, pad: [0, 12, 0, 12], h: 26,
    bg: bg, r: R.full, align: 'CENTER', justify: 'CENTER'
  });
  t.appendChild(T(label, { font: FONT.uiM, size: 13, lh: 18, color: fg }));
  return t;
}

/* Chip de filtro de Material: contorno, radio 8, alto 32 */
function filterChip(label, selected) {
  var c = F('chip/' + label, {
    dir: 'HORIZONTAL', gap: 6, pad: [0, 14, 0, 14], h: 32,
    bg: selected ? C.secc : null, stroke: selected ? null : C.out,
    r: R.sm, align: 'CENTER', justify: 'CENTER'
  });
  c.appendChild(T(label, { font: FONT.uiR, size: 14, lh: 20, color: C.on }));
  return c;
}

/* Barra de filtros: buscador de 320 y lo que cada pantalla ponga a su derecha */
function filterRow(w, searchText, trailing) {
  var bar = F('filters', {
    dir: 'HORIZONTAL', gap: 12, pad: [16, 24, 16, 24], w: w, align: 'CENTER', bg: C.white
  });
  var search = F('search', {
    dir: 'HORIZONTAL', gap: 10, pad: [0, 16, 0, 16], h: 48, w: 320,
    bg: C.white, stroke: C.outv, r: R.xs, align: 'CENTER'
  });
  search.appendChild(icon('search', C.onv, 20));
  search.appendChild(T(searchText, { size: 14, lh: 20, color: C.onv }));
  bar.appendChild(search);
  if (trailing) for (var i = 0; i < trailing.length; i++) bar.appendChild(trailing[i]);
  var line = figma.createRectangle();
  line.resize(w, 1); line.fills = [solid(C.outv)]; line.name = 'divider';
  var wrap = F('filter-bar', { dir: 'VERTICAL', gap: 0, w: w });
  wrap.appendChild(bar); fill(bar);
  wrap.appendChild(line); fill(line);
  return wrap;
}

/* Selector segmentado de la pantalla de Categorías: Todas / Activas / Inactivas */
function segmented(options, activeIndex) {
  var seg = F('segmented', { dir: 'HORIZONTAL', gap: 0, h: 40, stroke: C.out, r: R.sm });
  for (var i = 0; i < options.length; i++) {
    var op = F('seg/' + options[i], {
      dir: 'HORIZONTAL', pad: [0, 16, 0, 16], h: 40, align: 'CENTER', justify: 'CENTER',
      bg: i === activeIndex ? C.secc : null
    });
    op.appendChild(T(options[i], { font: i === activeIndex ? FONT.uiM : FONT.uiR, size: 14, lh: 20, color: C.on }));
    seg.appendChild(op);
  }
  return seg;
}

/* Paginador de Material tal como sale en la aplicación */
function paginatorReal(w, rango) {
  var p = F('paginator', {
    dir: 'HORIZONTAL', gap: 20, pad: [8, 24, 8, 24], w: w, h: 56,
    bg: C.white, align: 'CENTER'
  });
  push(p);
  p.appendChild(T('Filas por página:', { size: 12, lh: 16, color: C.onv }));
  var sel = F('sel', { dir: 'HORIZONTAL', gap: 8, pad: [0, 8, 0, 12], h: 32, stroke: C.outv, r: R.xs, align: 'CENTER' });
  sel.appendChild(T('10', { size: 14, lh: 20, color: C.on }));
  sel.appendChild(icon('chevronD', C.onv, 18));
  p.appendChild(sel);
  p.appendChild(T(rango, { size: 12, lh: 16, color: C.onv, name: 'range' }));
  p.appendChild(btnIcon('chevronL', C.out));
  p.appendChild(btnIcon('chevronR', C.out));
  return p;
}

/* ---- Acceso -------------------------------------------------------------
   La pantalla implementada es una tarjeta centrada de 360, no el panel de
   marca que se dibujo antes: PA-02 dejo el acceso sin rehacer (AUTH_ENABLED). */
function screenLogin() {
  var root = F('login', {
    dir: 'VERTICAL', gap: 0, w: 1440, h: 900, bg: C.surf,
    align: 'CENTER', justify: 'CENTER', clip: true
  });
  var cardw = 360;
  var c = F('login-card', {
    dir: 'VERTICAL', gap: 0, pad: [24, 24, 20, 24], w: cardw,
    bg: C.sc1, r: R.md, shadow: E1
  });
  c.appendChild(T('SIGBI Sistema de Gestión Bibliotecaria Inteligente', {
    font: FONT.dispB, size: 22, lh: 28, color: C.on, w: cardw - 48
  }));
  c.appendChild(spacer(1, 4));
  c.appendChild(T('Ingrese sus credenciales', { font: FONT.uiM, size: 14, lh: 20, color: C.onv }));
  c.appendChild(spacer(1, 20));

  var f1 = fieldFilled('Correo electrónico', '', cardw - 48, true);
  c.appendChild(f1); fill(f1);
  c.appendChild(spacer(1, 16));
  var f2 = fieldFilled('Contraseña', '', cardw - 48, true);
  c.appendChild(f2); fill(f2);
  c.appendChild(spacer(1, 20));

  var acts = F('actions', { dir: 'HORIZONTAL', gap: 8, w: cardw - 48, justify: 'MAX' });
  acts.appendChild(btnFilled('Entrar', 'logout'));
  c.appendChild(acts); fill(acts);
  root.appendChild(c);
  return root;
}

/* Campo relleno de Material: el que usa el acceso */
function fieldFilled(label, value, w, required) {
  var wrap = F('field/' + label, { dir: 'VERTICAL', gap: 0, w: w });
  var box = F('box', {
    dir: 'VERTICAL', gap: 2, pad: [8, 16, 8, 16], w: w, h: 56,
    bg: C.sc3, r: R.xs, justify: 'CENTER'
  });
  box.appendChild(T(label + (required ? '*' : ''), { size: 12, lh: 16, color: C.onv }));
  box.appendChild(T(value || ' ', { size: 16, lh: 24, color: C.on }));
  wrap.appendChild(box); fill(box);
  var line = figma.createRectangle();
  line.resize(w, 1); line.fills = [solid(C.out)]; line.name = 'underline';
  wrap.appendChild(line); fill(line);
  return wrap;
}

/* ---- Panel --------------------------------------------------------------
   Cuatro indicadores y el reparto de libros por categoria en barras
   horizontales. No hay "reservas por mes": el modelo no tiene esa serie. */
function statCard(rotulo, cifra, detalle, ic, tono) {
  var c = card({ name: 'stat/' + rotulo, w: 264, gap: 0, pad: 20 });
  var ring = F('ring', {
    dir: 'HORIZONTAL', w: 40, h: 40, r: R.sm, bg: tono[0], align: 'CENTER', justify: 'CENTER'
  });
  ring.appendChild(icon(ic, tono[1], 20));
  c.appendChild(ring);
  c.appendChild(spacer(1, 16));
  c.appendChild(T(rotulo, { font: FONT.uiM, size: 14, lh: 20, color: C.on }));
  c.appendChild(spacer(1, 4));
  c.appendChild(T(String(cifra), { font: FONT.dispB, size: 34, lh: 42, color: C.on, name: 'cifra' }));
  c.appendChild(spacer(1, 6));
  c.appendChild(T(detalle, { size: 13, lh: 18, color: C.onv, w: 224 }));
  return c;
}

function screenDashboard() {
  var s = appShell('Panel', 'Panel', {
    name: 'dashboard',
    subtitle: 'Estado del catálogo y de los préstamos',
    actions: [btnAccent('Nueva reserva', 'plus')]
  });
  var W = 1128;

  var stats = F('indicadores', { dir: 'HORIZONTAL', gap: 24, w: W, align: 'MIN' });
  stats.appendChild(statCard('Libros en el catálogo', 24, '5 categorías activas los clasifican', 'book', [C.pc, C.opc]));
  stats.appendChild(statCard('Disponibles ahora', 18, '6 reservados, el 25 % del catálogo', 'check', [C.okc, C.ok]));
  stats.appendChild(statCard('Reservas registradas', 3, '3 en los últimos 7 días', 'calendar', [C.tc, C.otc]));
  /* El tono 'aviso' de la tarjeta es Secondary Container, no ambar (dashboard.component.css) */
  stats.appendChild(statCard('Clientes', 5, '2 con alguna reserva', 'users', [C.secc, C.on]));
  s.body.appendChild(stats);

  var panel = surfacePanel(W);
  var head = F('grafico-cabecera', { dir: 'VERTICAL', gap: 4, pad: [24, 24, 8, 24], w: W });
  head.appendChild(T('Libros por categoría', { font: FONT.dispB, size: 22, lh: 28, color: C.on }));
  head.appendChild(T('24 libros repartidos en 6 categorías', { size: 13, lh: 18, color: C.onv }));
  panel.appendChild(head); fill(head);

  /* La tabla ES el gráfico: cada fila lleva su nombre al lado de la barra, así que
     el lector de pantalla lee el mismo dato que se ve. */
  var filas = [
    ['Ciencia', 4, 'ciencia', false],
    ['Hemeroteca', 4, 'hemeroteca', true],
    ['Historia', 4, 'historia', false],
    ['Infantil', 4, 'infantil', false],
    ['Informática', 4, 'informatica', false],
    ['Narrativa', 4, 'narrativa', false]
  ];
  var CHART = {
    ciencia: '#059669', hemeroteca: '#7C7CA0', historia: '#D97706',
    infantil: '#DB2777', informatica: '#0E7490', narrativa: '#4F46E5'
  };
  var tabla = F('barras', { dir: 'VERTICAL', gap: 0, pad: [8, 24, 24, 24], w: W });
  for (var i = 0; i < filas.length; i++) {
    var f = filas[i];
    var fila = F('fila/' + f[0], { dir: 'HORIZONTAL', gap: 16, h: 40, w: 1080, align: 'CENTER' });
    var nombre = F('nombre', { dir: 'HORIZONTAL', gap: 8, w: 180, align: 'CENTER' });
    nombre.appendChild(T(f[0], { size: 14, lh: 20, color: C.on }));
    if (f[3]) nombre.appendChild(tag('Inactiva', {}));
    fila.appendChild(nombre);
    var pista = F('pista', { dir: 'HORIZONTAL', gap: 0, h: 12, r: R.full, bg: C.sc2 });
    fila.appendChild(pista); grow(pista);
    var barra = F('barra', { h: 12, w: 820, r: R.full, bg: CHART[f[2]] });
    pista.appendChild(barra);
    fila.appendChild(T(String(f[1]), { font: FONT.monoR, size: 12, lh: 16, color: C.onv, w: 24, align: 'RIGHT' }));
    tabla.appendChild(fila);
  }
  panel.appendChild(tabla); fill(tabla);
  s.body.appendChild(panel);
  return s.root;
}

/* Botón de acento: "Nueva reserva" es la única acción terciaria (AN050 sección 2.1) */
function btnAccent(label, ic) {
  var b = F('btn/accent/' + label, {
    dir: 'HORIZONTAL', gap: 8, pad: [10, 24, 10, ic ? 16 : 24],
    bg: C.t, r: R.full, align: 'CENTER', justify: 'CENTER', h: 40
  });
  if (ic) b.appendChild(icon(ic, C.ot, 18));
  b.appendChild(T(label, { font: FONT.uiM, size: 14, lh: 20, ls: 0.1, color: C.ot }));
  return b;
}

/* Cabecera de tabla: fondo Surface Container High, como .sigbi-table del frontend */
function thead(cols, w) {
  var h = F('thead', {
    dir: 'HORIZONTAL', gap: 0, pad: [0, 24, 0, 24], w: w, h: 48,
    bg: C.sc3, align: 'CENTER'
  });
  for (var i = 0; i < cols.length; i++) {
    var cell = F('th', { dir: 'HORIZONTAL', gap: 6, w: cols[i].w, align: 'CENTER' });
    cell.appendChild(T(cols[i].label, { font: FONT.uiM, size: 14, lh: 20, color: C.on }));
    if (cols[i].sorted) cell.appendChild(icon('arrowUp', C.on, 16));
    h.appendChild(cell);
  }
  return h;
}

function trow(cells, w) {
  var r = F('tr', { dir: 'HORIZONTAL', gap: 0, pad: [0, 24, 0, 24], w: w, h: 48, bg: C.white, align: 'CENTER' });
  for (var i = 0; i < cells.length; i++) {
    var c = cells[i];
    var cell = F('td', { dir: 'HORIZONTAL', gap: 8, w: c.w, align: 'CENTER', justify: c.right ? 'MAX' : 'MIN' });
    if (c.node) cell.appendChild(c.node);
    else if (c.actions) {
      for (var k = 0; k < c.actions.length; k++) cell.appendChild(btnIcon(c.actions[k], C.onv));
    } else {
      cell.appendChild(T(c.text, {
        font: c.mono ? FONT.monoR : FONT.uiR, size: c.mono ? 12 : 14, lh: c.mono ? 16 : 20,
        color: C.on, w: c.clip
      }));
    }
    r.appendChild(cell);
  }
  var line = figma.createRectangle();
  line.resize(w, 1); line.fills = [solid(C.outv)]; line.name = 'divider';
  var wrap = F('row', { dir: 'VERTICAL', gap: 0, w: w });
  wrap.appendChild(r); fill(r);
  wrap.appendChild(line); fill(line);
  return wrap;
}

/* ---- Libros -------------------------------------------------------------- */
function screenBook() {
  var s = appShell('Libros', 'Libros', {
    name: 'book',
    subtitle: 'Catálogo completo de la biblioteca',
    actions: [btnFilled('Nuevo libro', 'plus')]
  });
  var W = 1128;
  var panel = surfacePanel(W);
  var cats = ['Narrativa', 'Informática', 'Ciencia', 'Historia', 'Infantil', 'Hemeroteca'];
  var chips = [];
  for (var q = 0; q < cats.length; q++) chips.push(filterChip(cats[q], false));
  var fb = filterRow(W, 'Buscar por título o autor', chips);
  panel.appendChild(fb); fill(fb);

  var cols = [
    { label: 'Título', w: 300, sorted: true },
    { label: 'Autor', w: 240 },
    { label: 'ISBN', w: 160 },
    { label: 'Categoría', w: 140 },
    { label: 'Disponibilidad', w: 140 },
    { label: 'Acciones', w: 100 }
  ];
  var th = thead(cols, W);
  panel.appendChild(th); fill(th);

  var rows = [
    ['Anuario estadístico 2024', 'Instituto Nacional', '9780000002877', 'Hemeroteca', 1],
    ['Boletín bibliográfico n.º 18', 'Varios autores', '9780000003151', 'Hemeroteca', 1],
    ['Breve historia del tiempo', 'Stephen Hawking', '9780000001233', 'Ciencia', 1],
    ['Cien años de soledad', 'Gabriel García Márquez', '9780000000137', 'Narrativa', 0],
    ['Clean Architecture', 'Robert C. Martin', '9780000000822', 'Informática', 1],
    ['Clean Code', 'Robert C. Martin', '9780000000685', 'Informática', 0],
    ['Comentarios reales', 'Inca Garcilaso de la Vega', '9780000002055', 'Historia', 1],
    ['Cosmos', 'Carl Sagan', '9780000001507', 'Ciencia', 0],
    ['Donde viven los monstruos', 'Maurice Sendak', '9780000002603', 'Infantil', 1],
    ['El arte de la guerra', 'Sun Tzu', '9780000001781', 'Historia', 0]
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var row = trow([
      { text: r[0], w: 300, clip: 280 },
      { text: r[1], w: 240, clip: 220 },
      { text: r[2], w: 160, mono: true },
      { node: tag(r[3], { cat: r[3] }), w: 140 },
      { node: tag(r[4] ? 'Disponible' : 'Reservado', { tone: r[4] ? 'ok' : 'warn' }), w: 140 },
      { actions: ['pencil', 'trash'], w: 100 }
    ], W);
    panel.appendChild(row); fill(row);
  }
  var pg = paginatorReal(W, '1 - 10 de 24');
  panel.appendChild(pg); fill(pg);
  s.body.appendChild(panel);
  return s.root;
}

/* ---- Categorías ---------------------------------------------------------- */
function screenCategory() {
  var s = appShell('Categorías', 'Categorías', {
    name: 'category',
    subtitle: 'Clasificación del catálogo',
    actions: [btnFilled('Nueva categoría', 'plus')]
  });
  var W = 1128;
  var panel = surfacePanel(W);
  var fb = filterRow(W, 'Buscar por nombre o descripción', [segmented(['Todas', 'Activas', 'Inactivas'], 0)]);
  panel.appendChild(fb); fill(fb);

  var th = thead([
    { label: 'Nombre', w: 260, sorted: true },
    { label: 'Descripción', w: 420 },
    { label: 'Estado', w: 140 },
    { label: 'Libros', w: 160 },
    { label: 'Acciones', w: 100 }
  ], W);
  panel.appendChild(th); fill(th);

  var rows = [
    ['Ciencia', 'Divulgación científica, física, biología y matemáticas', 1, 4],
    ['Hemeroteca', 'Publicaciones periódicas retiradas de circulación', 0, 4],
    ['Historia', 'Historia universal, América Latina y ensayo histórico', 1, 4],
    ['Infantil', 'Álbum ilustrado y lectura para primeros lectores', 1, 4],
    ['Informática', 'Programación, arquitectura de software y sistemas', 1, 4],
    ['Narrativa', 'Novela, cuento y relato en lengua española y traducida', 1, 4]
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var nombre = F('nombre', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
    var dot = F('dot', { w: 10, h: 10, r: R.full, bg: CAT[r[0]] ? CAT[r[0]][0] : C.secc });
    nombre.appendChild(dot);
    nombre.appendChild(T(r[0], { size: 14, lh: 20, color: C.on }));
    var row = trow([
      { node: nombre, w: 260 },
      { text: r[1], w: 420, clip: 400 },
      { node: tag(r[2] ? 'Activa' : 'Inactiva', r[2] ? { tone: 'ok' } : {}), w: 140 },
      { text: String(r[3]), w: 160, mono: true },
      { actions: ['pencil', 'trash'], w: 100 }
    ], W);
    panel.appendChild(row); fill(row);
  }
  var pg = paginatorReal(W, '1 - 6 de 6');
  panel.appendChild(pg); fill(pg);
  s.body.appendChild(panel);
  return s.root;
}

/* ---- Clientes ------------------------------------------------------------ */
function screenClient() {
  var s = appShell('Clientes', 'Clientes', {
    name: 'client',
    subtitle: 'Personas que pueden reservar libros',
    actions: [btnFilled('Nuevo cliente', 'plus')]
  });
  var W = 1128;
  var panel = surfacePanel(W);
  var fb = filterRow(W, 'Buscar por nombre, documento o correo', null);
  panel.appendChild(fb); fill(fb);

  var th = thead([
    { label: 'Nombres', w: 200 },
    { label: 'Apellidos', w: 260, sorted: true },
    { label: 'Documento', w: 180 },
    { label: 'Correo', w: 340 },
    { label: 'Acciones', w: 100 }
  ], W);
  panel.appendChild(th); fill(th);

  var rows = [
    ['Ana', 'Castillo Vera', '30918273', 'ana.castillo@correo.com'],
    ['María', 'Fernández Ruiz', '10293847', 'maria.fernandez@correo.com'],
    ['Rocío', 'Medina Paz', '50716253', 'rocio.medina@correo.com'],
    ['Luis', 'Ortega Campos', '20938471', 'luis.ortega@correo.com'],
    ['Pedro', 'Salas Núñez', '40817263', 'pedro.salas@correo.com']
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var row = trow([
      { text: r[0], w: 200 },
      { text: r[1], w: 260 },
      { text: r[2], w: 180, mono: true },
      { text: r[3], w: 340 },
      { actions: ['calendar', 'pencil', 'trash'], w: 100 }
    ], W);
    panel.appendChild(row); fill(row);
  }
  var pg = paginatorReal(W, '1 - 5 de 5');
  panel.appendChild(pg); fill(pg);
  s.body.appendChild(panel);
  return s.root;
}

/* ---- Reservas ------------------------------------------------------------
   Sin barra de filtros: la pantalla no filtra, lista de la mas reciente a la
   mas antigua. Borrar es la unica accion (RN-13 no permite editar reservas). */
function screenReservation() {
  var s = appShell('Reservas', 'Reservas', {
    name: 'reservation',
    subtitle: 'Préstamos registrados, del más reciente al más antiguo',
    actions: [btnAccent('Nueva reserva', 'plus')]
  });
  var W = 1128;
  var panel = surfacePanel(W);
  var th = thead([
    { label: 'Fecha', w: 220 },
    { label: 'Cliente', w: 260 },
    { label: 'Libros reservados', w: 500 },
    { label: 'Acciones', w: 100 }
  ], W);
  panel.appendChild(th); fill(th);

  var rows = [
    ['15/09/2026 07:59', 'Luis Ortega Campos', ['El arte de la guerra', 'Matilda']],
    ['15/09/2026 07:59', 'Ana Castillo Vera', ['Clean Code', 'Cosmos', 'El principito']],
    ['15/09/2026 07:59', 'Ana Castillo Vera', ['Cien años de soledad']]
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var libros = F('libros', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
    for (var j = 0; j < r[2].length; j++) libros.appendChild(tag(r[2][j], {}));
    var row = trow([
      { text: r[0], w: 220, mono: true },
      { text: r[1], w: 260 },
      { node: libros, w: 500 },
      { actions: ['trash'], w: 100 }
    ], W);
    panel.appendChild(row); fill(row);
  }
  var pg = paginatorReal(W, '1 - 3 de 3');
  panel.appendChild(pg); fill(pg);
  s.body.appendChild(panel);
  return s.root;
}

/* ---- Nueva reserva, paso 1 ----------------------------------------------- */
function stepDot(n, label, state) {
  var d = F('step/' + n, { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
  var circ = F('c', {
    dir: 'HORIZONTAL', w: 28, h: 28, r: R.full,
    bg: state === 'active' ? C.p : C.on, align: 'CENTER', justify: 'CENTER'
  });
  circ.appendChild(T(String(n), { font: FONT.uiM, size: 13, lh: 18, color: C.white }));
  d.appendChild(circ);
  d.appendChild(T(label, {
    font: state === 'active' ? FONT.uiM : FONT.uiR, size: 14, lh: 20,
    color: state === 'active' ? C.on : C.onv
  }));
  return d;
}

function screenReservationWizard() {
  var s = appShell('Nueva reserva', 'Reservas', {
    name: 'reservation-wizard',
    subtitle: 'Paso 1 de 3 - Cliente',
    actions: [btnOutlined('Salir sin guardar', 'x')]
  });
  var W = 1128;
  var panel = surfacePanel(W);

  var st = stepper(1);
  panel.appendChild(st); fill(st);

  var cuerpo = F('cuerpo', { dir: 'VERTICAL', gap: 16, pad: [0, 32, 32, 32], w: W });
  var srch = F('search', {
    dir: 'HORIZONTAL', gap: 12, pad: [0, 16, 0, 16], h: 48, w: 1064,
    stroke: C.outv, r: R.xs, align: 'CENTER'
  });
  srch.appendChild(icon('search', C.onv, 20));
  srch.appendChild(T('Buscar por nombre o documento', { size: 14, lh: 20, color: C.onv }));
  cuerpo.appendChild(srch); fill(srch);

  var lista = F('clientes', { dir: 'VERTICAL', gap: 0, w: 1064, stroke: C.outv, r: R.xs, clip: true });
  var clientes = [
    ['María Fernández Ruiz', '10293847 - maria.fernandez@correo.com'],
    ['Luis Ortega Campos', '20938471 - luis.ortega@correo.com'],
    ['Ana Castillo Vera', '30918273 - ana.castillo@correo.com'],
    ['Pedro Salas Núñez', '40817263 - pedro.salas@correo.com'],
    ['Rocío Medina Paz', '50716253 - rocio.medina@correo.com']
  ];
  for (var i = 0; i < clientes.length; i++) {
    var it = F('cliente', { dir: 'HORIZONTAL', gap: 16, pad: [14, 20, 14, 20], w: 1064, align: 'CENTER' });
    var tx = F('tx', { dir: 'VERTICAL', gap: 2 });
    tx.appendChild(T(clientes[i][0], { size: 15, lh: 20, color: C.on }));
    tx.appendChild(T(clientes[i][1], { font: FONT.monoR, size: 12, lh: 16, color: C.onv }));
    it.appendChild(tx); grow(tx);
    var radio = F('radio', { w: 20, h: 20, r: R.full, stroke: C.out, sw: 2 });
    it.appendChild(radio);
    lista.appendChild(it); fill(it);
    if (i < clientes.length - 1) {
      var ln = figma.createRectangle();
      ln.resize(1064, 1); ln.fills = [solid(C.outv, 0.6)]; ln.name = 'divider';
      lista.appendChild(ln); fill(ln);
    }
  }
  cuerpo.appendChild(lista); fill(lista);
  panel.appendChild(cuerpo); fill(cuerpo);

  /* Sin cliente elegido no se puede avanzar: el botón nace deshabilitado, y aquí no hay
     "Atras" porque este es el primer paso */
  var pie = F('acciones', { dir: 'HORIZONTAL', gap: 12, pad: [0, 32, 32, 32], w: W, align: 'CENTER' });
  var seguir = F('btn/disabled/Continuar', {
    dir: 'HORIZONTAL', gap: 8, pad: [10, 24, 10, 16], h: 40, r: R.full, bg: C.sc3,
    align: 'CENTER', justify: 'CENTER'
  });
  seguir.appendChild(icon('chevronR', C.out, 18));
  seguir.appendChild(T('Continuar', { font: FONT.uiM, size: 14, lh: 20, color: C.out }));
  pie.appendChild(seguir);
  panel.appendChild(pie);

  s.body.appendChild(panel);
  return s.root;
}

/* Paso hecho: circulo indigo con lapiz, porque la aplicación deja volver a el */
function stepDone(label) {
  var d = F('step/done', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
  var circ = F('c', { dir: 'HORIZONTAL', w: 28, h: 28, r: R.full, bg: C.p, align: 'CENTER', justify: 'CENTER' });
  circ.appendChild(icon('pencil', C.white, 15));
  d.appendChild(circ);
  d.appendChild(T(label, { size: 14, lh: 20, color: C.on }));
  return d;
}

function stepper(paso) {
  var st = F('stepper', { dir: 'HORIZONTAL', gap: 16, pad: [24, 32, 24, 32], w: 1128, align: 'CENTER' });
  var pasos = [[1, 'Cliente'], [2, 'Libros'], [3, 'Confirmación']];
  for (var i = 0; i < pasos.length; i++) {
    var n = pasos[i][0];
    if (n < paso) st.appendChild(stepDone(pasos[i][1]));
    else st.appendChild(stepDot(n, pasos[i][1], n === paso ? 'active' : 'todo'));
    if (i < pasos.length - 1) {
      var ln = figma.createRectangle();
      ln.resize(200, 1); ln.fills = [solid(n < paso ? C.p : C.outv)]; ln.name = 'connector';
      st.appendChild(ln); grow(ln);
    }
  }
  return st;
}

/* Pie del asistente: Atrás siempre, y la acción que corresponda al paso */
function wizardFooter(principal) {
  var pie = F('acciones', { dir: 'HORIZONTAL', gap: 12, pad: [0, 32, 32, 32], w: 1128, align: 'CENTER' });
  pie.appendChild(btnOutlined('Atrás', 'chevronL'));
  push(pie);
  pie.appendChild(principal);
  return pie;
}

/* ---- Nueva reserva, paso 2: selección de libros -------------------------- */
function screenWizardBooks() {
  var s = appShell('Nueva reserva', 'Reservas', {
    name: 'reservation-wizard-books',
    subtitle: 'Paso 2 de 3 - Selección de libros',
    actions: [btnOutlined('Salir sin guardar', 'x')]
  });
  var W = 1128;
  var panel = surfacePanel(W);
  panel.appendChild(stepper(2)); fill(panel.children[0]);

  var cuerpo = F('cuerpo', { dir: 'VERTICAL', gap: 16, pad: [0, 32, 24, 32], w: W });

  /* La selección vive encima del buscador y se quita desde el propio chip */
  var elegidos = F('elegidos', { dir: 'HORIZONTAL', gap: 10, w: 1064 });
  var titulos = ['La casa de los espíritus', 'Estructura de datos'];
  for (var k = 0; k < titulos.length; k++) {
    var ch = F('chip/' + titulos[k], {
      dir: 'HORIZONTAL', gap: 8, pad: [0, 12, 0, 16], h: 32, r: R.sm,
      stroke: C.out, align: 'CENTER', justify: 'CENTER'
    });
    ch.appendChild(T(titulos[k], { size: 14, lh: 20, color: C.on }));
    ch.appendChild(icon('x', C.onv, 16));
    elegidos.appendChild(ch);
  }
  cuerpo.appendChild(elegidos);

  var srch = F('search', {
    dir: 'HORIZONTAL', gap: 12, pad: [0, 16, 0, 16], h: 48, w: 1064,
    stroke: C.outv, r: R.xs, align: 'CENTER'
  });
  srch.appendChild(icon('search', C.onv, 20));
  srch.appendChild(T('Buscar por título o autor', { size: 14, lh: 20, color: C.onv }));
  cuerpo.appendChild(srch); fill(srch);

  var chips = F('chips', { dir: 'HORIZONTAL', gap: 10, w: 1064 });
  var cats = ['Narrativa', 'Informática', 'Ciencia', 'Historia', 'Infantil', 'Hemeroteca'];
  for (var q = 0; q < cats.length; q++) chips.appendChild(filterChip(cats[q], false));
  cuerpo.appendChild(chips);

  /* Solo libros disponibles (RN-06): los reservados no aparecen en la lista */
  var lista = F('disponibles', { dir: 'VERTICAL', gap: 0, w: 1064, stroke: C.outv, r: R.xs, clip: true });
  var libros = [
    ['La casa de los espíritus', 'Isabel Allende', 'Narrativa', '9780000000411', 1],
    ['Estructura de datos', 'Luis Joyanes Aguilar', 'Informática', '9780000000959', 1],
    ['El programador pragmático', 'Andrew Hunt', 'Informática', '9780000001096', 0],
    ['Breve historia del tiempo', 'Stephen Hawking', 'Ciencia', '9780000001233', 0],
    ['El gen egoísta', 'Richard Dawkins', 'Ciencia', '9780000001370', 0],
    ['El universo elegante', 'Brian Greene', 'Ciencia', '9780000001644', 0]
  ];
  for (var i = 0; i < libros.length; i++) {
    var l = libros[i];
    var it = F('libro', { dir: 'HORIZONTAL', gap: 16, pad: [12, 20, 12, 20], w: 1064, align: 'CENTER' });
    var tx = F('tx', { dir: 'VERTICAL', gap: 2 });
    tx.appendChild(T(l[0], { size: 15, lh: 20, color: C.on }));
    var linea = F('linea', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
    linea.appendChild(T(l[1] + ' -', { size: 13, lh: 18, color: C.onv }));
    linea.appendChild(tag(l[2], { cat: l[2] }));
    linea.appendChild(T(l[3], { font: FONT.monoR, size: 12, lh: 16, color: C.onv }));
    tx.appendChild(linea);
    it.appendChild(tx); grow(tx);
    var caja = F('checkbox', {
      dir: 'HORIZONTAL', w: 20, h: 20, r: 3, align: 'CENTER', justify: 'CENTER',
      bg: l[4] ? C.p : null, stroke: l[4] ? null : C.out, sw: 2
    });
    if (l[4]) caja.appendChild(icon('check', C.white, 14));
    it.appendChild(caja);
    lista.appendChild(it); fill(it);
    if (i < libros.length - 1) {
      var ln = figma.createRectangle();
      ln.resize(1064, 1); ln.fills = [solid(C.outv, 0.6)]; ln.name = 'divider';
      lista.appendChild(ln); fill(ln);
    }
  }
  cuerpo.appendChild(lista); fill(lista);
  panel.appendChild(cuerpo); fill(cuerpo);
  panel.appendChild(wizardFooter(btnFilled('Continuar', 'chevronR')));
  s.body.appendChild(panel);
  return s.root;
}

/* ---- Nueva reserva, paso 3: confirmación --------------------------------- */
function resumen(titulo, hijos) {
  var c = F('resumen/' + titulo, {
    dir: 'VERTICAL', gap: 12, pad: [20, 24, 20, 24], w: 1064,
    bg: C.sc1, r: R.md, stroke: C.outv
  });
  c.appendChild(T(titulo, { font: FONT.dispB, size: 20, lh: 26, color: C.on }));
  for (var i = 0; i < hijos.length; i++) c.appendChild(hijos[i]);
  return c;
}

function screenWizardConfirm() {
  var s = appShell('Nueva reserva', 'Reservas', {
    name: 'reservation-wizard-confirm',
    subtitle: 'Paso 3 de 3 - Confirmación',
    actions: [btnOutlined('Salir sin guardar', 'x')]
  });
  var W = 1128;
  var panel = surfacePanel(W);
  panel.appendChild(stepper(3)); fill(panel.children[0]);

  var cuerpo = F('cuerpo', { dir: 'VERTICAL', gap: 16, pad: [0, 32, 24, 32], w: W });

  var datosCliente = F('cliente', { dir: 'VERTICAL', gap: 4 });
  datosCliente.appendChild(T('María Fernández Ruiz', { size: 15, lh: 20, color: C.on }));
  var ced = F('ced', { dir: 'HORIZONTAL', gap: 6, align: 'CENTER' });
  ced.appendChild(T('Documento', { size: 13, lh: 18, color: C.onv }));
  ced.appendChild(T('10293847 - maria.fernandez@correo.com', { font: FONT.monoR, size: 12, lh: 16, color: C.onv }));
  datosCliente.appendChild(ced);
  cuerpo.appendChild(resumen('Cliente', [datosCliente]));

  var filas = [];
  var elegidos = [
    ['La casa de los espíritus', 'Isabel Allende', 'Narrativa'],
    ['Estructura de datos', 'Luis Joyanes Aguilar', 'Informática']
  ];
  for (var i = 0; i < elegidos.length; i++) {
    var f = F('libro', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
    f.appendChild(T(elegidos[i][0], { size: 15, lh: 20, color: C.on }));
    f.appendChild(T(elegidos[i][1], { size: 13, lh: 18, color: C.onv }));
    f.appendChild(tag(elegidos[i][2], { cat: elegidos[i][2] }));
    filas.push(f);
  }
  cuerpo.appendChild(resumen('Libros (2)', filas));

  /* RN-10: la fecha la pone el servidor al guardar y no se puede tocar */
  var fecha = F('fecha', { dir: 'VERTICAL', gap: 4 });
  fecha.appendChild(T('La registra el sistema al guardar', { size: 15, lh: 20, color: C.on }));
  fecha.appendChild(T('La fecha y hora de la reserva son las del momento en que se guarda, y no se pueden modificar.', {
    size: 13, lh: 18, color: C.onv, w: 900
  }));
  cuerpo.appendChild(resumen('Fecha', [fecha]));

  panel.appendChild(cuerpo); fill(cuerpo);
  panel.appendChild(wizardFooter(btnAccent('Confirmar reserva', 'check')));
  s.body.appendChild(panel);
  return s.root;
}

/* ---- Asistente -----------------------------------------------------------
   Estado inicial: cuatro preguntas de ejemplo. La cuarta es de escritura a
   proposito, para que se vea que el agente la rechaza (RF-14, solo lectura). */
function screenAssistant() {
  var s = appShell('Asistente', 'Asistente', {
    name: 'assistant',
    subtitle: 'Consulta el catálogo y las reservas en lenguaje natural'
  });
  var W = 1128;
  var panel = surfacePanel(W);

  var vacio = F('empty', { dir: 'VERTICAL', gap: 12, pad: [64, 32, 64, 32], w: W, align: 'CENTER', justify: 'CENTER' });
  vacio.appendChild(icon('sparkles', C.p, 30));
  vacio.appendChild(spacer(1, 4));
  vacio.appendChild(T('Pregúntame por el catálogo', { font: FONT.dispB, size: 24, lh: 32, color: C.on }));
  vacio.appendChild(T('Puedo consultar los libros, las categorías y las reservas, y responder sobre ellos. No registro ni modifico nada: para eso están las pantallas de gestión.', {
    size: 14, lh: 22, color: C.onv, align: 'CENTER', w: 520
  }));
  vacio.appendChild(spacer(1, 8));
  var fila1 = F('sugerencias', { dir: 'HORIZONTAL', gap: 12, justify: 'CENTER' });
  fila1.appendChild(sugerencia('¿Qué libros de historia hay disponibles?'));
  fila1.appendChild(sugerencia('¿Cuántos libros tiene cada categoría?'));
  vacio.appendChild(fila1);
  var fila2 = F('sugerencias', { dir: 'HORIZONTAL', gap: 12, justify: 'CENTER' });
  fila2.appendChild(sugerencia('¿Qué ha reservado Ana Castillo?'));
  fila2.appendChild(sugerencia('Registra una reserva para María'));
  vacio.appendChild(fila2);
  panel.appendChild(vacio); fill(vacio);

  var composer = F('composer', { dir: 'HORIZONTAL', gap: 12, pad: [16, 24, 16, 24], w: W, align: 'CENTER', bg: C.white });
  var inp = F('input', { dir: 'HORIZONTAL', gap: 10, pad: [0, 16, 0, 16], h: 52, stroke: C.outv, r: R.xs, align: 'CENTER' });
  inp.appendChild(T('Escribe tu pregunta', { size: 14, lh: 20, color: C.onv }));
  composer.appendChild(inp); grow(inp);
  var send = F('btn/enviar', { dir: 'HORIZONTAL', gap: 8, pad: [10, 20, 10, 16], h: 40, r: R.full, stroke: C.outv, align: 'CENTER', justify: 'CENTER' });
  send.appendChild(icon('send', C.out, 18));
  send.appendChild(T('Enviar', { font: FONT.uiM, size: 14, lh: 20, color: C.out }));
  composer.appendChild(send);
  var ln2 = figma.createRectangle();
  ln2.resize(W, 1); ln2.fills = [solid(C.outv)]; ln2.name = 'divider';
  panel.appendChild(ln2); fill(ln2);
  panel.appendChild(composer); fill(composer);
  s.body.appendChild(panel);
  return s.root;
}

function sugerencia(txt) {
  var c = F('sugerencia', {
    dir: 'HORIZONTAL', pad: [0, 20, 0, 20], h: 40, r: R.full, stroke: C.p, align: 'CENTER', justify: 'CENTER'
  });
  c.appendChild(T(txt, { size: 14, lh: 20, color: C.p }));
  return c;
}

/* ---- Diálogo de libro ---------------------------------------------------- */
function screenBookDialog() {
  var root = F('book-dialog', { w: 900, h: 760, bg: C.surf, clip: true });
  var scrim = figma.createRectangle();
  scrim.resize(900, 760);
  scrim.fills = [solid(C.scrim, 0.32)];
  scrim.name = 'scrim';
  root.appendChild(scrim);

  var d = F('dialog', { dir: 'VERTICAL', gap: 20, pad: [28, 28, 24, 28], w: 620, bg: C.white, r: R.lg, shadow: E3 });
  d.appendChild(T('Nuevo libro', { font: FONT.dispB, size: 24, lh: 32, color: C.on }));

  var f1 = fieldOutlined('Título', '', 564, { focus: true, required: true });
  d.appendChild(f1); fill(f1);
  var par = F('par', { dir: 'HORIZONTAL', gap: 16, w: 564 });
  par.appendChild(fieldOutlined('Autor', '', 274, { required: true }));
  par.appendChild(fieldOutlined('ISBN', '', 274, { required: true }));
  d.appendChild(par); fill(par);
  var cat = fieldOutlined('Categoría', '', 274, { required: true, trailing: 'chevronD' });
  d.appendChild(cat);

  var toggle = F('toggle-row', { dir: 'HORIZONTAL', gap: 12, w: 564, align: 'CENTER' });
  var sw = F('switch', { dir: 'HORIZONTAL', w: 52, h: 32, r: R.full, bg: C.p, align: 'CENTER', pad: [0, 4, 0, 4], justify: 'MAX' });
  var knob = F('knob', { dir: 'HORIZONTAL', w: 24, h: 24, r: R.full, bg: C.white, align: 'CENTER', justify: 'CENTER' });
  knob.appendChild(icon('check', C.p, 16));
  sw.appendChild(knob);
  toggle.appendChild(sw);
  toggle.appendChild(T('Disponible', { size: 14, lh: 20, color: C.on }));
  d.appendChild(toggle);
  d.appendChild(T('Un libro deja de estar disponible al reservarse; aquí se corrige a mano si hiciera falta.', {
    size: 13, lh: 18, color: C.onv, w: 564
  }));

  var acts = F('actions', { dir: 'HORIZONTAL', gap: 12, w: 564, justify: 'MAX' });
  acts.appendChild(btnOutlined('Cancelar'));
  var guardar = F('btn/disabled/Guardar', {
    dir: 'HORIZONTAL', gap: 8, pad: [10, 24, 10, 16], h: 40, r: R.full, bg: C.sc3,
    align: 'CENTER', justify: 'CENTER'
  });
  guardar.appendChild(icon('check', C.out, 18));
  guardar.appendChild(T('Guardar', { font: FONT.uiM, size: 14, lh: 20, color: C.out }));
  acts.appendChild(guardar);
  d.appendChild(acts); fill(acts);

  root.appendChild(d);
  d.x = Math.round((900 - d.width) / 2);
  d.y = Math.round((760 - d.height) / 2);
  return root;
}

/* Campo con contorno: el del diálogo */
function fieldOutlined(label, value, w, o) {
  o = o || {};
  var box = F('field/' + label, {
    dir: 'HORIZONTAL', gap: 12, pad: [0, 16, 0, 16], w: w, h: 56,
    stroke: o.focus ? C.p : C.out, sw: o.focus ? 2 : 1, r: R.xs, align: 'CENTER'
  });
  box.appendChild(T(label + (o.required ? '*' : ''), {
    size: value ? 16 : 16, lh: 24, color: value ? C.on : C.onv
  }));
  if (o.trailing) { push(box); box.appendChild(icon(o.trailing, C.onv, 20)); }
  return box;
}

/* ---- Libros en móvil -----------------------------------------------------
   Por debajo de 1024 px el menu lateral se sustituye por una barra inferior de
   cinco destinos y la tabla por tarjetas: seis columnas comprimidas dan
   desbordamiento horizontal, que es lo que RNF-07 prohibe (AN050 seccion 3.5). */
function screenBookMobile() {
  var root = F('book-mobile', { dir: 'VERTICAL', gap: 0, w: 390, h: 844, bg: C.surf, clip: true });

  var top = F('topbar', { dir: 'HORIZONTAL', gap: 12, pad: [44, 16, 12, 16], w: 390, align: 'CENTER', bg: C.surf });
  var tt = F('titles', { dir: 'VERTICAL', gap: 2 });
  tt.appendChild(T('Libros', { font: FONT.dispB, size: 24, lh: 30, color: C.on }));
  tt.appendChild(T('Catálogo completo de la biblioteca', { size: 13, lh: 18, color: C.onv }));
  top.appendChild(tt);
  root.appendChild(top);

  var panel = F('panel', { dir: 'VERTICAL', gap: 0, w: 358, bg: C.white, r: R.md, stroke: C.outv, clip: true });
  var filtros = F('filters', { dir: 'VERTICAL', gap: 12, pad: [16, 16, 16, 16], w: 358 });
  var srch = F('search', { dir: 'HORIZONTAL', gap: 10, pad: [0, 16, 0, 16], h: 48, w: 326, stroke: C.outv, r: R.xs, align: 'CENTER' });
  srch.appendChild(icon('search', C.onv, 20));
  srch.appendChild(T('Buscar por título o autor', { size: 14, lh: 20, color: C.onv }));
  filtros.appendChild(srch); fill(srch);
  var chips = F('chips', { dir: 'HORIZONTAL', gap: 8, w: 326 });
  chips.appendChild(filterChip('Narrativa', false));
  chips.appendChild(filterChip('Informática', false));
  chips.appendChild(filterChip('Ciencia', false));
  filtros.appendChild(chips);
  panel.appendChild(filtros); fill(filtros);

  var lista = F('tarjetas', { dir: 'VERTICAL', gap: 12, pad: [0, 16, 16, 16], w: 358 });
  var libros = [
    ['Anuario estadístico 2024', 'Instituto Nacional', 'Hemeroteca', '9780000002877', 1],
    ['Breve historia del tiempo', 'Stephen Hawking', 'Ciencia', '9780000001233', 1],
    ['Cien años de soledad', 'Gabriel García Márquez', 'Narrativa', '9780000000137', 0]
  ];
  for (var i = 0; i < libros.length; i++) {
    var l = libros[i];
    var c = F('tarjeta', { dir: 'VERTICAL', gap: 8, pad: [16, 16, 16, 16], w: 326, bg: C.white, r: R.md, stroke: C.outv });
    c.appendChild(T(l[0], { font: FONT.uiM, size: 16, lh: 22, color: C.on, w: 294 }));
    c.appendChild(T(l[1], { size: 14, lh: 20, color: C.onv }));
    var etiquetas = F('etiquetas', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
    etiquetas.appendChild(tag(l[2], { cat: l[2] }));
    etiquetas.appendChild(tag(l[4] ? 'Disponible' : 'Reservado', { tone: l[4] ? 'ok' : 'warn' }));
    c.appendChild(etiquetas);
    c.appendChild(T(l[3], { font: FONT.monoR, size: 12, lh: 16, color: C.onv }));
    var sep = figma.createRectangle();
    sep.resize(294, 1); sep.fills = [solid(C.outv)]; sep.name = 'divider';
    c.appendChild(sep); fill(sep);
    /* Objetivo táctil de 44 px: en móvil los botones de icono crecen */
    var acciones = F('acciones', { dir: 'HORIZONTAL', gap: 8, w: 294, justify: 'MAX' });
    var ed = F('btn/icon/pencil', { dir: 'HORIZONTAL', w: 44, h: 44, r: R.full, align: 'CENTER', justify: 'CENTER' });
    ed.appendChild(icon('pencil', C.onv, 20));
    var bo = F('btn/icon/trash', { dir: 'HORIZONTAL', w: 44, h: 44, r: R.full, align: 'CENTER', justify: 'CENTER' });
    bo.appendChild(icon('trash', C.onv, 20));
    acciones.appendChild(ed); acciones.appendChild(bo);
    c.appendChild(acciones); fill(acciones);
    lista.appendChild(c);
  }
  panel.appendChild(lista); fill(lista);

  var cuerpo = F('cuerpo', { dir: 'VERTICAL', gap: 0, pad: [0, 16, 0, 16], w: 390 });
  cuerpo.appendChild(panel);
  root.appendChild(cuerpo); fill(cuerpo);
  push(root);

  /* Botón flotante: la acción principal de la cabecera baja aquí en móvil */
  var fab = F('fab', { dir: 'HORIZONTAL', w: 56, h: 56, r: R.lg, bg: C.p, align: 'CENTER', justify: 'CENTER', shadow: E2 });
  fab.appendChild(icon('plus', C.white, 24));

  var bottom = F('bottom-nav', { dir: 'HORIZONTAL', gap: 0, w: 390, bg: C.sc2 });
  var borde = figma.createRectangle();
  borde.resize(390, 1); borde.fills = [solid(C.outv)]; borde.name = 'divider';
  var destinos = [
    ['Panel', 'dashboard', false],
    ['Libros', 'book', true],
    ['Clientes', 'users', false],
    ['Reservas', 'calendar', false],
    ['Asistente', 'sparkles', false]
  ];
  for (var d = 0; d < destinos.length; d++) {
    var act = destinos[d][2];
    var tab = F('destino/' + destinos[d][0], {
      dir: 'VERTICAL', gap: 2, pad: [8, 4, 8, 4], w: 78, h: 60,
      align: 'CENTER', justify: 'CENTER', bg: act ? C.pc : null
    });
    tab.appendChild(icon(destinos[d][1], act ? C.opc : C.onv, 22));
    tab.appendChild(T(destinos[d][0], {
      font: act ? FONT.uiM : FONT.uiR, size: 11, lh: 14, color: act ? C.opc : C.onv
    }));
    bottom.appendChild(tab);
  }
  var barra = F('barra-inferior', { dir: 'VERTICAL', gap: 0, w: 390 });
  barra.appendChild(borde); fill(borde);
  barra.appendChild(bottom); fill(bottom);
  root.appendChild(barra);

  /* El flotante va por encima de la barra, no dentro del flujo */
  root.appendChild(fab);
  fab.layoutPositioning = 'ABSOLUTE';
  fab.x = 390 - 56 - 16;
  fab.y = 844 - 60 - 1 - 56 - 16;
  return root;
}

function sectionTitle(txt, sub) {
  var s = F('section', { dir: 'VERTICAL', gap: 4 });
  s.appendChild(T(txt, { font: FONT.dispB, size: 26, lh: 34, color: C.on }));
  if (sub) s.appendChild(T(sub, { size: 13, lh: 18, color: C.onv }));
  return s;
}

function swatch(name, val, token, dark) {
  var w = F('swatch/' + name, { dir: 'VERTICAL', gap: 8, w: 168 });
  var box = F('c', { w: 168, h: 72, r: R.sm, bg: val, stroke: C.outv });
  w.appendChild(box);
  var tx = F('t', { dir: 'VERTICAL', gap: 1 });
  tx.appendChild(T(name, { font: FONT.uiM, size: 12, lh: 16, color: C.on }));
  tx.appendChild(T(val.toUpperCase(), { font: FONT.monoR, size: 11, lh: 14, color: C.onv }));
  tx.appendChild(T(token, { font: FONT.monoR, size: 10, lh: 13, color: C.out }));
  w.appendChild(tx);
  return w;
}

function pageFoundations() {
  var root = F('SIGBI Foundations', {
    dir: 'VERTICAL', gap: 40, pad: [56, 56, 56, 56], w: 1240, bg: C.surf
  });

  var hd = F('hd', { dir: 'VERTICAL', gap: 8 });
  hd.appendChild(T('SIGBI Sistema de diseño', { font: FONT.dispB, size: 40, lh: 50, color: C.on }));
  hd.appendChild(T('Material 3 sobre Angular Material 22. Cada token corresponde a su equivalente en mat.theme() y en las variables --mat-sys-*.', {
    size: 15, lh: 24, color: C.onv, w: 760
  }));
  root.appendChild(hd);

  /* --- Color --- */
  root.appendChild(sectionTitle('Color', 'Esquema claro. El tema oscuro intercambia los roles, nunca los colores.'));
  var g1 = F('roles', { dir: 'HORIZONTAL', gap: 16 });
  g1.appendChild(swatch('Primary', C.p, '--mat-sys-primary'));
  g1.appendChild(swatch('On Primary', C.op, '--mat-sys-on-primary'));
  g1.appendChild(swatch('Primary Container', C.pc, '--mat-sys-primary-container'));
  g1.appendChild(swatch('On Primary Container', C.opc, '--mat-sys-on-primary-container'));
  g1.appendChild(swatch('Tertiary', C.t, '--mat-sys-tertiary'));
  g1.appendChild(swatch('Tertiary Container', C.tc, '--mat-sys-tertiary-container'));
  root.appendChild(g1);

  var g2 = F('surfaces', { dir: 'HORIZONTAL', gap: 16 });
  g2.appendChild(swatch('Surface', C.surf, '--mat-sys-surface'));
  g2.appendChild(swatch('Surface Container', C.sc2, '--mat-sys-surface-container'));
  g2.appendChild(swatch('On Surface', C.on, '--mat-sys-on-surface'));
  g2.appendChild(swatch('On Surface Variant', C.onv, '--mat-sys-on-surface-variant'));
  g2.appendChild(swatch('Outline', C.out, '--mat-sys-outline'));
  g2.appendChild(swatch('Outline Variant', C.outv, '--mat-sys-outline-variant'));
  root.appendChild(g2);

  var g3 = F('semantic', { dir: 'HORIZONTAL', gap: 16 });
  g3.appendChild(swatch('Error', C.err, '--mat-sys-error'));
  g3.appendChild(swatch('Error Container', C.errc, '--mat-sys-error-container'));
  g3.appendChild(swatch('Success', C.ok, 'personalizado'));
  g3.appendChild(swatch('Success Container', C.okc, 'personalizado'));
  root.appendChild(g3);

  var note = F('note', { dir: 'HORIZONTAL', gap: 10, pad: 16, bg: C.pc, r: R.sm, w: 1128, align: 'CENTER' });
  note.appendChild(icon('check', C.opc, 18));
  note.appendChild(T('Contraste verificado: blanco sobre Primary 6,3:1 - On Surface sobre Surface 16,8:1 - On Surface Variant sobre Surface 8,5:1 - blanco sobre Tertiary 5,2:1. Todos por encima de AA (4,5:1).', {
    size: 13, lh: 20, color: C.opc, w: 1040
  }));
  root.appendChild(note);

  /* --- Tema oscuro --- */
  root.appendChild(sectionTitle('Tema oscuro', 'Tonos desaturados sobre superficies oscuras, no una inversión.'));
  var dk = F('dark', { dir: 'HORIZONTAL', gap: 16, pad: 20, bg: DARK.surf, r: R.md });
  var dkNames = [['Primary', DARK.p], ['Primary Container', DARK.pc], ['Surface', DARK.surf], ['Surface Container', DARK.sc2], ['On Surface', DARK.on], ['Outline', DARK.out]];
  for (var i = 0; i < dkNames.length; i++) {
    var w = F('sw', { dir: 'VERTICAL', gap: 8, w: 160 });
    w.appendChild(F('c', { w: 160, h: 64, r: R.sm, bg: dkNames[i][1], stroke: DARK.outv }));
    w.appendChild(T(dkNames[i][0], { font: FONT.uiM, size: 12, lh: 16, color: DARK.on }));
    w.appendChild(T(dkNames[i][1].toUpperCase(), { font: FONT.monoR, size: 11, lh: 14, color: DARK.onv }));
    dk.appendChild(w);
  }
  root.appendChild(dk);

  /* --- Tipografía --- */
  root.appendChild(sectionTitle('Tipografía', 'Lora para los títulos: voz editorial, propia de una biblioteca. IBM Plex Sans para la interfaz, legible a 12 px y con cifras tabulares para las tablas.'));
  var typ = F('type', { dir: 'VERTICAL', gap: 20, pad: 24, bg: C.white, r: R.md, stroke: C.outv, w: 1128 });
  var roles = [
    ['Display small', 'Sistema de Gestión Bibliotecaria', 'dispB', 36, 44, 'mat-display-small'],
    ['Headline medium', 'Catálogo de libros', 'dispB', 28, 36, 'mat-headline-medium'],
    ['Title large', 'Reservas del mes', 'uiM', 22, 28, 'mat-title-large'],
    ['Body large', 'Registra una reserva seleccionando un cliente y uno o más libros disponibles.', 'uiR', 16, 24, 'mat-body-large'],
    ['Body medium', 'Texto de tabla y contenido secundario de la interfaz.', 'uiR', 14, 20, 'mat-body-medium'],
    ['Label large', 'GUARDAR', 'uiM', 14, 20, 'mat-label-large'],
    ['Label medium', 'ISBN 9780132350884', 'monoR', 12, 16, 'mat-label-medium - cifras tabulares']
  ];
  for (var r2 = 0; r2 < roles.length; r2++) {
    var ro = roles[r2];
    var line = F('l', { dir: 'HORIZONTAL', gap: 24, w: 1080, align: 'CENTER' });
    var meta = F('m', { dir: 'VERTICAL', gap: 1, w: 200 });
    meta.appendChild(T(ro[0], { font: FONT.uiM, size: 12, lh: 16, color: C.on }));
    meta.appendChild(T(ro[3] + '/' + ro[4], { font: FONT.monoR, size: 11, lh: 14, color: C.onv }));
    meta.appendChild(T(ro[5], { font: FONT.monoR, size: 10, lh: 13, color: C.out }));
    line.appendChild(meta);
    line.appendChild(T(ro[1], { font: FONT[ro[2]], size: ro[3], lh: ro[4], color: C.on }));
    typ.appendChild(line);
  }
  root.appendChild(typ);

  /* --- Espaciado y radios --- */
  root.appendChild(sectionTitle('Espaciado y radios', 'Ritmo 4/8. Radios de Material 3.'));
  var sr = F('sr', { dir: 'HORIZONTAL', gap: 40 });
  var sp = F('sp', { dir: 'HORIZONTAL', gap: 16, align: 'MAX' });
  for (var k = 0; k < SP.length; k++) {
    var col = F('c', { dir: 'VERTICAL', gap: 6, align: 'CENTER' });
    col.appendChild(F('b', { w: SP[k], h: SP[k], r: 2, bg: C.p }));
    col.appendChild(T(String(SP[k]), { font: FONT.monoR, size: 11, lh: 14, color: C.onv }));
    sp.appendChild(col);
  }
  sr.appendChild(sp);
  var rad = F('rad', { dir: 'HORIZONTAL', gap: 16 });
  var radList = [['xs', R.xs], ['sm', R.sm], ['md', R.md], ['lg', R.lg], ['xl', R.xl]];
  for (var q = 0; q < radList.length; q++) {
    var rc = F('c', { dir: 'VERTICAL', gap: 6, align: 'CENTER' });
    rc.appendChild(F('b', { w: 56, h: 56, r: radList[q][1], bg: C.pc, stroke: C.outv }));
    rc.appendChild(T(radList[q][0] + ' - ' + radList[q][1], { font: FONT.monoR, size: 11, lh: 14, color: C.onv }));
    rad.appendChild(rc);
  }
  sr.appendChild(rad);
  root.appendChild(sr);

  /* --- Iconografía --- */
  root.appendChild(sectionTitle('Iconografía', 'Un único trazo de 1,75 sobre rejilla de 24. Nunca emoji.'));
  var ig = F('icons', { dir: 'HORIZONTAL', gap: 12 });
  var iconNames = ['book', 'users', 'tag', 'calendar', 'sparkles', 'dashboard', 'search', 'plus', 'pencil', 'trash', 'filter', 'check', 'logout', 'send'];
  for (var n = 0; n < iconNames.length; n++) {
    var ib = F('ib', { dir: 'VERTICAL', gap: 6, align: 'CENTER', w: 72 });
    var bx = F('bx', { w: 56, h: 56, r: R.sm, bg: C.white, stroke: C.outv, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER' });
    bx.appendChild(icon(iconNames[n], C.on, 24));
    ib.appendChild(bx);
    ib.appendChild(T(iconNames[n], { font: FONT.monoR, size: 10, lh: 13, color: C.onv }));
    ig.appendChild(ib);
  }
  root.appendChild(ig);
  return root;
}

function pageComponents() {
  var root = F('SIGBI Components', {
    dir: 'VERTICAL', gap: 32, pad: [56, 56, 56, 56], w: 1240, bg: C.surf
  });
  root.appendChild(T('Componentes', { font: FONT.dispB, size: 40, lh: 50, color: C.on }));
  root.appendChild(T('Las piezas tal como las sirve Angular Material 22 en la aplicación. Si algo de aquí no coincide con la pantalla, manda la pantalla.', {
    size: 15, lh: 24, color: C.onv, w: 760
  }));

  root.appendChild(sectionTitle('Botones', 'Alto 40, radio completo. Una sola acción principal por pantalla; el naranja queda para "Nueva reserva", que es la única acción de acento.'));
  var b = F('b', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
  b.appendChild(btnFilled('Nuevo libro', 'plus'));
  b.appendChild(btnAccent('Nueva reserva', 'plus'));
  b.appendChild(btnOutlined('Salir sin guardar', 'x'));
  b.appendChild(btnOutlined('Cancelar'));
  var desactivado = F('btn/disabled/Guardar', {
    dir: 'HORIZONTAL', gap: 8, pad: [10, 24, 10, 16], h: 40, r: R.full, bg: C.sc3,
    align: 'CENTER', justify: 'CENTER'
  });
  desactivado.appendChild(icon('check', C.out, 18));
  desactivado.appendChild(T('Guardar', { font: FONT.uiM, size: 14, lh: 20, color: C.out }));
  b.appendChild(desactivado);
  b.appendChild(btnIcon('pencil'));
  b.appendChild(btnIcon('trash'));
  b.appendChild(btnIcon('calendar'));
  root.appendChild(b);

  root.appendChild(sectionTitle('Campos', 'Con contorno en los diálogos, rellenos en el acceso. La etiqueta siempre visible y el asterisco marca lo obligatorio.'));
  var f = F('f', { dir: 'HORIZONTAL', gap: 20, align: 'MIN' });
  f.appendChild(fieldOutlined('Título', '', 260, { required: true }));
  f.appendChild(fieldOutlined('Título', 'Clean Architecture', 260, { focus: true, required: true }));
  f.appendChild(fieldOutlined('Categoría', '', 260, { required: true, trailing: 'chevronD' }));
  f.appendChild(fieldFilled('Correo electrónico', '', 260, true));
  root.appendChild(f);

  root.appendChild(sectionTitle('Etiquetas', 'Alto 26 y radio completo. El color nunca es la única señal: el texto va siempre dentro.'));
  var ch = F('ch', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
  ch.appendChild(tag('Disponible', { tone: 'ok' }));
  ch.appendChild(tag('Reservado', { tone: 'warn' }));
  ch.appendChild(tag('Activa', { tone: 'ok' }));
  ch.appendChild(tag('Inactiva', {}));
  root.appendChild(ch);
  var cats = F('cats', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
  var nombres = ['Narrativa', 'Informática', 'Ciencia', 'Historia', 'Infantil', 'Hemeroteca'];
  for (var n = 0; n < nombres.length; n++) cats.appendChild(tag(nombres[n], { cat: nombres[n] }));
  root.appendChild(cats);

  root.appendChild(sectionTitle('Filtros', 'Chips de categoría en Libros; selector segmentado en Categorías. El buscador mide 320.'));
  var fl = F('fl', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
  fl.appendChild(filterChip('Narrativa', false));
  fl.appendChild(filterChip('Informática', true));
  fl.appendChild(segmented(['Todas', 'Activas', 'Inactivas'], 0));
  root.appendChild(fl);

  root.appendChild(sectionTitle('Tabla y paginador', 'Cabecera sobre Surface Container High, filas de 48 px -densidad -1- y separador de Outline Variant.'));
  var tp = surfacePanel(1128);
  var th = thead([
    { label: 'Título', w: 420, sorted: true },
    { label: 'Autor', w: 300 },
    { label: 'ISBN', w: 200 },
    { label: 'Disponibilidad', w: 160 }
  ], 1128);
  tp.appendChild(th); fill(th);
  var demo = [
    ['Cien años de soledad', 'Gabriel García Márquez', '9780000000137', 0],
    ['Clean Code', 'Robert C. Martin', '9780000000685', 1]
  ];
  for (var d = 0; d < demo.length; d++) {
    var tr = trow([
      { text: demo[d][0], w: 420 },
      { text: demo[d][1], w: 300 },
      { text: demo[d][2], w: 200, mono: true },
      { node: tag(demo[d][3] ? 'Disponible' : 'Reservado', { tone: demo[d][3] ? 'ok' : 'warn' }), w: 160 }
    ], 1128);
    tp.appendChild(tr); fill(tr);
  }
  var pg = paginatorReal(1128, '1 - 10 de 24');
  tp.appendChild(pg); fill(pg);
  root.appendChild(tp);

  root.appendChild(sectionTitle('Los cinco estados de una pantalla de datos', 'Cargando, vacío, error, sin resultados y con datos. Los tres primeros conservan la altura de la tabla para que nada salte.'));
  var fb = F('fb', { dir: 'HORIZONTAL', gap: 24, align: 'MIN' });

  var cargando = card({ name: 'estado/cargando', w: 552, gap: 12, pad: 32, align: 'CENTER', justify: 'CENTER' });
  var aro = F('spinner', { w: 40, h: 40, r: R.full, stroke: C.p, sw: 4 });
  cargando.appendChild(aro);
  cargando.appendChild(T('Calculando los indicadores...', { size: 14, lh: 20, color: C.onv, align: 'CENTER' }));
  fb.appendChild(cargando);

  var vacio = card({ name: 'estado/vacio', w: 552, gap: 12, pad: 32, align: 'CENTER', justify: 'CENTER' });
  vacio.appendChild(icon('inbox', C.out, 48));
  vacio.appendChild(T('Aún no hay categorías', { font: FONT.uiM, size: 22, lh: 28, color: C.on, align: 'CENTER' }));
  vacio.appendChild(T('Crea la primera categoría y clasifica algún libro para que aparezca el reparto.', {
    size: 14, lh: 20, color: C.onv, align: 'CENTER', w: 280
  }));
  vacio.appendChild(btnOutlined('Ir a Categorías', 'tag'));
  fb.appendChild(vacio);

  root.appendChild(fb);

  /* El banner de error no vive en una tarjeta: ocupa el ancho del panel, encima de la
     tabla, y lleva el reintento a la derecha. */
  var banner = F('error-banner', {
    dir: 'HORIZONTAL', gap: 12, pad: [12, 16, 12, 16], bg: C.errc, r: R.sm, w: 1128, align: 'CENTER'
  });
  banner.appendChild(icon('alert', C.oerrc, 20));
  banner.appendChild(T('No se pudieron cargar los datos del panel. Revisa la conexión con el servidor.', {
    size: 14, lh: 20, color: C.oerrc
  }));
  push(banner);
  banner.appendChild(btnOutlined('Reintentar'));
  root.appendChild(banner);

  return root;
}

/* ==========================================================================
   ESTILOS Y VARIABLES  -  para que el kit sea usable, no solo mirable
   ========================================================================== */
function createStyles() {
  var pairs = [
    ['SIGBI/Primary', C.p], ['SIGBI/Primary Container', C.pc],
    ['SIGBI/On Primary Container', C.opc], ['SIGBI/Tertiary', C.t],
    ['SIGBI/Tertiary Container', C.tc], ['SIGBI/Error', C.err],
    ['SIGBI/Error Container', C.errc], ['SIGBI/Success', C.ok],
    ['SIGBI/Surface', C.surf], ['SIGBI/Surface Container', C.sc2],
    ['SIGBI/On Surface', C.on], ['SIGBI/On Surface Variant', C.onv],
    ['SIGBI/Outline', C.out], ['SIGBI/Outline Variant', C.outv]
  ];
  for (var i = 0; i < pairs.length; i++) {
    try {
      var st = figma.createPaintStyle();
      st.name = pairs[i][0];
      st.paints = [solid(pairs[i][1])];
    } catch (e) {}
  }

  var texts = [
    ['SIGBI/Display small', FONT.dispB, 36, 44],
    ['SIGBI/Headline medium', FONT.dispB, 28, 36],
    ['SIGBI/Title large', FONT.uiM, 22, 28],
    ['SIGBI/Body large', FONT.uiR, 16, 24],
    ['SIGBI/Body medium', FONT.uiR, 14, 20],
    ['SIGBI/Label large', FONT.uiM, 14, 20],
    ['SIGBI/Label medium', FONT.monoR, 12, 16]
  ];
  for (var j = 0; j < texts.length; j++) {
    try {
      var ts = figma.createTextStyle();
      ts.name = texts[j][0];
      ts.fontName = texts[j][1];
      ts.fontSize = texts[j][2];
      ts.lineHeight = { value: texts[j][3], unit: 'PIXELS' };
    } catch (e) {}
  }
}

function createVariables() {
  try {
    var col = figma.variables.createVariableCollection('SIGBI');
    var lightId = col.modes[0].modeId;
    col.renameMode(lightId, 'Light');
    var darkId = col.addMode('Dark');
    var names = ['p', 'op', 'pc', 'opc', 'sec', 't', 'tc', 'otc', 'err', 'errc',
      'ok', 'okc', 'surf', 'sc1', 'sc2', 'sc3', 'on', 'onv', 'out', 'outv'];
    var labels = {
      p: 'primary', op: 'on-primary', pc: 'primary-container', opc: 'on-primary-container',
      sec: 'secondary', t: 'tertiary', tc: 'tertiary-container', otc: 'on-tertiary-container',
      err: 'error', errc: 'error-container', ok: 'success', okc: 'success-container',
      surf: 'surface', sc1: 'surface-container-low', sc2: 'surface-container',
      sc3: 'surface-container-high', on: 'on-surface', onv: 'on-surface-variant',
      out: 'outline', outv: 'outline-variant'
    };
    for (var i = 0; i < names.length; i++) {
      var k = names[i];
      var v;
      try { v = figma.variables.createVariable('color/' + labels[k], col, 'COLOR'); }
      catch (e) { v = figma.variables.createVariable('color/' + labels[k], col.id, 'COLOR'); }
      v.setValueForMode(lightId, hex(C[k]));
      v.setValueForMode(darkId, hex(DARK[k] || C[k]));
    }
    return true;
  } catch (e) { return false; }
}

/* ==========================================================================
   ARRANQUE
   ========================================================================== */
async function tryFont(family, styles) {
  for (var i = 0; i < styles.length; i++) {
    try {
      await figma.loadFontAsync({ family: family, style: styles[i] });
      return { family: family, style: styles[i] };
    } catch (e) {}
  }
  return null;
}

async function loadFonts() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  var iR = { family: 'Inter', style: 'Regular' };
  var iM = { family: 'Inter', style: 'Medium' };
  var iB = { family: 'Inter', style: 'Semi Bold' };
  var missing = [];

  FONT.uiR = await tryFont('IBM Plex Sans', ['Regular']);
  FONT.uiM = await tryFont('IBM Plex Sans', ['Medium']);
  FONT.uiB = await tryFont('IBM Plex Sans', ['SemiBold', 'Semi Bold']);
  FONT.dispM = await tryFont('Lora', ['Medium']);
  FONT.dispB = await tryFont('Lora', ['SemiBold', 'Semi Bold', 'Bold']);
  FONT.monoR = await tryFont('IBM Plex Mono', ['Regular']);

  if (!FONT.uiR) { FONT.uiR = iR; missing.push('IBM Plex Sans'); }
  if (!FONT.uiM) FONT.uiM = iM;
  if (!FONT.uiB) FONT.uiB = iB;
  if (!FONT.dispM) { FONT.dispM = iM; missing.push('Lora'); }
  if (!FONT.dispB) FONT.dispB = iB;
  if (!FONT.monoR) { FONT.monoR = iR; missing.push('IBM Plex Mono'); }
  return missing;
}

function place(page, node, x, y) {
  page.appendChild(node);
  node.x = x;
  node.y = y;
}

async function main() {
  var missing = await loadFonts();

  /* El nombre del archivo lo pone el plugin, no la persona que lo ejecuta: así no depende
     de como se llamara el archivo en blanco donde se corre. Sin separador, igual que en la
     aplicacion (pestana del navegador y pantalla de acceso). */
  figma.root.name = 'SIGBI Sistema de Gestión Bibliotecaria Inteligente';

  createStyles();
  var varsOk = createVariables();

  /* 1 - Fundamentos */
  var p1 = figma.createPage();
  p1.name = 'SIGBI Foundations';
  place(p1, pageFoundations(), 0, 0);

  /* 2 - Componentes */
  var p2 = figma.createPage();
  p2.name = 'SIGBI Components';
  place(p2, pageComponents(), 0, 0);

  /* 3 - Pantallas de escritorio */
  var p3 = figma.createPage();
  p3.name = 'SIGBI Screens';
  var COLW = 1440 + 120;
  place(p3, screenLogin(), 0, 0);
  place(p3, screenDashboard(), COLW, 0);
  place(p3, screenBook(), COLW * 2, 0);
  place(p3, screenClient(), 0, 1020);
  place(p3, screenCategory(), COLW, 1020);
  place(p3, screenReservationWizard(), COLW * 2, 1020);
  place(p3, screenReservation(), 0, 2040);
  place(p3, screenAssistant(), COLW, 2040);
  place(p3, screenBookDialog(), COLW * 2, 2040);
  place(p3, screenWizardBooks(), 0, 3060);
  place(p3, screenWizardConfirm(), COLW, 3060);

  /* 4 - Responsive */
  var p4 = figma.createPage();
  p4.name = 'SIGBI Responsive';
  place(p4, screenBookMobile(), 0, 0);

  try { await figma.setCurrentPageAsync(p1); }
  catch (e) { figma.currentPage = p1; }
  try { figma.viewport.scrollAndZoomIntoView(p1.children); } catch (e) {}

  var msg = 'SIGBI ready: 4 pages, 12 screens, styles' + (varsOk ? ' and light/dark variables' : '') + '.';
  if (missing.length) msg += ' Fonts unavailable, replaced with Inter: ' + missing.join(', ') + '.';
  figma.notify(msg, { timeout: 8000 });
  figma.closePlugin(msg);
}

main();
