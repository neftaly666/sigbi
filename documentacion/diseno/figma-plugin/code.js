/* ============================================================================
   SIGBI - Sistema de Gestion Bibliotecaria Inteligente
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
  err:'#DC2626', errc:'#FEE2E2', oerrc:'#5C0A0A',
  ok:'#047857', okc:'#D1FAE5',
  surf:'#FFFFFF', sc1:'#F6F7FE', sc2:'#EEF1FD', sc3:'#E4E9FB',
  on:'#1B1B34', onv:'#4A4A6A', out:'#7C7CA0', outv:'#C5CBEA',
  white:'#FFFFFF', scrim:'#000000'
};

/* Un tono propio por categoria: da vida a la tabla y distingue sin depender
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
  err:'#FCA5A5', errc:'#7F1D1D', oerrc:'#FEE2E2',
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
function fillV(node) { try { node.layoutSizingVertical = 'FILL'; } catch (e) {} return node; }
function grow(node) { try { node.layoutGrow = 1; } catch (e) {} return node; }

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
/* Trazos estilo Lucide, rejilla 24, stroke 1.75 - un unico lenguaje visual */
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

/* Boton relleno: alto 40, radio full, label-large 14/500 */
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

/* Boton contorneado */
function btnOutlined(label, ic) {
  var b = F('btn/outlined/' + label, {
    dir: 'HORIZONTAL', gap: 8, pad: [10, 24, 10, ic ? 16 : 24],
    stroke: C.outv, r: R.full, align: 'CENTER', justify: 'CENTER', h: 40
  });
  if (ic) b.appendChild(icon(ic, C.p, 18));
  b.appendChild(T(label, { font: FONT.uiM, size: 14, lh: 20, ls: 0.1, color: C.p }));
  return b;
}

/* Boton de texto */
function btnText(label) {
  var b = F('btn/text/' + label, {
    dir: 'HORIZONTAL', gap: 8, pad: [10, 12, 10, 12],
    r: R.full, align: 'CENTER', justify: 'CENTER', h: 40
  });
  b.appendChild(T(label, { font: FONT.uiM, size: 14, lh: 20, ls: 0.1, color: C.p }));
  return b;
}

/* Boton de icono - area tactil 40x40, cumple el minimo de 44 con el gap */
function btnIcon(name, color) {
  var b = F('btn/icon/' + name, {
    dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER',
    w: 40, h: 40, r: R.full
  });
  b.appendChild(icon(name, color || C.onv, 20));
  return b;
}

/* Campo de texto M3: etiqueta visible sobre la caja (nunca placeholder solo),
   caja de 56 y texto de apoyo debajo. Reglas input-labels y error-placement. */
function field(label, value, o) {
  o = o || {};
  var w = o.w || 280;
  var borderColor = o.error ? C.err : (o.focus ? C.p : C.out);
  var wrap = F('field/' + label, { dir: 'VERTICAL', gap: 6, w: w });

  var lab = F('label', { dir: 'HORIZONTAL', gap: 2 });
  lab.appendChild(T(label, {
    font: FONT.uiM, size: 12, lh: 16, ls: 0.4,
    color: o.error ? C.err : (o.focus ? C.p : C.onv)
  }));
  if (o.required) lab.appendChild(T('*', { font: FONT.uiM, size: 12, lh: 16, color: C.err }));
  wrap.appendChild(lab);

  var box = F('box', {
    dir: 'HORIZONTAL', gap: 12, pad: [16, 16, 16, 16], w: w, h: 56,
    bg: o.disabled ? C.sc2 : C.white,
    stroke: borderColor, sw: o.focus ? 2 : 1, r: R.xs, align: 'CENTER'
  });
  if (o.icon) box.appendChild(icon(o.icon, C.onv, 20));
  var val = T(value || o.placeholder || '', {
    size: 16, lh: 24, color: value ? C.on : C.out,
    font: o.mono ? FONT.monoR : FONT.uiR
  });
  box.appendChild(val);
  grow(val);
  if (o.trailing) box.appendChild(icon(o.trailing, C.onv, 20));
  wrap.appendChild(box);
  fill(box);

  if (o.helper || o.error) {
    var h = F('supporting', { dir: 'HORIZONTAL', gap: 4, align: 'CENTER' });
    if (o.error) h.appendChild(icon('alert', C.err, 14));
    h.appendChild(T(o.error || o.helper, {
      size: 12, lh: 16, ls: 0.4, color: o.error ? C.err : C.onv
    }));
    wrap.appendChild(h);
  }
  return wrap;
}

/* Chip - assist / filter / input */
function chip(label, o) {
  o = o || {};
  var bg = o.selected ? C.pc : null;
  var fg = o.selected ? C.opc : C.onv;
  if (o.tone === 'ok') { bg = C.okc; fg = C.ok; }
  if (o.tone === 'warn') { bg = C.tc; fg = C.otc; }
  if (o.tone === 'err') { bg = C.errc; fg = C.oerrc; }
  if (o.cat && CAT[o.cat]) { bg = CAT[o.cat][0]; fg = CAT[o.cat][1]; }
  var c = F('chip/' + label, {
    dir: 'HORIZONTAL', gap: 6, pad: [6, 12, 6, o.icon ? 8 : 12],
    bg: bg, r: R.sm, h: 32, align: 'CENTER', justify: 'CENTER',
    stroke: bg ? null : C.outv
  });
  if (o.icon) c.appendChild(icon(o.icon, fg, 16));
  c.appendChild(T(label, { font: FONT.uiM, size: 12, lh: 16, ls: 0.5, color: fg }));
  if (o.close) c.appendChild(icon('x', fg, 16));
  return c;
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

/* Avatar circular con iniciales */
function avatar(initials, size, bg, fg) {
  size = size || 40;
  var a = F('avatar', {
    dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER',
    w: size, h: size, r: R.full, bg: bg || C.pc
  });
  a.appendChild(T(initials, {
    font: FONT.uiM, size: size <= 32 ? 12 : 14, lh: size <= 32 ? 16 : 20,
    color: fg || C.opc
  }));
  return a;
}

/* --------------------------------------------------------------- tablas -- */
/* mat-table con densidad -1: filas de 48px en vez de 56 */
function tableHeader(cols, w) {
  var h = F('thead', {
    dir: 'HORIZONTAL', gap: 0, pad: [0, 16, 0, 16], w: w, h: 48,
    bg: C.sc1, align: 'CENTER'
  });
  for (var i = 0; i < cols.length; i++) {
    var cell = F('th', { dir: 'HORIZONTAL', gap: 4, w: cols[i].w, align: 'CENTER' });
    cell.appendChild(T(cols[i].label, {
      font: FONT.uiM, size: 12, lh: 16, ls: 0.5, color: C.onv
    }));
    if (cols[i].sorted) cell.appendChild(icon('chevronD', C.p, 14));
    h.appendChild(cell);
  }
  return h;
}

function tableRow(cells, w, o) {
  o = o || {};
  var r = F('tr', {
    dir: 'HORIZONTAL', gap: 0, pad: [0, 16, 0, 16], w: w, h: 48,
    bg: o.bg || C.white, align: 'CENTER'
  });
  for (var i = 0; i < cells.length; i++) {
    var c = cells[i];
    var cell = F('td', { dir: 'HORIZONTAL', gap: 8, w: c.w, align: 'CENTER' });
    if (c.node) {
      cell.appendChild(c.node);
    } else if (c.actions) {
      for (var k = 0; k < c.actions.length; k++) {
        cell.appendChild(btnIcon(c.actions[k], c.actions[k] === 'trash' ? C.err : C.onv));
      }
    } else {
      cell.appendChild(T(c.text, {
        font: c.strong ? FONT.uiM : (c.mono ? FONT.monoR : FONT.uiR),
        size: 14, lh: 20, ls: 0.25,
        color: c.muted ? C.onv : C.on
      }));
    }
    r.appendChild(cell);
  }
  /* Divisor inferior - visible en claro y oscuro (regla border-visibility) */
  var line = figma.createRectangle();
  line.resize(w, 1);
  line.fills = [solid(C.outv, 0.6)];
  line.name = 'divider';
  var wrap = F('row', { dir: 'VERTICAL', gap: 0, w: w });
  wrap.appendChild(r); fill(r);
  wrap.appendChild(line); fill(line);
  return wrap;
}

/* Paginador */
function paginator(w, info) {
  var p = F('paginator', {
    dir: 'HORIZONTAL', gap: 16, pad: [8, 16, 8, 16], w: w, h: 52,
    bg: C.white, align: 'CENTER'
  });
  push(p);
  p.appendChild(T('Filas por página:', { size: 12, lh: 16, color: C.onv }));
  var sel = F('sel', { dir: 'HORIZONTAL', gap: 4, align: 'CENTER' });
  sel.appendChild(T('10', { size: 12, lh: 16, color: C.on }));
  sel.appendChild(icon('chevronD', C.onv, 16));
  p.appendChild(sel);
  p.appendChild(T(info, { size: 12, lh: 16, color: C.onv, name: 'range' }));
  p.appendChild(btnIcon('chevronL'));
  p.appendChild(btnIcon('chevronR'));
  return p;
}

/* Estado vacio - mensaje util + accion (regla empty-states) */
function emptyState(title, body, cta, ic) {
  var e = F('empty-state', {
    dir: 'VERTICAL', gap: 12, pad: [48, 32, 48, 32],
    align: 'CENTER', justify: 'CENTER'
  });
  var ring = F('ring', {
    dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER',
    w: 64, h: 64, r: R.full, bg: C.sc2
  });
  ring.appendChild(icon(ic || 'inbox', C.out, 28));
  e.appendChild(ring);
  e.appendChild(T(title, { font: FONT.dispM, size: 20, lh: 28, color: C.on }));
  e.appendChild(T(body, { size: 14, lh: 20, color: C.onv, align: 'CENTER', w: 320 }));
  if (cta) e.appendChild(btnFilled(cta, 'plus'));
  return e;
}

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
  brand.appendChild(icon('book', C.p, 26));
  var bt = F('brand-text', { dir: 'VERTICAL', gap: 1 });
  bt.appendChild(T('SIGBI', { font: FONT.dispB, size: 21, lh: 26, ls: 0.6, color: C.p }));
  bt.appendChild(T('Gestión bibliotecaria', { size: 11, lh: 14, ls: 0.3, color: C.onv }));
  brand.appendChild(bt);
  rail.appendChild(brand);

  for (var i = 0; i < NAV.length; i++) {
    rail.appendChild(navItem(NAV[i], NAV[i].label === activeLabel));
  }

  push(rail);

  var divi = figma.createRectangle();
  divi.resize(224, 1); divi.fills = [solid(C.outv)]; divi.name = 'divider';
  rail.appendChild(divi);

  var userRow = F('user', { dir: 'HORIZONTAL', gap: 10, pad: [12, 8, 4, 8], align: 'CENTER', w: 224 });
  userRow.appendChild(avatar('DW', 36));
  var ut = F('ut', { dir: 'VERTICAL', gap: 0 });
  ut.appendChild(T('Dante W.', { font: FONT.uiM, size: 13, lh: 18, color: C.on }));
  ut.appendChild(T('Bibliotecario', { size: 11, lh: 14, color: C.onv }));
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

function filterBar(w, chips, searchText) {
  var bar = F('filters', {
    dir: 'HORIZONTAL', gap: 12, pad: [16, 16, 16, 16], w: w, align: 'CENTER', bg: C.white
  });
  var search = F('search', {
    dir: 'HORIZONTAL', gap: 10, pad: [0, 16, 0, 16], h: 44, w: 320,
    bg: C.sc1, r: R.full, align: 'CENTER'
  });
  search.appendChild(icon('search', C.onv, 18));
  search.appendChild(T(searchText || 'Buscar…', { size: 14, lh: 20, color: C.out }));
  bar.appendChild(search);
  for (var i = 0; i < chips.length; i++) bar.appendChild(chip(chips[i].l, chips[i]));
  push(bar);
  bar.appendChild(btnIcon('filter'));
  return bar;
}

/* ==========================================================================
   PANTALLAS
   ========================================================================== */

/* ---------------------------------------------------------------- login -- */
function screenLogin() {
  var root = F('login', { dir: 'HORIZONTAL', gap: 0, w: 1440, h: 900, clip: true });

  var left = F('brand-panel', {
    dir: 'VERTICAL', gap: 20, pad: [72, 72, 72, 72], w: 620, h: 900,
    bg: C.p, justify: 'CENTER'
  });
  var mark = F('mark', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
  mark.appendChild(icon('book', C.pc, 34));
  mark.appendChild(T('SIGBI', { font: FONT.dispB, size: 34, lh: 42, ls: 1, color: C.white }));
  left.appendChild(mark);
  left.appendChild(T('Sistema de Gestión\nBibliotecaria Inteligente', {
    font: FONT.dispB, size: 44, lh: 54, color: C.white, w: 460
  }));
  left.appendChild(T('Catálogo, socios y reservas en un solo lugar, con un asistente que responde sobre el fondo bibliográfico.', {
    size: 16, lh: 26, color: C.pc, w: 440
  }));
  root.appendChild(left);

  var right = F('form-panel', {
    dir: 'VERTICAL', gap: 0, w: 820, h: 900, bg: C.surf,
    align: 'CENTER', justify: 'CENTER'
  });
  var form = F('login-card', { dir: 'VERTICAL', gap: 20, w: 400 });
  form.appendChild(T('Iniciar sesión', { font: FONT.dispB, size: 28, lh: 36, color: C.on }));
  form.appendChild(T('Accede con tu cuenta institucional.', { size: 14, lh: 20, color: C.onv }));
  var e = field('Correo electrónico', 'dawi666@gmail.com', { w: 400, icon: 'mail', required: true });
  form.appendChild(e); fill(e);
  var pw = field('Contraseña', '••••••••••', { w: 400, icon: 'lock', trailing: 'user', required: true, helper: 'Mínimo 8 caracteres.' });
  form.appendChild(pw); fill(pw);
  var submit = btnFilled('Entrar');
  form.appendChild(submit); fill(submit);
  form.appendChild(T('¿Olvidaste tu contraseña?', { font: FONT.uiM, size: 13, lh: 18, color: C.p }));
  right.appendChild(form);
  root.appendChild(right);
  return root;
}

/* ------------------------------------------------------------ dashboard -- */
function statCard(label, value, delta, ic, tone) {
  var c = card({ name: 'stat/' + label, w: 270, gap: 12, pad: 20 });
  var head = F('h', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER', w: 230 });
  var pair = tone || ['#E0E7FF', '#312E81'];
  var ring = F('ring', { dir: 'HORIZONTAL', w: 36, h: 36, r: R.sm, bg: pair[0], align: 'CENTER', justify: 'CENTER' });
  ring.appendChild(icon(ic, pair[1], 18));
  head.appendChild(ring);
  head.appendChild(T(label, { size: 13, lh: 18, color: C.onv }));
  c.appendChild(head);
  c.appendChild(T(value, { font: FONT.dispB, size: 32, lh: 40, color: C.on, name: 'value' }));
  var d = F('delta', { dir: 'HORIZONTAL', gap: 4, align: 'CENTER' });
  d.appendChild(icon('arrowR', C.ok, 14));
  d.appendChild(T(delta, { size: 12, lh: 16, color: C.ok }));
  c.appendChild(d);
  return c;
}

function screenDashboard() {
  var s = appShell('Panel', 'Panel', {
    name: 'dashboard',
    subtitle: 'Resumen de actividad de la biblioteca',
    actions: [btnFilled('Nueva reserva', 'plus')]
  });
  var body = s.body;

  var stats = F('stats', { dir: 'HORIZONTAL', gap: 16, w: 1128 });
  stats.appendChild(statCard('Libros en catálogo', '1.284', '+32 este mes', 'book', ['#E0E7FF', '#312E81']));
  stats.appendChild(statCard('Clientes activos', '396', '+18 este mes', 'users', ['#CFFAFE', '#155E75']));
  stats.appendChild(statCard('Reservas del mes', '154', '+9 % vs. agosto', 'calendar', ['#D1FAE5', '#065F46']));
  stats.appendChild(statCard('Categorías', '12', '2 nuevas', 'tag', ['#FEF3C7', '#78350F']));
  body.appendChild(stats);

  var row = F('row', { dir: 'HORIZONTAL', gap: 16, w: 1128 });

  /* Grafico de barras - reservas por mes */
  var chart = card({ name: 'chart', w: 700, gap: 16, pad: 20 });
  chart.appendChild(T('Reservas por mes', { font: FONT.dispB, size: 18, lh: 24, color: C.on }));
  var bars = F('bars', { dir: 'HORIZONTAL', gap: 18, h: 200, w: 660, align: 'MAX' });
  var data = [72, 88, 64, 110, 96, 130, 118, 154];
  var months = ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'];
  for (var i = 0; i < data.length; i++) {
    var colw = F('col', { dir: 'VERTICAL', gap: 8, align: 'CENTER', justify: 'MAX', h: 200 });
    var bh = Math.round((data[i] / 160) * 150);
    var bar = F('bar', { w: 46, h: bh, r: R.sm, bg: i === data.length - 1 ? C.p : '#A5B4FC' });
    colw.appendChild(T(String(data[i]), { size: 11, lh: 14, color: C.onv }));
    colw.appendChild(bar);
    colw.appendChild(T(months[i], { size: 11, lh: 14, color: C.onv }));
    bars.appendChild(colw);
  }
  chart.appendChild(bars);
  row.appendChild(chart);

  /* Reservas recientes */
  var recent = card({ name: 'recent', w: 412, gap: 12, pad: 20 });
  recent.appendChild(T('Reservas recientes', { font: FONT.dispB, size: 18, lh: 24, color: C.on }));
  var rec = [
    ['María Fernández', '3 libros', 'Hoy 10:24'],
    ['Luis Ortega', '1 libro', 'Hoy 09:05'],
    ['Ana Castillo', '2 libros', 'Ayer 17:40'],
    ['Pedro Salas', '1 libro', 'Ayer 15:12'],
    ['Rocío Medina', '4 libros', 'Ayer 11:58']
  ];
  for (var j = 0; j < rec.length; j++) {
    var it = F('item', { dir: 'HORIZONTAL', gap: 12, pad: [8, 0, 8, 0], w: 372, align: 'CENTER' });
    it.appendChild(avatar(rec[j][0].split(' ').map(function (x) { return x[0]; }).join(''), 32));
    var tx = F('tx', { dir: 'VERTICAL', gap: 1 });
    tx.appendChild(T(rec[j][0], { font: FONT.uiM, size: 13, lh: 18, color: C.on }));
    tx.appendChild(T(rec[j][1], { size: 11, lh: 14, color: C.onv }));
    it.appendChild(tx); grow(tx);
    it.appendChild(T(rec[j][2], { size: 11, lh: 14, color: C.onv }));
    recent.appendChild(it);
  }
  row.appendChild(recent);
  body.appendChild(row);
  return s.root;
}

/* ---------------------------------------------------------------- libros -- */
function screenBook() {
  var s = appShell('Libros', 'Libros', {
    name: 'book',
    subtitle: '1.284 títulos en catálogo',
    actions: [btnOutlined('Exportar'), btnFilled('Nuevo libro', 'plus')]
  });
  var W = 1128, IW = 1096;
  var panel = surfacePanel(W);
  panel.appendChild(filterBar(W, [
    { l: 'Disponibles', selected: true },
    { l: 'Reservados' },
    { l: 'Todas las categorías', icon: 'tag' }
  ], 'Buscar por título, autor o ISBN…'));

  var cols = [
    { label: 'TÍTULO', w: 340, sorted: true },
    { label: 'AUTOR', w: 220 },
    { label: 'ISBN', w: 160 },
    { label: 'CATEGORÍA', w: 160 },
    { label: 'ESTADO', w: 120 },
    { label: 'ACCIONES', w: 96 }
  ];
  var head = tableHeader(cols, W);
  panel.appendChild(head); fill(head);

  var rows = [
    ['Cien años de soledad', 'Gabriel García Márquez', '9780307474728', 'Narrativa', 1],
    ['El nombre de la rosa', 'Umberto Eco', '9788497592802', 'Narrativa', 0],
    ['Estructura de datos', 'Luis Joyanes Aguilar', '9788448198817', 'Informática', 1],
    ['Breve historia del tiempo', 'Stephen Hawking', '9780553380163', 'Ciencia', 1],
    ['Rayuela', 'Julio Cortázar', '9788437604572', 'Narrativa', 0],
    ['El arte de la guerra', 'Sun Tzu', '9788441420182', 'Historia', 1],
    ['Clean Code', 'Robert C. Martin', '9780132350884', 'Informática', 1],
    ['La casa de los espíritus', 'Isabel Allende', '9788401242137', 'Narrativa', 1]
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var st = r[4]
      ? chip('Disponible', { tone: 'ok', icon: 'check' })
      : chip('Reservado', { tone: 'warn', icon: 'clock' });
    var row = tableRow([
      { text: r[0], w: 340, strong: true },
      { text: r[1], w: 220, muted: true },
      { text: r[2], w: 160, mono: true },
      { node: chip(r[3], { cat: r[3] }), w: 160 },
      { node: st, w: 120 },
      { actions: ['pencil', 'trash'], w: 96 }
    ], W);
    panel.appendChild(row); fill(row);
  }
  var pg = paginator(W, '1 – 8 de 1.284');
  panel.appendChild(pg); fill(pg);
  s.body.appendChild(panel);
  return s.root;
}

/* --------------------------------------------------- dialogo nuevo libro -- */
function screenBookDialog() {
  /* Sin auto-layout: el scrim va detras, el dialogo centrado encima */
  var root = F('book-dialog', { w: 900, h: 760, bg: '#0B1413', clip: true });
  var scrim = figma.createRectangle();
  scrim.resize(900, 760);
  scrim.fills = [solid(C.scrim, 0.45)];
  scrim.name = 'scrim';
  root.appendChild(scrim);

  var d = F('dialog', {
    dir: 'VERTICAL', gap: 20, pad: [24, 24, 20, 24], w: 560,
    bg: C.white, r: R.xl, shadow: E3
  });
  var head = F('head', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER', w: 512 });
  head.appendChild(T('Nuevo libro', { font: FONT.dispB, size: 22, lh: 28, color: C.on }));
  push(head);
  head.appendChild(btnIcon('x'));
  d.appendChild(head);

  var f1 = field('Título', 'Clean Architecture', { w: 512, required: true });
  d.appendChild(f1); fill(f1);
  var f2 = field('Autor', 'Robert C. Martin', { w: 512, required: true });
  d.appendChild(f2); fill(f2);

  var pair = F('pair', { dir: 'HORIZONTAL', gap: 16, w: 512 });
  pair.appendChild(field('ISBN', '9780134494166', { w: 248, mono: true, required: true, helper: '13 dígitos, sin guiones.' }));
  pair.appendChild(field('Categoría', 'Informática', { w: 248, trailing: 'chevronD', required: true }));
  d.appendChild(pair);

  var f3 = field('Ejemplares', '2', { w: 512, error: 'Ya existe un libro con ese ISBN.' });
  d.appendChild(f3); fill(f3);

  var toggle = F('toggle-row', { dir: 'HORIZONTAL', gap: 12, w: 512, align: 'CENTER' });
  var sw = F('switch', { dir: 'HORIZONTAL', w: 52, h: 32, r: R.full, bg: C.p, align: 'CENTER', pad: [0, 4, 0, 4], justify: 'MAX' });
  var knob = F('knob', { w: 24, h: 24, r: R.full, bg: C.white });
  sw.appendChild(knob);
  toggle.appendChild(sw);
  toggle.appendChild(T('Disponible para reserva', { size: 14, lh: 20, color: C.on }));
  d.appendChild(toggle);

  var acts = F('actions', { dir: 'HORIZONTAL', gap: 8, w: 512, justify: 'MAX' });
  acts.appendChild(btnText('Cancelar'));
  acts.appendChild(btnFilled('Guardar'));
  d.appendChild(acts);

  root.appendChild(d);
  d.x = Math.round((900 - d.width) / 2);
  d.y = Math.round((760 - d.height) / 2);
  return root;
}

/* -------------------------------------------------------------- clientes -- */
function screenClient() {
  var s = appShell('Clientes', 'Clientes', {
    name: 'client',
    subtitle: '396 socios registrados',
    actions: [btnFilled('Nuevo cliente', 'plus')]
  });
  var W = 1128;
  var panel = surfacePanel(W);
  panel.appendChild(filterBar(W, [{ l: 'Con reservas activas' }], 'Buscar por nombre, cédula o correo…'));

  var head = tableHeader([
    { label: 'CLIENTE', w: 320, sorted: true },
    { label: 'CÉDULA', w: 160 },
    { label: 'CORREO', w: 320 },
    { label: 'RESERVAS ACTIVAS', w: 160 },
    { label: 'ACCIONES', w: 136 }
  ], W);
  panel.appendChild(head); fill(head);

  var rows = [
    ['María Fernández Ruiz', '10293847', 'maria.fernandez@correo.com', 3],
    ['Luis Ortega Campos', '20938471', 'luis.ortega@correo.com', 1],
    ['Ana Castillo Vera', '30918273', 'ana.castillo@correo.com', 2],
    ['Pedro Salas Núñez', '40817263', 'pedro.salas@correo.com', 0],
    ['Rocío Medina Paz', '50716253', 'rocio.medina@correo.com', 4],
    ['Jorge Ramos Díaz', '60615243', 'jorge.ramos@correo.com', 0],
    ['Elena Vargas Soto', '70514233', 'elena.vargas@correo.com', 1]
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var who = F('who', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
    who.appendChild(avatar(r[0].split(' ').slice(0, 2).map(function (x) { return x[0]; }).join(''), 32));
    who.appendChild(T(r[0], { font: FONT.uiM, size: 14, lh: 20, color: C.on }));
    var row = tableRow([
      { node: who, w: 320 },
      { text: r[1], w: 160, mono: true },
      { text: r[2], w: 320, muted: true },
      (r[3] > 0
        ? { node: chip(String(r[3]), { tone: 'ok' }), w: 160 }
        : { text: '—', w: 160, muted: true }),
      { actions: ['pencil', 'trash'], w: 136 }
    ], W);
    panel.appendChild(row); fill(row);
  }
  var pg = paginator(W, '1 – 7 de 396');
  panel.appendChild(pg); fill(pg);
  s.body.appendChild(panel);
  return s.root;
}

/* ------------------------------------------------------------ categorias -- */
function screenCategory() {
  var s = appShell('Categorías', 'Categorías', {
    name: 'category',
    subtitle: 'Clasificación del catálogo',
    actions: [btnFilled('Nueva categoría', 'plus')]
  });
  var W = 1128;
  var panel = surfacePanel(W);
  panel.appendChild(filterBar(W, [{ l: 'Activas', selected: true }, { l: 'Inactivas' }], 'Buscar categoría…'));

  var head = tableHeader([
    { label: 'NOMBRE', w: 260, sorted: true },
    { label: 'DESCRIPCIÓN', w: 480 },
    { label: 'LIBROS', w: 140 },
    { label: 'ESTADO', w: 120 },
    { label: 'ACCIONES', w: 96 }
  ], W);
  panel.appendChild(head); fill(head);

  var rows = [
    ['Narrativa', 'Novela, cuento y relato en lengua española y traducida', 486, 1],
    ['Informática', 'Programación, arquitectura de software y sistemas', 214, 1],
    ['Ciencia', 'Divulgación científica, física, biología y matemáticas', 168, 1],
    ['Historia', 'Historia universal, América Latina y ensayo histórico', 152, 1],
    ['Infantil', 'Álbum ilustrado y lectura para primeros lectores', 143, 1],
    ['Hemeroteca', 'Publicaciones periódicas retiradas de circulación', 121, 0]
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var tag = F('t', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
    tag.appendChild(icon('tag', C.p, 16));
    tag.appendChild(T(r[0], { font: FONT.uiM, size: 14, lh: 20, color: C.on }));
    var row = tableRow([
      { node: tag, w: 260 },
      { text: r[1], w: 480, muted: true },
      { text: String(r[2]), w: 140 },
      { node: r[3] ? chip('Activa', { tone: 'ok' }) : chip('Inactiva', {}), w: 120 },
      { actions: ['pencil', 'trash'], w: 96 }
    ], W);
    panel.appendChild(row); fill(row);
  }
  s.body.appendChild(panel);
  return s.root;
}

/* -------------------------------------------------------- nueva reserva -- */
function stepDot(n, label, state) {
  var d = F('step/' + n, { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
  var bg = state === 'done' ? C.p : (state === 'active' ? C.p : C.sc3);
  var circ = F('c', { dir: 'HORIZONTAL', w: 28, h: 28, r: R.full, bg: bg, align: 'CENTER', justify: 'CENTER' });
  if (state === 'done') circ.appendChild(icon('check', C.white, 16));
  else circ.appendChild(T(String(n), { font: FONT.uiM, size: 13, lh: 18, color: state === 'active' ? C.white : C.onv }));
  d.appendChild(circ);
  d.appendChild(T(label, {
    font: state === 'todo' ? FONT.uiR : FONT.uiM, size: 14, lh: 20,
    color: state === 'todo' ? C.onv : C.on
  }));
  return d;
}

function screenReservationWizard() {
  var s = appShell('Nueva reserva', 'Reservas', { name: 'reservation-wizard', subtitle: 'Paso 2 de 3 · Selección de libros' });
  var W = 1128;

  var panel = card({ name: 'wizard', w: W, gap: 0, pad: 0 });

  /* Cabecera del stepper */
  var stepper = F('stepper', { dir: 'HORIZONTAL', gap: 16, pad: [20, 24, 20, 24], w: W, align: 'CENTER', bg: C.sc1 });
  stepper.appendChild(stepDot(1, 'Cliente', 'done'));
  var l1 = figma.createRectangle(); l1.resize(80, 2); l1.fills = [solid(C.p)]; l1.name = 'connector';
  stepper.appendChild(l1);
  stepper.appendChild(stepDot(2, 'Libros', 'active'));
  var l2 = figma.createRectangle(); l2.resize(80, 2); l2.fills = [solid(C.outv)]; l2.name = 'connector';
  stepper.appendChild(l2);
  stepper.appendChild(stepDot(3, 'Confirmación', 'todo'));
  push(stepper);
  panel.appendChild(stepper); fill(stepper);

  /* Resumen del cliente ya elegido */
  var chosen = F('chosen', { dir: 'HORIZONTAL', gap: 12, pad: [16, 24, 16, 24], w: W, align: 'CENTER', bg: C.pc });
  chosen.appendChild(icon('user', C.opc, 20));
  chosen.appendChild(T('Cliente:', { size: 13, lh: 18, color: C.opc }));
  chosen.appendChild(T('María Fernández Ruiz · 10293847', { font: FONT.uiM, size: 13, lh: 18, color: C.opc }));
  push(chosen);
  chosen.appendChild(btnText('Cambiar'));
  panel.appendChild(chosen); fill(chosen);

  /* Dos columnas: catalogo y carrito */
  var cols = F('cols', { dir: 'HORIZONTAL', gap: 0, w: W });

  var pick = F('pick', { dir: 'VERTICAL', gap: 12, pad: [20, 20, 20, 24], w: 720, bg: C.white });
  var srch = F('search', { dir: 'HORIZONTAL', gap: 10, pad: [0, 16, 0, 16], h: 48, w: 676, bg: C.sc1, r: R.full, align: 'CENTER' });
  srch.appendChild(icon('search', C.onv, 18));
  srch.appendChild(T('Buscar libro disponible por título o ISBN…', { size: 14, lh: 20, color: C.out }));
  pick.appendChild(srch);

  var avail = [
    ['Cien años de soledad', 'Gabriel García Márquez', 'Narrativa', 1],
    ['Clean Code', 'Robert C. Martin', 'Informática', 1],
    ['Breve historia del tiempo', 'Stephen Hawking', 'Ciencia', 0],
    ['El arte de la guerra', 'Sun Tzu', 'Historia', 1],
    ['La casa de los espíritus', 'Isabel Allende', 'Narrativa', 1]
  ];
  for (var i = 0; i < avail.length; i++) {
    var a = avail[i];
    var it = F('avail', {
      dir: 'HORIZONTAL', gap: 12, pad: [12, 16, 12, 16], w: 676, align: 'CENTER',
      r: R.sm, stroke: a[3] ? C.outv : null, bg: a[3] ? null : C.sc1
    });
    var bx = F('bx', { dir: 'HORIZONTAL', w: 20, h: 20, r: R.xs, stroke: a[3] ? C.out : C.outv, bg: (i < 2 ? C.p : null), align: 'CENTER', justify: 'CENTER' });
    if (i < 2) bx.appendChild(icon('check', C.white, 14));
    it.appendChild(bx);
    var tx = F('tx', { dir: 'VERTICAL', gap: 2 });
    tx.appendChild(T(a[0], { font: FONT.uiM, size: 14, lh: 20, color: a[3] ? C.on : C.out }));
    tx.appendChild(T(a[1] + ' · ' + a[2], { size: 12, lh: 16, color: C.onv }));
    it.appendChild(tx); grow(tx);
    it.appendChild(a[3] ? chip('Disponible', { tone: 'ok' }) : chip('Reservado', { tone: 'warn' }));
    pick.appendChild(it);
  }
  cols.appendChild(pick);

  var cart = F('cart', { dir: 'VERTICAL', gap: 12, pad: [20, 24, 20, 20], w: 408, bg: C.sc1 });
  cart.appendChild(T('Detalle de la reserva', { font: FONT.dispB, size: 18, lh: 24, color: C.on }));
  var picked = ['Cien años de soledad', 'Clean Code'];
  for (var k = 0; k < picked.length; k++) {
    var pi = F('pi', { dir: 'HORIZONTAL', gap: 10, pad: [12, 12, 12, 12], w: 364, bg: C.white, r: R.sm, align: 'CENTER' });
    pi.appendChild(icon('book', C.p, 18));
    pi.appendChild(T(picked[k], { size: 13, lh: 18, color: C.on, w: 250 }));
    push(pi);
    pi.appendChild(btnIcon('x', C.err));
    cart.appendChild(pi);
  }
  var tot = F('tot', { dir: 'HORIZONTAL', gap: 8, w: 364, align: 'CENTER', pad: [8, 0, 8, 0] });
  tot.appendChild(T('Total de ejemplares', { size: 13, lh: 18, color: C.onv }));
  push(tot);
  tot.appendChild(T('2', { font: FONT.uiB, size: 16, lh: 22, color: C.on }));
  cart.appendChild(tot);
  push(cart);
  var nav = F('nav', { dir: 'HORIZONTAL', gap: 8, w: 364, justify: 'MAX' });
  nav.appendChild(btnText('Atrás'));
  nav.appendChild(btnFilled('Continuar'));
  cart.appendChild(nav);
  cols.appendChild(cart);

  panel.appendChild(cols); fill(cols);
  s.body.appendChild(panel);
  return s.root;
}

/* -------------------------------------------------------------- reservas -- */
function screenReservation() {
  var s = appShell('Reservas', 'Reservas', {
    name: 'reservation',
    subtitle: '154 reservas este mes',
    actions: [btnOutlined('Exportar'), btnFilled('Nueva reserva', 'plus')]
  });
  var W = 1128;
  var panel = surfacePanel(W);
  panel.appendChild(filterBar(W, [{ l: 'Este mes', selected: true }, { l: 'Por cliente', icon: 'users' }], 'Buscar por cliente o número…'));

  var head = tableHeader([
    { label: 'N.º', w: 100 },
    { label: 'FECHA', w: 180, sorted: true },
    { label: 'CLIENTE', w: 260 },
    { label: 'LIBROS RESERVADOS', w: 380 },
    { label: 'ACCIONES', w: 176 }
  ], W);
  panel.appendChild(head); fill(head);

  var rows = [
    ['R-0154', '09/09/2026 10:24', 'María Fernández Ruiz', 'Cien años de soledad, Clean Code'],
    ['R-0153', '09/09/2026 09:05', 'Luis Ortega Campos', 'Rayuela'],
    ['R-0152', '08/09/2026 17:40', 'Ana Castillo Vera', 'Estructura de datos, El nombre de la rosa'],
    ['R-0151', '08/09/2026 15:12', 'Pedro Salas Núñez', 'Breve historia del tiempo'],
    ['R-0150', '08/09/2026 11:58', 'Rocío Medina Paz', 'El arte de la guerra, Rayuela, Clean Code']
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var n = r[3].split(', ').length;
    var books = F('books', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' });
    books.appendChild(chip(n + (n === 1 ? ' libro' : ' libros'), { icon: 'book' }));
    books.appendChild(T(r[3], { size: 13, lh: 18, color: C.onv, w: 250 }));
    var row = tableRow([
      { text: r[0], w: 100, mono: true, strong: true },
      { text: r[1], w: 180, mono: true },
      { text: r[2], w: 260 },
      { node: books, w: 380 },
      { actions: ['chevronR'], w: 176 }
    ], W);
    panel.appendChild(row); fill(row);
  }
  var pg = paginator(W, '1 – 5 de 154');
  panel.appendChild(pg); fill(pg);
  s.body.appendChild(panel);
  return s.root;
}

/* ------------------------------------------------------------- asistente -- */
function bubble(text, who, w) {
  var mine = who === 'me';
  var b = F('bubble/' + who, {
    dir: 'VERTICAL', gap: 4, pad: [12, 16, 12, 16], w: w,
    bg: mine ? C.p : C.white, r: R.lg,
    stroke: mine ? null : C.outv
  });
  b.appendChild(T(text, { size: 14, lh: 22, color: mine ? C.white : C.on, w: w - 32 }));
  return b;
}

function screenAssistant() {
  var s = appShell('Asistente', 'Asistente', { name: 'assistant', subtitle: 'Consulta el catálogo y el fondo bibliográfico en lenguaje natural' });
  var W = 1128;
  var panel = card({ name: 'chat', w: W, h: 700, gap: 0, pad: 0 });

  var head = F('chat-head', { dir: 'HORIZONTAL', gap: 12, pad: [16, 20, 16, 20], w: W, align: 'CENTER', bg: C.sc1 });
  var ring = F('ring', { dir: 'HORIZONTAL', w: 36, h: 36, r: R.full, bg: C.pc, align: 'CENTER', justify: 'CENTER' });
  ring.appendChild(icon('sparkles', C.opc, 20));
  head.appendChild(ring);
  var ht = F('ht', { dir: 'VERTICAL', gap: 0 });
  ht.appendChild(T('Asistente SIGBI', { font: FONT.uiM, size: 15, lh: 20, color: C.on }));
  ht.appendChild(T('Responde sobre catálogo, socios y reservas', { size: 12, lh: 16, color: C.onv }));
  head.appendChild(ht);
  push(head);
  head.appendChild(chip('En línea', { tone: 'ok' }));
  panel.appendChild(head); fill(head);

  var thread = F('thread', { dir: 'VERTICAL', gap: 16, pad: [24, 24, 24, 24], w: W, bg: C.surf });

  var q1 = F('r', { dir: 'HORIZONTAL', w: 1080, justify: 'MAX' });
  q1.appendChild(bubble('¿Qué libros de informática están disponibles hoy?', 'me', 460));
  thread.appendChild(q1);

  var a1 = F('r', { dir: 'HORIZONTAL', gap: 10, w: 1080 });
  a1.appendChild(icon('sparkles', C.p, 22));
  var a1b = F('c', { dir: 'VERTICAL', gap: 8 });
  a1b.appendChild(bubble('There are 3 Computing titles available right now:\n\n· Clean Code — Robert C. Martin\n· Data Structures — Luis Joyanes Aguilar\n· Clean Architecture — Robert C. Martin\n\nWould you like me to prepare a reservation with any of them?', 'bot', 560));
  var srcs = F('sources', { dir: 'HORIZONTAL', gap: 8 });
  srcs.appendChild(chip('catálogo · 3 resultados', { icon: 'book' }));
  a1b.appendChild(srcs);
  a1.appendChild(a1b);
  thread.appendChild(a1);

  var q2 = F('r', { dir: 'HORIZONTAL', w: 1080, justify: 'MAX' });
  q2.appendChild(bubble('Sí, reserva Clean Code para María Fernández', 'me', 420));
  thread.appendChild(q2);

  var a2 = F('r', { dir: 'HORIZONTAL', gap: 10, w: 1080 });
  a2.appendChild(icon('sparkles', C.p, 22));
  var a2b = F('c', { dir: 'VERTICAL', gap: 8 });
  a2b.appendChild(bubble('Reservation R-0155 created for María Fernández Ruiz with 1 copy: Clean Code. The book is now marked as reserved.', 'bot', 520));
  var conf = F('conf', { dir: 'HORIZONTAL', gap: 8 });
  conf.appendChild(chip('R-0155 registrada', { tone: 'ok', icon: 'check' }));
  conf.appendChild(chip('Ver reserva', { icon: 'arrowR' }));
  a2b.appendChild(conf);
  a2.appendChild(a2b);
  thread.appendChild(a2);

  panel.appendChild(thread); fill(thread); fillV(thread);

  var composer = F('composer', { dir: 'HORIZONTAL', gap: 12, pad: [16, 20, 16, 20], w: W, align: 'CENTER', bg: C.white });
  var inp = F('input', { dir: 'HORIZONTAL', gap: 10, pad: [0, 20, 0, 20], h: 52, bg: C.sc1, r: R.full, align: 'CENTER' });
  inp.appendChild(T('Escribe tu consulta…', { size: 14, lh: 20, color: C.out }));
  composer.appendChild(inp); grow(inp);
  var send = F('send', { dir: 'HORIZONTAL', w: 52, h: 52, r: R.full, bg: C.p, align: 'CENTER', justify: 'CENTER' });
  send.appendChild(icon('send', C.white, 22));
  composer.appendChild(send);
  panel.appendChild(composer); fill(composer);

  s.body.appendChild(panel);
  return s.root;
}

/* ---------------------------------------------------------------- movil -- */
function screenBookMobile() {
  var root = F('book-mobile', { dir: 'VERTICAL', gap: 0, w: 390, h: 844, bg: C.surf, clip: true });

  /* Sin barra de estado falsa: en el dispositivo real la pinta el sistema */
  var top = F('top', { dir: 'HORIZONTAL', gap: 12, pad: [56, 16, 12, 16], w: 390, align: 'CENTER', bg: C.surf });
  top.appendChild(btnIcon('menu'));
  top.appendChild(T('Libros', { font: FONT.dispB, size: 24, lh: 30, color: C.on }));
  push(top);
  top.appendChild(btnIcon('search'));
  root.appendChild(top);

  var chips = F('chips', { dir: 'HORIZONTAL', gap: 8, pad: [4, 16, 12, 16], w: 390 });
  chips.appendChild(chip('Available', { selected: true }));
  chips.appendChild(chip('Narrativa', {}));
  chips.appendChild(chip('Ciencia', {}));
  root.appendChild(chips);

  var list = F('list', { dir: 'VERTICAL', gap: 10, pad: [0, 16, 16, 16], w: 390 });
  var items = [
    ['Cien años de soledad', 'Gabriel García Márquez', 'Narrativa', 1],
    ['Clean Code', 'Robert C. Martin', 'Informática', 1],
    ['Rayuela', 'Julio Cortázar', 'Narrativa', 0],
    ['Breve historia del tiempo', 'Stephen Hawking', 'Ciencia', 1],
    ['El arte de la guerra', 'Sun Tzu', 'Historia', 1]
  ];
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var c = F('book-card', {
      dir: 'HORIZONTAL', gap: 12, pad: [14, 14, 14, 14], w: 358,
      bg: C.white, r: R.md, stroke: C.outv, align: 'CENTER'
    });
    var cov = F('cover', { dir: 'HORIZONTAL', w: 44, h: 60, r: R.xs, bg: C.pc, align: 'CENTER', justify: 'CENTER' });
    cov.appendChild(icon('book', C.opc, 20));
    c.appendChild(cov);
    var tx = F('tx', { dir: 'VERTICAL', gap: 4 });
    tx.appendChild(T(it[0], { font: FONT.uiM, size: 15, lh: 20, color: C.on, w: 210 }));
    tx.appendChild(T(it[1], { size: 12, lh: 16, color: C.onv, w: 210 }));
    tx.appendChild(it[3] ? chip('Disponible', { tone: 'ok' }) : chip('Reservado', { tone: 'warn' }));
    c.appendChild(tx); grow(tx);
    c.appendChild(icon('chevronR', C.out, 20));
    list.appendChild(c);
  }
  root.appendChild(list);
  push(root);

  /* Barra inferior: 5 destinos como maximo (regla bottom-nav-limit) */
  var bottom = F('bottom-nav', { dir: 'HORIZONTAL', gap: 0, pad: [10, 8, 24, 8], w: 390, bg: C.sc2 });
  var dests = [
    { label: 'Panel', ic: 'dashboard' },
    { label: 'Libros', ic: 'book' },
    { label: 'Clientes', ic: 'users' },
    { label: 'Reservas', ic: 'calendar' },
    { label: 'Asistente', ic: 'sparkles' }
  ];
  for (var d = 0; d < dests.length; d++) {
    var act = dests[d].label === 'Libros';
    var tab = F('tab', { dir: 'VERTICAL', gap: 4, w: 74, h: 56, align: 'CENTER', justify: 'CENTER' });
    var pill = F('pill', { dir: 'HORIZONTAL', w: 56, h: 30, r: R.full, bg: act ? C.pc : null, align: 'CENTER', justify: 'CENTER' });
    pill.appendChild(icon(dests[d].ic, act ? C.opc : C.onv, 20));
    tab.appendChild(pill);
    tab.appendChild(T(dests[d].label, {
      font: act ? FONT.uiM : FONT.uiR, size: 11, lh: 14, color: act ? C.on : C.onv
    }));
    bottom.appendChild(tab);
  }
  root.appendChild(bottom);
  return root;
}

/* ==========================================================================
   FUNDAMENTOS Y COMPONENTES
   ========================================================================== */
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
  var root = F('SIGBI · Foundations', {
    dir: 'VERTICAL', gap: 40, pad: [56, 56, 56, 56], w: 1240, bg: C.surf
  });

  var hd = F('hd', { dir: 'VERTICAL', gap: 8 });
  hd.appendChild(T('SIGBI · Sistema de diseño', { font: FONT.dispB, size: 40, lh: 50, color: C.on }));
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
  note.appendChild(T('Contraste verificado: blanco sobre Primary 6,3:1 · On Surface sobre Surface 16,8:1 · On Surface Variant sobre Surface 8,5:1 · blanco sobre Tertiary 5,2:1. Todos por encima de AA (4,5:1).', {
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

  /* --- Tipografia --- */
  root.appendChild(sectionTitle('Tipografía', 'Lora para los títulos: voz editorial, propia de una biblioteca. IBM Plex Sans para la interfaz, legible a 12 px y con cifras tabulares para las tablas.'));
  var typ = F('type', { dir: 'VERTICAL', gap: 20, pad: 24, bg: C.white, r: R.md, stroke: C.outv, w: 1128 });
  var roles = [
    ['Display small', 'Sistema de Gestión Bibliotecaria', 'dispB', 36, 44, 'mat-display-small'],
    ['Headline medium', 'Catálogo de libros', 'dispB', 28, 36, 'mat-headline-medium'],
    ['Title large', 'Reservas del mes', 'uiM', 22, 28, 'mat-title-large'],
    ['Body large', 'Registra una reserva seleccionando un cliente y uno o más libros disponibles.', 'uiR', 16, 24, 'mat-body-large'],
    ['Body medium', 'Texto de tabla y contenido secundario de la interfaz.', 'uiR', 14, 20, 'mat-body-medium'],
    ['Label large', 'GUARDAR', 'uiM', 14, 20, 'mat-label-large'],
    ['Label medium', 'ISBN 9780132350884', 'monoR', 12, 16, 'mat-label-medium · cifras tabulares']
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
    rc.appendChild(T(radList[q][0] + ' · ' + radList[q][1], { font: FONT.monoR, size: 11, lh: 14, color: C.onv }));
    rad.appendChild(rc);
  }
  sr.appendChild(rad);
  root.appendChild(sr);

  /* --- Iconografia --- */
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
  var root = F('SIGBI · Components', {
    dir: 'VERTICAL', gap: 32, pad: [56, 56, 56, 56], w: 1240, bg: C.surf
  });
  root.appendChild(T('Componentes', { font: FONT.dispB, size: 40, lh: 50, color: C.on }));

  root.appendChild(sectionTitle('Botones', 'Alto 40, radio completo. Una sola acción primaria por pantalla.'));
  var b = F('b', { dir: 'HORIZONTAL', gap: 12, align: 'CENTER' });
  b.appendChild(btnFilled('Guardar'));
  b.appendChild(btnFilled('Nuevo libro', 'plus'));
  b.appendChild(btnOutlined('Exportar'));
  b.appendChild(btnText('Cancelar'));
  b.appendChild(btnFilled('Eliminar', 'trash', 'danger'));
  b.appendChild(btnIcon('pencil'));
  b.appendChild(btnIcon('trash', C.err));
  root.appendChild(b);

  root.appendChild(sectionTitle('Campos', 'Etiqueta siempre visible, nunca solo el placeholder. El error va debajo del campo.'));
  var f = F('f', { dir: 'HORIZONTAL', gap: 20, align: 'MIN' });
  f.appendChild(field('Título', 'Cien años de soledad', { required: true }));
  f.appendChild(field('Autor', '', { placeholder: 'Escribe el autor', focus: true, helper: 'Nombre y apellidos.' }));
  f.appendChild(field('ISBN', '978013235088', { mono: true, error: 'El ISBN debe tener 13 dígitos.' }));
  f.appendChild(field('Categoría', 'Narrativa', { disabled: true, helper: 'Heredada de la colección.' }));
  root.appendChild(f);

  root.appendChild(sectionTitle('Chips y estados', 'El color nunca es la única señal: cada estado lleva icono o texto.'));
  var ch = F('ch', { dir: 'HORIZONTAL', gap: 10, align: 'CENTER' });
  ch.appendChild(chip('Disponible', { tone: 'ok', icon: 'check' }));
  ch.appendChild(chip('Reservado', { tone: 'warn', icon: 'clock' }));
  ch.appendChild(chip('Inactive', { tone: 'err', icon: 'alert' }));
  ch.appendChild(chip('Narrativa', {}));
  ch.appendChild(chip('Available', { selected: true }));
  ch.appendChild(chip('Informática', { close: true }));
  root.appendChild(ch);

  root.appendChild(sectionTitle('Tabla', 'Densidad −1: filas de 48 px para ver más registros sin perder legibilidad.'));
  var tp = surfacePanel(1128);
  var th = tableHeader([
    { label: 'TÍTULO', w: 400, sorted: true },
    { label: 'AUTOR', w: 300 },
    { label: 'ISBN', w: 200 },
    { label: 'ESTADO', w: 100 },
    { label: 'ACCIONES', w: 96 }
  ], 1128);
  tp.appendChild(th); fill(th);
  var demo = [['Cien años de soledad', 'Gabriel García Márquez', '9780307474728', 1], ['Rayuela', 'Julio Cortázar', '9788437604572', 0]];
  for (var d = 0; d < demo.length; d++) {
    var tr = tableRow([
      { text: demo[d][0], w: 400, strong: true },
      { text: demo[d][1], w: 300, muted: true },
      { text: demo[d][2], w: 200, mono: true },
      { node: demo[d][3] ? chip('Libre', { tone: 'ok' }) : chip('Ocupado', { tone: 'warn' }), w: 100 },
      { actions: ['pencil', 'trash'], w: 96 }
    ], 1128);
    tp.appendChild(tr); fill(tr);
  }
  root.appendChild(tp);

  root.appendChild(sectionTitle('Retroalimentación', 'Snackbar con deshacer, y estado vacío que propone la acción siguiente.'));
  var fb = F('fb', { dir: 'HORIZONTAL', gap: 24, align: 'CENTER' });
  var snack = F('snackbar', {
    dir: 'HORIZONTAL', gap: 16, pad: [14, 16, 14, 16], bg: '#2E3635', r: R.xs,
    align: 'CENTER', w: 420, shadow: E2
  });
  snack.appendChild(icon('check', '#9BF3E8', 18));
  snack.appendChild(T('Libro eliminado del catálogo', { size: 14, lh: 20, color: '#EDF1F0' }));
  push(snack);
  snack.appendChild(T('DESHACER', { font: FONT.uiM, size: 13, lh: 18, ls: 0.5, color: '#7FD7CC' }));
  fb.appendChild(snack);

  var errBox = F('error-banner', {
    dir: 'HORIZONTAL', gap: 12, pad: 16, bg: C.errc, r: R.sm, w: 420, align: 'CENTER'
  });
  errBox.appendChild(icon('alert', C.err, 20));
  var eb = F('eb', { dir: 'VERTICAL', gap: 2 });
  eb.appendChild(T('No se pudo guardar la reserva', { font: FONT.uiM, size: 13, lh: 18, color: C.oerrc }));
  eb.appendChild(T('El libro «Rayuela» ya está reservado. Quítalo o elige otro ejemplar.', { size: 12, lh: 17, color: C.oerrc, w: 320 }));
  errBox.appendChild(eb);
  fb.appendChild(errBox);
  root.appendChild(fb);

  var es = card({ name: 'empty', w: 1128, pad: 0, gap: 0 });
  es.appendChild(emptyState('Aún no hay reservas', 'Cuando registres la primera reserva aparecerá aquí con su cliente y sus libros.', 'Nueva reserva', 'calendar'));
  root.appendChild(es);
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

  createStyles();
  var varsOk = createVariables();

  /* 1 - Fundamentos */
  var p1 = figma.createPage();
  p1.name = 'SIGBI · Foundations';
  place(p1, pageFoundations(), 0, 0);

  /* 2 - Componentes */
  var p2 = figma.createPage();
  p2.name = 'SIGBI · Components';
  place(p2, pageComponents(), 0, 0);

  /* 3 - Pantallas de escritorio */
  var p3 = figma.createPage();
  p3.name = 'SIGBI · Screens';
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

  /* 4 - Responsive */
  var p4 = figma.createPage();
  p4.name = 'SIGBI · Responsive';
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
