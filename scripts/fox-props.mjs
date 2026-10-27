/** Accessoires en facettes posés à droite des renards (badges, succès, chapitres). Repère : toile de 512 px, accessoire vers x 330-490, y 290-475. */
export const INK = '#302020';
export const O = '#f08820';
export const OM = '#ea580c';
export const OD = '#c2410c';
export const CR = '#fffaf0';
export const CR2 = '#efe4cf';
export const G = '#22a45a';
export const GD = '#15803d';
export const B = '#3b82f6';
export const BD = '#1d4ed8';
export const BL = '#bfe3f5';
export const Y = '#fbbf24';
export const YD = '#f59e0b';
export const R = '#dc2626';
export const RD = '#b91c1c';
export const GR = '#cbd5e1';
export const GRD = '#64748b';
export const BR = '#a8693c';
export const BRD = '#8a5330';
export const P = '#7c3aed';
export const PD = '#5b21b6';


export const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${body}</svg>`);
const shadow = (rx = 64) => `<ellipse cx="410" cy="474" rx="${rx}" ry="10" fill="#000" opacity=".08"/>`;
const poly = (points, fill, extra = '') => `<polygon points="${points}" fill="${fill}" ${extra}/>`;
const line = (d, color, width, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

// Petit fanion pour distinguer les éditions anglaise et espagnole de la chasse.
function pennant(kind) {
  if (!kind) return '';
  const pole = line('M486 470 V296', INK, 5);
  if (kind === 'en') {
    const cross = 'M446 324 L486 316 M466 302 V338';
    const diagonals = 'M446 306 L486 334 M446 342 L486 298';
    return `${pole}${poly('486,298 446,306 446,342 486,334', BD)}
      ${line(diagonals, CR, 6)}${line(diagonals, R, 2)}${line(cross, CR, 10)}${line(cross, R, 5)}`;
  }
  return `${pole}${poly('486,298 446,306 446,342 486,334', R)}${poly('486,309 446,317 446,331 486,323', Y)}`;
}

function medal(face, shade, inner = 'star') {
  const centre = inner === 'star'
    ? poly('410,382 418,402 440,402 422,414 429,436 410,422 391,436 398,414 380,402 402,402', CR)
    : `<circle cx="410" cy="410" r="18" fill="none" stroke="${CR}" stroke-width="6"/>`;
  return `${shadow(56)}
    ${poly('378,300 404,300 420,360 396,366', B)}${poly('442,300 416,300 400,360 424,366', R)}
    <circle cx="410" cy="410" r="54" fill="${face}"/>
    ${poly('410,356 464,410 410,464', shade)}
    <circle cx="410" cy="410" r="40" fill="none" stroke="${shade}" stroke-width="4"/>${centre}`;
}

export const PROPS = {
  terminal: () => `${shadow(76)}
    ${poly('336,330 486,330 486,450 336,450', '#1f3b33')}${poly('411,330 486,330 486,450 411,450', '#18302a')}
    ${poly('336,330 486,330 486,348 336,348', INK)}
    <circle cx="350" cy="339" r="4" fill="${R}"/><circle cx="363" cy="339" r="4" fill="${Y}"/><circle cx="376" cy="339" r="4" fill="${G}"/>
    ${line('M358 374 L384 394 L358 414', CR, 9)}${poly('396,404 436,404 436,414 396,414', O)}`,
  keyboard: () => {
    let keys = '';
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        const x = 350 + col * 20 - row * 8;
        const y = 384 + row * 14;
        keys += poly(`${x + 4},${y} ${x + 20},${y} ${x + 16},${y + 10} ${x},${y + 10}`, row === 2 && col > 1 && col < 5 ? O : CR);
      }
    }
    return `${shadow(80)}${poly('326,436 356,372 490,372 466,436', GRD)}${poly('326,436 466,436 466,452 326,452', INK)}
      ${poly('410,372 490,372 466,436 400,436', '#475569')}${keys}`;
  },
  rocket: () => `${shadow(50)}
    ${poly('410,290 438,338 438,420 382,420 382,338', CR)}${poly('410,290 438,338 438,420 410,420', CR2)}
    <circle cx="410" cy="358" r="15" fill="${B}" stroke="${INK}" stroke-width="4"/>
    ${poly('382,384 352,432 382,420', OM)}${poly('438,384 468,432 438,420', OD)}
    ${poly('390,420 430,420 410,470', Y)}${poly('400,420 420,420 410,450', OM)}`,
  lambda: () => `${shadow(62)}
    ${poly('352,296 390,296 484,466 446,466', OM)}${poly('371,296 390,296 484,466 465,466', OD)}
    ${poly('404,376 424,412 384,466 346,466', O)}`,
  receipt: () => `${shadow(64)}
    ${poly('350,298 470,298 470,456 455,444 440,456 425,444 410,456 395,444 380,456 365,444 350,456', CR, `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`)}
    ${poly('410,300 468,300 468,452 455,442 440,454 425,442 410,454', CR2)}
    ${line('M368 324 H452 M368 344 H430 M368 364 H446 M368 384 H420', '#c9b99a', 7)}
    ${poly('366,404 454,404 454,424 366,424', OM)}`,
  basket: () => `${shadow(76)}
    ${line('M356 384 Q410 300 464 384', BRD, 9)}
    <circle cx="384" cy="370" r="20" fill="${R}"/><circle cx="426" cy="364" r="22" fill="${O}"/>${poly('440,344 452,330 458,346', GD)}
    ${poly('334,378 486,378 486,396 334,396', BRD)}
    ${poly('342,396 478,396 464,466 356,466', BR)}${poly('410,396 478,396 464,466 410,466', BRD)}
    ${line('M366 414 H454 M372 438 H448', '#c58a55', 5)}`,
  register: () => `${shadow(80)}
    ${poly('358,320 462,320 462,372 358,372', INK)}${poly('370,332 450,332 450,360 370,360', G)}
    ${poly('336,380 484,380 490,466 330,466', OM)}${poly('410,380 484,380 490,466 410,466', OD)}
    ${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => poly(`${352 + c * 30},${392 + r * 18} ${372 + c * 30},${392 + r * 18} ${372 + c * 30},${404 + r * 18} ${352 + c * 30},${404 + r * 18}`, CR)).join('')).join('')}
    ${poly('348,448 472,448 472,460 348,460', CR2)}`,
  barcode: () => {
    const widths = [6, 3, 3, 8, 3, 5, 3, 3, 9, 3, 5, 3, 7, 3, 3, 6];
    let x = 354;
    let bars = '';
    widths.forEach((w, i) => {
      if (i % 2 === 0) bars += poly(`${x},344 ${x + w},344 ${x + w},420 ${x},420`, INK);
      x += w + 3;
    });
    return `${shadow(76)}${poly('338,326 482,326 482,450 338,450', CR, `stroke="${INK}" stroke-width="4"`)}
      ${poly('410,328 480,328 480,448 410,448', CR2)}${bars}
      ${line('M330 384 H490', R, 4, 'opacity=".8"')}${poly('354,430 466,430 466,438 354,438', '#c9b99a')}`;
  },
  pricetag: () => `${shadow(70)}
    ${poly('340,340 432,340 484,392 432,444 340,444', O)}${poly('340,392 484,392 432,444 340,444', OD)}
    <circle cx="364" cy="392" r="10" fill="${CR}" stroke="${INK}" stroke-width="4"/>
    ${line('M364 382 Q352 330 380 304', INK, 4)}
    ${line('M396 376 H448 M396 408 H436', CR, 8)}`,
  stairs: () => `${shadow(80)}
    ${[0, 1, 2, 3].map((i) => {
      const x = 336 + i * 36;
      const top = 466 - (i + 1) * 34;
      return poly(`${x},${top} ${x + 36},${top} ${x + 36},466 ${x},466`, i % 2 ? OD : OM) + poly(`${x},${top} ${x + 36},${top} ${x + 36},${top + 8} ${x},${top + 8}`, O);
    }).join('')}
    ${line('M462 330 V280', INK, 5)}${poly('462,280 492,290 462,302', G)}`,
  pages: () => `${shadow(76)}
    ${poly('370,302 482,302 482,432 370,432', CR2, `stroke="${INK}" stroke-width="4"`)}
    ${poly('338,330 452,330 452,462 338,462', CR, `stroke="${INK}" stroke-width="4"`)}
    ${poly('340,332 450,332 450,350 340,350', OM)}
    ${poly('352,362 402,362 402,400 352,400', BL)}${poly('352,400 372,378 392,400', G)}
    ${line('M414 366 H438 M414 384 H434 M352 418 H438 M352 436 H420', '#c9b99a', 6)}`,
  uml: () => `${shadow(80)}
    ${line('M382 368 V432 H404', INK, 5)}${poly('382,368 374,384 390,384', CR, `stroke="${INK}" stroke-width="4"`)}
    ${poly('336,300 428,300 428,368 336,368', CR, `stroke="${INK}" stroke-width="4"`)}${poly('338,302 426,302 426,322 338,322', O)}
    ${line('M348 340 H412 M348 354 H398', '#c9b99a', 5)}
    ${poly('404,400 488,400 488,466 404,466', CR, `stroke="${INK}" stroke-width="4"`)}${poly('406,402 486,402 486,422 406,422', B)}
    ${line('M416 440 H474 M416 454 H456', '#c9b99a', 5)}`,
  globe: () => `${shadow(66)}
    <circle cx="410" cy="388" r="70" fill="${B}"/>
    <path d="M410 318 A70 70 0 0 1 410 458 Z" fill="${BD}"/>
    ${poly('366,350 404,338 414,366 392,392 362,384', G)}${poly('424,398 460,388 456,430 430,440', GD)}${poly('380,416 398,420 392,440', G)}
    <ellipse cx="410" cy="388" rx="30" ry="70" fill="none" stroke="${CR}" stroke-width="3" opacity=".7"/>
    ${line('M340 388 H480', CR, 3, 'opacity=".7"')}`,
  gui: () => `${shadow(80)}
    ${poly('334,316 488,316 488,458 334,458', CR, `stroke="${INK}" stroke-width="5"`)}
    ${poly('336,318 486,318 486,342 336,342', OM)}
    <circle cx="470" cy="330" r="5" fill="${CR}"/><circle cx="454" cy="330" r="5" fill="${CR}"/>
    ${poly('354,360 468,360 468,384 354,384', '#ffffff', `stroke="${GRD}" stroke-width="3"`)}
    ${poly('354,398 372,398 372,416 354,416', G)}${line('M382 407 H444', '#c9b99a', 6)}
    ${poly('354,426 410,426 410,446 354,446', G)}${poly('422,426 468,426 468,446 422,446', GR)}`,
  menu: () => `${shadow(76)}
    ${poly('338,306 482,306 482,462 338,462', '#1f2937')}${poly('410,306 482,306 482,462 410,462', '#111827')}
    ${poly('352,330 468,330 468,354 352,354', OM)}
    ${line('M368 386 H452 M368 414 H440 M368 442 H446', CR, 8)}
    ${poly('356,334 368,342 356,350', CR)}`,
  mvc: () => `${shadow(76)}
    ${line('M410 318 L356 424 L464 424 Z', INK, 6)}
    <circle cx="410" cy="318" r="28" fill="${OM}"/>${poly('410,290 438,318 410,346', OD)}
    <circle cx="356" cy="424" r="28" fill="${B}"/>${poly('356,396 384,424 356,452', BD)}
    <circle cx="464" cy="424" r="28" fill="${G}"/>${poly('464,396 492,424 464,452', GD)}`,
  bolt: () => `${shadow(56)}
    ${poly('432,292 356,398 404,398 384,468 466,352 418,352 448,292', Y)}
    ${poly('418,352 466,352 384,468 404,398', YD)}`,
  map: (kind) => `${shadow(80)}
    ${poly('334,334 382,318 382,456 334,472', CR)}${poly('382,318 434,334 434,472 382,456', CR2)}${poly('434,334 486,318 486,456 434,472', CR)}
    ${line('M352 446 Q376 390 410 414 T 458 362', OM, 5, 'stroke-dasharray="2 12"')}
    ${line('M448 352 L468 372 M468 352 L448 372', R, 7)}
    ${poly('348,350 366,344 362,362', G)}${poly('396,350 414,358 404,372', G)}${pennant(kind)}`,
  palette: (kind) => `${shadow(76)}
    <path d="M410 322 C468 320 494 362 486 402 C480 432 450 424 448 446 C444 468 400 472 370 458 C338 444 330 400 344 368 C356 340 380 322 410 322 Z M446 432 a10 10 0 1 0 0.1 0 Z" fill="#e8c37a" fill-rule="evenodd"/>
    <path d="M410 322 C468 320 494 362 486 402 C480 432 450 424 448 446 C446 456 432 464 414 466 Z" fill="#d6aa58"/>
    <circle cx="374" cy="392" r="12" fill="${R}"/><circle cx="392" cy="356" r="12" fill="${B}"/><circle cx="434" cy="350" r="12" fill="${Y}"/><circle cx="460" cy="384" r="11" fill="${G}"/>
    ${poly('396,446 452,374 460,380 404,452', INK)}${poly('452,374 470,350 476,356 460,380', OM)}${pennant(kind)}`,
  frame: (kind) => `${shadow(80)}
    ${poly('334,314 486,314 486,458 334,458', BR)}${poly('410,314 486,314 486,458 410,458', BRD)}
    ${poly('350,330 470,330 470,442 350,442', BL)}
    <circle cx="444" cy="356" r="12" fill="${Y}"/>
    ${poly('350,442 350,410 390,374 430,412 470,388 470,442', G)}${poly('390,374 430,412 410,442 350,442 350,430', GD)}${pennant(kind)}`,
  stopwatch: () => `${shadow(62)}
    ${poly('398,306 422,306 422,318 398,318', OM)}${poly('404,318 416,318 416,334 404,334', INK)}
    <circle cx="410" cy="398" r="64" fill="${CR}" stroke="${INK}" stroke-width="8"/>
    <path d="M410 334 A64 64 0 0 1 410 462 Z" fill="${CR2}"/>
    ${line('M410 346 V356 M410 440 V450 M358 398 H368 M452 398 H462', INK, 5)}
    ${line('M410 398 V354', OM, 7)}${line('M410 398 L440 414', INK, 5)}<circle cx="410" cy="398" r="7" fill="${INK}"/>`,
  logs: () => {
    const rows = [[84, '#c9b99a'], [64, '#c9b99a'], [90, R], [72, '#c9b99a'], [58, '#c9b99a'], [80, '#c9b99a'], [50, '#c9b99a']];
    return `${shadow(76)}${poly('340,302 458,302 458,458 340,458', CR, `stroke="${INK}" stroke-width="4"`)}
      ${poly('400,304 456,304 456,456 400,456', CR2)}
      ${rows.map(([w, c], i) => poly(`354,${322 + i * 18} ${354 + w},${322 + i * 18} ${354 + w},${330 + i * 18} ${354},${330 + i * 18}`, c)).join('')}
      ${poly('458,424 472,412 496,446 482,458', INK)}
      <circle cx="446" cy="404" r="30" fill="${BL}" stroke="${INK}" stroke-width="8"/>${poly('446,376 418,404 446,404', '#e6f5fc')}`;
  },
  car: () => `${shadow(84)}
    ${poly('332,438 344,398 384,392 404,358 456,358 476,392 490,402 490,438', OM)}
    ${poly('410,392 476,392 490,402 490,438 410,438', OD)}
    ${poly('410,366 452,366 466,390 400,390', BL)}${poly('398,366 404,366 394,390 378,390', BL)}
    <circle cx="368" cy="440" r="20" fill="${INK}"/><circle cx="368" cy="440" r="8" fill="${GR}"/>
    <circle cx="458" cy="440" r="20" fill="${INK}"/><circle cx="458" cy="440" r="8" fill="${GR}"/>
    ${poly('478,404 490,404 490,416 478,416', Y)}`,
  city: () => {
    const blocks = [[334, 370, 40, '#64748b'], [378, 312, 42, '#475569'], [424, 344, 34, '#94a3b8'], [462, 384, 28, '#64748b']];
    let out = shadow(84);
    for (const [x, top, w, c] of blocks) {
      out += poly(`${x},${top} ${x + w},${top} ${x + w},466 ${x},466`, c);
      for (let y = top + 12; y < 450; y += 22) {
        for (let wx = x + 8; wx < x + w - 8; wx += 14) out += poly(`${wx},${y} ${wx + 7},${y} ${wx + 7},${y + 10} ${wx},${y + 10}`, (wx + y) % 3 ? Y : '#fde68a');
      }
    }
    return out;
  },
  cube: () => `${shadow(66)}
    ${poly('410,306 476,340 410,374 344,340', '#fdba74')}
    ${poly('344,340 410,374 410,460 344,426', OM)}${poly('476,340 410,374 410,460 476,426', OD)}
    ${line('M410 374 V460 M344 340 L410 374 L476 340', INK, 3, 'opacity=".35"')}`,
  blueprint: () => `${shadow(80)}
    ${poly('334,316 488,316 488,460 334,460', BD)}${poly('411,316 488,316 488,460 411,460', '#1e3a8a')}
    ${line('M334 352 H488 M334 388 H488 M334 424 H488 M372 316 V460 M410 316 V460 M450 316 V460', '#60a5fa', 1.5, 'opacity=".6"')}
    ${line('M410 340 L450 360 L410 380 L370 360 Z M370 360 V408 L410 428 V380 M450 360 V408 L410 428', CR, 4)}`,
  hierarchy: () => `${shadow(80)}
    ${line('M410 352 V376 M366 376 H454 M366 376 V404 M454 376 V404', INK, 5)}
    ${poly('410,352 400,370 420,370', CR, `stroke="${INK}" stroke-width="4"`)}
    ${poly('370,300 450,300 450,352 370,352', O)}${poly('410,300 450,300 450,352 410,352', OD)}
    ${poly('332,404 400,404 400,456 332,456', CR, `stroke="${INK}" stroke-width="4"`)}
    ${poly('420,404 488,404 488,456 420,456', CR, `stroke="${INK}" stroke-width="4"`)}
    ${poly('334,406 398,406 398,420 334,420', B)}${poly('422,406 486,406 486,420 422,420', G)}`,
  potion: () => `${shadow(60)}
    ${poly('396,300 424,300 424,312 396,312', BR)}
    ${poly('398,312 422,312 422,350 398,350', CR, `stroke="${INK}" stroke-width="4"`)}
    <circle cx="410" cy="408" r="58" fill="${CR}" stroke="${INK}" stroke-width="5"/>
    <path d="M354 414 A56 56 0 0 0 466 414 Z" fill="${P}"/><path d="M410 414 H466 A56 56 0 0 1 410 464 Z" fill="${PD}"/>
    <circle cx="390" cy="434" r="7" fill="#c4b5fd"/><circle cx="420" cy="446" r="5" fill="#c4b5fd"/><circle cx="404" cy="388" r="5" fill="#c4b5fd"/>`,
  heart: () => `${shadow(60)}
    <path d="M410 466 L350 400 C330 376 342 334 376 332 C394 331 404 342 410 354 C416 342 426 331 444 332 C478 334 490 376 470 400 Z" fill="${R}"/>
    <path d="M410 466 L410 354 C416 342 426 331 444 332 C478 334 490 376 470 400 Z" fill="${RD}"/>
    ${line('M412 344 L398 380 L420 400 L402 438', INK, 6)}`,
  speech: () => `${shadow(70)}
    ${poly('334,312 486,312 486,416 404,416 372,452 376,416 334,416', CR, `stroke="${INK}" stroke-width="5" stroke-linejoin="round"`)}
    <circle cx="374" cy="364" r="10" fill="${INK}"/><circle cx="410" cy="364" r="10" fill="${OM}"/><circle cx="446" cy="364" r="10" fill="${INK}"/>`,
  floppy: () => `${shadow(70)}
    ${poly('338,316 466,316 486,336 486,462 338,462', B)}${poly('410,316 466,316 486,336 486,462 410,462', BD)}
    ${poly('366,316 452,316 452,362 366,362', GR)}${poly('428,324 442,324 442,354 428,354', GRD)}
    ${poly('358,394 466,394 466,462 358,462', CR)}${line('M374 416 H450 M374 436 H434', '#c9b99a', 5)}`,
  levelup: () => `${shadow(70)}
    ${poly('390,316 406,354 446,354 414,378 426,418 390,394 354,418 366,378 334,354 374,354', Y)}
    ${poly('390,316 406,354 446,354 414,378 426,418 390,394', YD)}
    ${poly('456,470 456,400 440,400 470,350 500,400 484,400 484,470', G)}${poly('470,350 500,400 484,400 484,470 470,470', GD)}`,
  bestiary: () => `${shadow(70)}
    ${poly('346,316 474,316 474,462 346,462', BR)}${poly('410,316 474,316 474,462 410,462', BRD)}
    ${poly('346,316 362,316 362,462 346,462', INK)}
    <ellipse cx="418" cy="408" rx="22" ry="18" fill="${CR}"/>
    <circle cx="392" cy="372" r="9" fill="${CR}"/><circle cx="410" cy="358" r="9" fill="${CR}"/><circle cx="430" cy="358" r="9" fill="${CR}"/><circle cx="446" cy="374" r="9" fill="${CR}"/>`,
  swords: () => `${shadow(70)}
    ${poly('346,320 358,312 462,428 450,438', GR)}${poly('352,316 358,312 462,428 456,432', '#94a3b8')}
    ${poly('474,320 462,312 358,428 370,438', GR)}${poly('468,316 462,312 358,428 364,432', '#94a3b8')}
    ${poly('436,414 470,446 462,454 428,422', Y)}${poly('384,414 350,446 358,454 392,422', Y)}
    ${poly('454,446 470,462 462,470 446,454', BRD)}${poly('366,446 350,462 358,470 374,454', BRD)}`,
  virus: () => {
    let spikes = '';
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2;
      const x1 = 410 + Math.cos(a) * 44;
      const y1 = 392 + Math.sin(a) * 44;
      const x2 = 410 + Math.cos(a) * 68;
      const y2 = 392 + Math.sin(a) * 68;
      spikes += line(`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`, GD, 6) + `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="8" fill="${G}"/>`;
    }
    return `${shadow(66)}${spikes}<circle cx="410" cy="392" r="48" fill="${G}"/><path d="M410 344 A48 48 0 0 1 410 440 Z" fill="${GD}"/>
      <circle cx="394" cy="380" r="9" fill="#86efac"/><circle cx="424" cy="408" r="7" fill="#86efac"/>`;
  },
  equals: () => `${shadow(70)}
    ${poly('338,330 400,330 400,392 338,392', CR, `stroke="${INK}" stroke-width="4"`)}${poly('350,348 388,348 388,374 350,374', BL)}
    ${poly('416,350 486,350 486,368 416,368', OM)}${poly('451,350 486,350 486,368 451,368', OD)}
    ${poly('416,384 486,384 486,402 416,402', OM)}${poly('451,384 486,384 486,402 451,402', OD)}
    ${poly('338,412 486,412 486,456 338,456', CR, `stroke="${INK}" stroke-width="4"`)}${line('M354 434 H440', '#c9b99a', 7)}`,
  loop: () => `${shadow(66)}
    ${line('M352 392 A58 58 0 0 1 456 352', OM, 16)}${poly('440,330 476,350 446,374', OM)}
    ${line('M468 400 A58 58 0 0 1 364 440', OD, 16)}${poly('380,462 344,442 374,418', OD)}`,
  cards: () => `${shadow(76)}
    ${poly('372,302 486,302 486,404 372,404', CR2, `stroke="${INK}" stroke-width="4"`)}
    ${poly('336,340 452,340 452,452 336,452', CR, `stroke="${INK}" stroke-width="4"`)}
    ${poly('338,342 400,342 400,364 338,364', O)}
    <circle cx="364" cy="406" r="14" fill="none" stroke="${YD}" stroke-width="7"/>${line('M378 406 H434 M420 406 V422 M432 406 V418', YD, 7)}`,
  table: () => `${shadow(80)}
    ${poly('334,316 488,316 488,458 334,458', CR, `stroke="${INK}" stroke-width="5"`)}
    ${poly('336,318 486,318 486,346 336,346', OM)}${poly('410,318 486,318 486,346 410,346', OD)}
    ${line('M336 374 H486 M336 402 H486 M336 430 H486 M386 318 V458 M438 318 V458', INK, 3)}
    ${poly('388,404 436,404 436,428 388,428', Y)}`,
  graph: () => `${shadow(80)}
    ${line('M352 360 L420 316 L476 380 L428 444 L352 360 L476 380 M420 316 L428 444', INK, 5)}
    <circle cx="352" cy="360" r="18" fill="${OM}"/><circle cx="420" cy="316" r="18" fill="${B}"/>
    <circle cx="476" cy="380" r="18" fill="${G}"/><circle cx="428" cy="444" r="18" fill="${Y}"/>`,
  headphones: () => `${shadow(70)}
    ${line('M354 410 V384 A56 56 0 0 1 466 384 V410', INK, 12)}
    ${poly('336,396 370,396 370,460 336,460', OM)}${poly('450,396 484,396 484,460 450,460', OD)}
    ${line('M486 344 Q500 360 486 376', OM, 5)}${line('M334 344 Q320 360 334 376', OM, 5)}`,
  // Succès du site.
  medal_gold: () => medal(Y, YD),
  medal_bronze: () => medal('#d97706', '#b45309', 'ring'),
  medals: () => `${shadow(80)}
    <g transform="translate(-34 -10)">${medal(GR, '#94a3b8', 'ring').replace(shadow(56), '')}</g>
    <g transform="translate(30 12)">${medal('#e2e8f0', '#94a3b8').replace(shadow(56), '')}</g>`,
  crown: () => `${shadow(76)}
    ${poly('338,446 338,346 376,390 410,324 444,390 482,346 482,446', Y)}
    ${poly('410,324 444,390 482,346 482,446 410,446', YD)}
    ${poly('338,420 482,420 482,450 338,450', '#d97706')}
    <circle cx="374" cy="435" r="8" fill="${R}"/><circle cx="410" cy="435" r="8" fill="${B}"/><circle cx="446" cy="435" r="8" fill="${G}"/>
    <circle cx="410" cy="320" r="9" fill="${CR}"/>`,
  flame: () => `${shadow(56)}
    <path d="M410 296 C440 340 474 360 470 412 C466 448 440 468 410 468 C378 468 350 448 350 410 C350 376 372 362 380 330 C396 350 400 366 410 370 C418 346 414 320 410 296 Z" fill="${OM}"/>
    <path d="M410 296 C440 340 474 360 470 412 C466 448 440 468 410 468 Z" fill="${OD}"/>
    <path d="M410 468 C388 468 376 452 378 432 C380 412 396 404 400 384 C414 400 440 414 440 436 C440 456 428 468 410 468 Z" fill="${Y}"/>`,
  target: () => `${shadow(62)}
    <circle cx="410" cy="396" r="70" fill="${OM}"/><circle cx="410" cy="396" r="50" fill="${CR}"/>
    <circle cx="410" cy="396" r="30" fill="${OM}"/><circle cx="410" cy="396" r="12" fill="${CR}"/>
    ${poly('410,396 470,330 478,338 418,404', INK)}${poly('470,330 486,318 490,336 478,338', G)}`,
  gradcap: (star) => `${shadow(76)}
    ${poly('366,378 454,378 454,428 410,446 366,428', '#3b2a2a')}${poly('410,378 454,378 454,428 410,446', INK)}
    ${poly('410,326 492,360 410,394 328,360', '#4b3636')}${poly('410,326 492,360 410,394', INK)}
    ${line('M410 360 L470 376 V420', Y, 5)}${poly('462,420 478,420 482,446 458,446', Y)}
    ${star ? poly('362,300 368,316 386,316 372,326 377,343 362,333 347,343 352,326 338,316 356,316', Y) : ''}`,
  shieldlock: () => `${shadow(60)}
    <path d="M410 300 L474 324 V384 C474 428 410 466 410 466 C410 466 346 428 346 384 V324 Z" fill="${B}"/>
    <path d="M410 300 L474 324 V384 C474 428 410 466 410 466 Z" fill="${BD}"/>
    ${line('M394 386 V370 A16 16 0 0 1 426 370 V386', CR, 7)}
    ${poly('384,384 436,384 436,426 384,426', CR)}<circle cx="410" cy="402" r="6" fill="${INK}"/>${poly('407,404 413,404 413,416 407,416', INK)}`,
  csharp: () => `${shadow(70)}
    ${line('M370 318 Q348 318 348 340 V372 Q348 388 334 390 Q348 392 348 408 V440 Q348 462 370 462', P, 11)}
    ${line('M450 318 Q472 318 472 340 V372 Q472 388 486 390 Q472 392 472 408 V440 Q472 462 450 462', PD, 11)}
    ${line('M398 350 L390 430 M428 350 L420 430 M378 374 H440 M374 406 H436', INK, 8)}`,
  pybook: () => `${shadow(80)}
    ${poly('334,350 410,366 410,462 334,446', CR)}${poly('486,350 410,366 410,462 486,446', CR2)}
    ${line('M334 350 L410 366 L486 350 M410 366 V462', INK, 4)}
    ${poly('356,382 390,388 390,420 356,414', B)}${poly('366,392 380,394 380,408 366,406', Y)}
    ${poly('430,388 464,382 464,414 430,420', Y)}${poly('440,396 454,394 454,408 440,410', B)}
    ${line('M402 296 V340 M402 296 L418 312', OM, 6)}`,
  hammer: () => `${shadow(70)}
    ${poly('366,460 352,446 440,358 454,372', BR)}${poly('366,460 359,453 447,365 454,372', BRD)}
    ${poly('406,334 448,292 492,336 470,358 448,336 428,356', GRD)}${poly('448,292 492,336 470,358 448,336', '#475569')}`,
  bulb: () => `${shadow(56)}
    ${line('M410 286 V298 M358 312 L366 322 M462 312 L454 322 M340 362 H352 M480 362 H468', Y, 6)}
    <circle cx="410" cy="370" r="52" fill="${Y}"/><path d="M410 318 A52 52 0 0 1 410 422 Z" fill="${YD}"/>
    ${poly('386,404 434,404 430,428 390,428', Y)}
    ${poly('388,430 432,430 432,444 388,444', GRD)}${poly('392,448 428,448 420,462 400,462', '#475569')}
    ${line('M396 380 L410 396 L424 380', CR, 4)}`,
  compass: () => `${shadow(66)}
    <circle cx="410" cy="396" r="64" fill="${CR}" stroke="${BRD}" stroke-width="9"/>
    <path d="M410 332 A64 64 0 0 1 410 460 Z" fill="${CR2}"/>
    ${line('M410 338 V350 M410 442 V454 M352 396 H364 M456 396 H468', INK, 4)}
    ${poly('410,344 426,396 394,396', R)}${poly('410,344 426,396 410,396', RD)}
    ${poly('394,396 426,396 410,448', GRD)}${poly('410,396 426,396 410,448', '#475569')}
    <circle cx="410" cy="396" r="7" fill="${INK}"/>`,
  // Chapitres.
  binary: () => `${shadow(80)}
    ${poly('336,326 404,326 404,454 336,454', CR, `stroke="${INK}" stroke-width="4"`)}${poly('370,328 402,328 402,452 370,452', CR2)}
    <ellipse cx="370" cy="390" rx="18" ry="34" fill="none" stroke="${OM}" stroke-width="10"/>
    ${poly('418,306 486,306 486,434 418,434', OM)}${poly('452,306 486,306 486,434 452,434', OD)}
    ${line('M442 348 L456 336 V408 M440 408 H472', CR, 9)}`,
  robot: () => `${shadow(70)}
    ${line('M410 310 V292', INK, 5)}<circle cx="410" cy="288" r="8" fill="${R}"/>
    ${poly('356,310 464,310 464,388 356,388', GR)}${poly('410,310 464,310 464,388 410,388', '#94a3b8')}
    <circle cx="384" cy="346" r="12" fill="${B}"/><circle cx="436" cy="346" r="12" fill="${B}"/>
    ${line('M388 372 H432', INK, 5)}
    ${poly('366,398 454,398 462,466 358,466', OM)}${poly('410,398 454,398 462,466 410,466', OD)}
    ${poly('390,416 430,416 430,440 390,440', CR)}${line('M396 428 H424', G, 4)}`,
  chip: () => {
    let pins = '';
    for (let i = 0; i < 5; i += 1) {
      const v = 344 + i * 22;
      pins += line(`M${v} 320 V304 M${v} 456 V472 M330 ${v + 8} H314 M490 ${v + 8} H506`, GRD, 5);
    }
    return `${shadow(80)}${pins}
      ${poly('330,320 490,320 490,456 330,456', '#1f2937')}${poly('410,320 490,320 490,456 410,456', '#111827')}
      ${poly('370,352 450,352 450,424 370,424', G)}${poly('410,352 450,352 450,424 410,424', GD)}
      <circle cx="346" cy="440" r="5" fill="${Y}"/>`;
  },
  camera: () => `${shadow(80)}
    ${poly('378,330 404,312 440,312 456,330', INK)}
    ${poly('332,330 488,330 488,456 332,456', '#374151')}${poly('410,330 488,330 488,456 410,456', '#1f2937')}
    <circle cx="410" cy="394" r="44" fill="${INK}"/><circle cx="410" cy="394" r="32" fill="${B}"/>
    ${poly('410,362 378,394 410,394', BL)}<circle cx="410" cy="394" r="12" fill="${INK}"/>
    ${poly('458,340 478,340 478,352 458,352', Y)}`,
  social: () => `${shadow(80)}
    ${poly('334,312 450,312 450,396 384,396 360,422 362,396 334,396', CR, `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`)}
    <path d="M392 380 L370 358 C362 348 368 334 380 334 C386 334 390 338 392 342 C394 338 398 334 404 334 C416 334 422 348 414 358 Z" fill="${R}"/>
    ${poly('418,368 488,368 488,440 470,440 476,462 452,440 418,440', B)}${poly('453,368 488,368 488,440 470,440 476,462 453,440', BD)}
    <circle cx="440" cy="404" r="5" fill="${CR}"/><circle cx="454" cy="404" r="5" fill="${CR}"/><circle cx="468" cy="404" r="5" fill="${CR}"/>`,
  pin: () => `${shadow(56)}
    <path d="M410 470 L366 384 A50 50 0 1 1 454 384 Z" fill="${R}"/>
    <path d="M410 470 L410 290 A50 50 0 0 1 454 384 Z" fill="${RD}"/>
    <circle cx="410" cy="342" r="18" fill="${CR}"/>`,
  flowchart: () => `${shadow(80)}
    ${line('M410 334 V356 M410 412 V432 M380 384 H350 V432', INK, 4)}
    ${poly('370,298 450,298 450,334 370,334', OM)}${poly('410,298 450,298 450,334 410,334', OD)}
    ${poly('410,356 444,384 410,412 376,384', Y)}${poly('410,356 444,384 410,412', YD)}
    ${poly('384,432 486,432 486,466 384,466', CR, `stroke="${INK}" stroke-width="4"`)}
    ${poly('330,432 372,432 372,466 330,466', B)}`,
  hourglass: () => `${shadow(60)}
    ${poly('352,300 468,300 468,316 352,316', BRD)}${poly('352,452 468,452 468,468 352,468', BRD)}
    ${poly('364,316 456,316 416,384 456,452 364,452 404,384', CR, `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`)}
    ${poly('378,328 442,328 410,374', Y)}${poly('410,394 446,446 374,446', Y)}${poly('410,394 446,446 410,446', YD)}`,
  stack: () => `${shadow(70)}
    ${[0, 1, 2, 3].map((i) => {
      const y = 438 - i * 38;
      const colours = [[OM, OD], [B, BD], [G, GD], [Y, YD]][i];
      return poly(`350,${y} 470,${y} 470,${y + 30} 350,${y + 30}`, colours[0]) + poly(`410,${y} 470,${y} 470,${y + 30} 410,${y + 30}`, colours[1]);
    }).join('')}
    ${line('M488 300 V344 M476 312 L488 300 L500 312', INK, 5)}`,
  gear: () => {
    let teeth = '';
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      const x = 410 + Math.cos(a) * 62;
      const y = 390 + Math.sin(a) * 62;
      teeth += `<rect x="${(x - 13).toFixed(1)}" y="${(y - 13).toFixed(1)}" width="26" height="26" rx="4" fill="${GRD}" transform="rotate(${(i * 45).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
    return `${shadow(70)}${teeth}<circle cx="410" cy="390" r="58" fill="${GRD}"/>
      <path d="M410 332 A58 58 0 0 1 410 448 Z" fill="#475569"/><circle cx="410" cy="390" r="22" fill="${CR}"/>`;
  },
  database: () => `${shadow(70)}
    ${[0, 1, 2].map((i) => {
      const y = 420 - i * 46;
      return `<path d="M350 ${y} V${y + 36} A60 16 0 0 0 470 ${y + 36} V${y} Z" fill="${i % 2 ? OD : OM}"/>
        <path d="M410 ${y} V${y + 52} A60 16 0 0 0 470 ${y + 36} V${y} Z" fill="${OD}" opacity=".7"/>`;
    }).join('')}
    <ellipse cx="410" cy="328" rx="60" ry="16" fill="#fdba74"/>
    <circle cx="368" cy="374" r="4" fill="${CR}"/><circle cx="368" cy="420" r="4" fill="${CR}"/><circle cx="368" cy="466" r="4" fill="${CR}"/>`,
  tree: () => `${shadow(80)}
    ${line('M410 318 L366 384 M410 318 L454 384 M366 384 L340 446 M366 384 L392 446 M454 384 L480 446', INK, 5)}
    <circle cx="410" cy="318" r="20" fill="${OM}"/>
    <circle cx="366" cy="384" r="18" fill="${B}"/><circle cx="454" cy="384" r="18" fill="${B}"/>
    <circle cx="340" cy="446" r="15" fill="${G}"/><circle cx="392" cy="446" r="15" fill="${G}"/><circle cx="480" cy="446" r="15" fill="${G}"/>`,
  server: () => `${shadow(70)}
    ${[0, 1, 2].map((i) => {
      const y = 310 + i * 52;
      return poly(`350,${y} 470,${y} 470,${y + 44} 350,${y + 44}`, '#374151') + poly(`410,${y} 470,${y} 470,${y + 44} 410,${y + 44}`, '#1f2937')
        + `<circle cx="368" cy="${y + 22}" r="6" fill="${i === 1 ? Y : G}"/>` + line(`M392 ${y + 22} H452`, GRD, 5);
    }).join('')}`,
  clang: () => `${shadow(66)}
    ${poly('366,300 454,300 486,332 486,436 454,468 366,468 334,436 334,332', B)}
    ${poly('410,300 454,300 486,332 486,436 454,468 410,468', BD)}
    ${line('M448 352 A44 44 0 1 0 448 416', CR, 18)}`,
};
