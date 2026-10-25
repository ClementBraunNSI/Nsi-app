"use client";

import { useEffect, useRef } from "react";

/**
 * Le renard assis de l'accueil (tracé d'après fox_2.png), animé au hasard : il remue la queue, regarde autour de lui,
 * penche la tête, bouge une oreille, cligne des yeux, et de temps en temps se redresse pour s'ébouriffer.
 * Un clic le fait s'ébrouer. Rien ne bouge si l'appareil demande moins d'animations ; tout s'arrête hors de l'écran.
 */

const C = {
  o: "#E4742B",
  ol: "#EE973B",
  od: "#D5612D",
  r: "#B4432B",
  rc: "#C24F2E",
  k: "#281E1E",
  cr: "#F9F6E3",
  g: "#DAD6CA",
  y: "#FEE8B6",
};

/** Touffes de poils qui s'envolent quand il s'ébroue : position de départ et direction. */
const TUFTS = [
  { x: 760, y: 1010, dx: -160, dy: -120, fill: C.o },
  { x: 700, y: 1240, dx: -190, dy: -30, fill: C.od },
  { x: 1290, y: 1020, dx: 170, dy: -110, fill: C.o },
  { x: 1320, y: 1240, dx: 200, dy: -20, fill: C.od },
  { x: 1040, y: 880, dx: 30, dy: -200, fill: C.cr },
  { x: 900, y: 860, dx: -90, dy: -190, fill: C.ol },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pickSide = () => (Math.random() < 0.5 ? -1 : 1);

export function AnimatedFox({ className, label = "Le renard de la tanière" }: { className?: string; label?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const foxRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const earLRef = useRef<SVGGElement>(null);
  const earRRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const tuftsRef = useRef<(SVGPolygonElement | null)[]>([]);
  const shakeNow = useRef<() => void>(() => undefined);

  useEffect(() => {
    const svg = svgRef.current;
    const fox = foxRef.current;
    const tail = tailRef.current;
    const head = headRef.current;
    const earL = earLRef.current;
    const earR = earRRef.current;
    const eyes = eyesRef.current;
    const shadow = shadowRef.current;
    if (!svg || !fox || !tail || !head || !earL || !earR || !eyes || !shadow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = true;
    let busy = false;
    let stopped = false;
    let lastAction = "";
    let actionTimer: ReturnType<typeof setTimeout>;
    let blinkTimer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(svg);

    const play = (element: Element, frames: Keyframe[], duration: number, easing = "ease-in-out") =>
      element.animate(frames, { duration, easing }).finished.catch(() => undefined);
    const rot = (deg: number) => ({ transform: `rotate(${deg}deg)` });

    const wagTail = () => {
      const strength = rand(5, 9);
      const frames =
        Math.random() < 0.65
          ? [0, strength, -strength * 0.7, strength * 0.8, -strength * 0.5, strength * 0.4, 0].map(rot)
          : [0, -strength * 0.6, strength, 0].map(rot);
      return play(tail, frames, frames.length > 4 ? rand(1200, 1700) : rand(1800, 2400));
    };

    const lookAround = () => {
      const side = pickSide();
      return play(
        head,
        [
          { transform: "rotate(0deg)", offset: 0 },
          { transform: `rotate(${-7 * side}deg)`, offset: 0.18 },
          { transform: `rotate(${-7 * side}deg)`, offset: 0.42 },
          { transform: `rotate(${6 * side}deg)`, offset: 0.6 },
          { transform: `rotate(${6 * side}deg)`, offset: 0.82 },
          { transform: "rotate(0deg)", offset: 1 },
        ],
        rand(2200, 2900),
      );
    };

    const tiltHead = () => {
      const angle = rand(8, 12) * pickSide();
      return play(
        head,
        [
          { transform: "rotate(0deg)", offset: 0 },
          { transform: `rotate(${angle}deg)`, offset: 0.25 },
          { transform: `rotate(${angle}deg)`, offset: 0.75 },
          { transform: "rotate(0deg)", offset: 1 },
        ],
        rand(1400, 2000),
      );
    };

    const twitchEar = () => {
      const left = Math.random() < 0.5;
      const ear = left ? earL : earR;
      const s = left ? -1 : 1;
      return play(ear, [0, 12 * s, 0, 7 * s, 0].map(rot), 520, "ease-out");
    };

    const blink = (twice: boolean) => {
      const frames = twice
        ? [1, 0.1, 1, 1, 0.1, 1].map((y) => ({ transform: `scaleY(${y})` }))
        : [1, 0.1, 1].map((y) => ({ transform: `scaleY(${y})` }));
      return play(eyes, frames, twice ? 420 : 180);
    };

    /** Il se redresse, s'ébroue (tête, oreilles et queue suivent, des poils s'envolent), puis se rassoit. */
    const shake = () => {
      const duration = 2300;
      const shakes: Keyframe[] = [];
      for (let i = 0; i < 8; i += 1) {
        const side = i % 2 ? 1 : -1;
        shakes.push({ transform: `translate(${30 * side}px, 0px) rotate(${2.6 * side}deg) scale(0.985, 1.07)`, offset: 0.3 + i * 0.05 });
      }
      const body = play(
        fox,
        [
          { transform: "translate(0px, 0px) rotate(0deg) scale(1, 1)", offset: 0 },
          { transform: "translate(0px, 0px) rotate(0deg) scale(0.985, 1.07)", offset: 0.2 },
          ...shakes,
          { transform: "translate(0px, 0px) rotate(0deg) scale(0.985, 1.07)", offset: 0.74 },
          { transform: "translate(0px, 0px) rotate(0deg) scale(1.03, 0.96)", offset: 0.9 },
          { transform: "translate(0px, 0px) rotate(0deg) scale(1, 1)", offset: 1 },
        ],
        duration,
      );
      const headShake: Keyframe[] = [{ transform: "rotate(0deg)", offset: 0 }, { transform: "rotate(0deg)", offset: 0.28 }];
      for (let i = 0; i < 9; i += 1) headShake.push({ transform: `rotate(${(i % 2 ? 6 : -6)}deg)`, offset: 0.31 + i * 0.045 });
      headShake.push({ transform: "rotate(0deg)", offset: 0.76 }, { transform: "rotate(0deg)", offset: 1 });
      play(head, headShake, duration);
      play(earL, [{ transform: "rotate(0deg)", offset: 0 }, { transform: "rotate(-14deg)", offset: 0.4 }, { transform: "rotate(4deg)", offset: 0.55 }, { transform: "rotate(-10deg)", offset: 0.68 }, { transform: "rotate(0deg)", offset: 0.85 }, { transform: "rotate(0deg)", offset: 1 }], duration);
      play(earR, [{ transform: "rotate(0deg)", offset: 0 }, { transform: "rotate(14deg)", offset: 0.4 }, { transform: "rotate(-4deg)", offset: 0.55 }, { transform: "rotate(10deg)", offset: 0.68 }, { transform: "rotate(0deg)", offset: 0.85 }, { transform: "rotate(0deg)", offset: 1 }], duration);
      const tailShake: Keyframe[] = [{ transform: "rotate(0deg)", offset: 0 }];
      for (let i = 0; i < 7; i += 1) tailShake.push({ transform: `rotate(${i % 2 ? 10 : -8}deg)`, offset: 0.3 + i * 0.065 });
      tailShake.push({ transform: "rotate(0deg)", offset: 0.85 }, { transform: "rotate(0deg)", offset: 1 });
      play(tail, tailShake, duration);
      play(shadow, [{ transform: "scaleX(1)", offset: 0 }, { transform: "scaleX(0.93)", offset: 0.2 }, { transform: "scaleX(0.93)", offset: 0.74 }, { transform: "scaleX(1)", offset: 1 }], duration);
      tuftsRef.current.forEach((tuft, index) => {
        if (!tuft) return;
        const { dx, dy } = TUFTS[index];
        const delay = 0.32 + (index % 3) * 0.08;
        tuft.animate(
          [
            { opacity: 0, transform: "translate(0px, 0px) rotate(0deg)", offset: 0 },
            { opacity: 0, transform: "translate(0px, 0px) rotate(0deg)", offset: delay },
            { opacity: 1, transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) rotate(40deg)`, offset: delay + 0.08 },
            { opacity: 0, transform: `translate(${dx}px, ${dy + 140}px) rotate(160deg)`, offset: Math.min(1, delay + 0.38) },
            { opacity: 0, transform: `translate(${dx}px, ${dy + 140}px) rotate(160deg)`, offset: 1 },
          ],
          { duration, easing: "ease-out" },
        );
      });
      return body;
    };

    const ACTIONS: { name: string; weight: number; run: () => Promise<unknown> }[] = [
      { name: "queue", weight: 30, run: wagTail },
      { name: "regard", weight: 18, run: lookAround },
      { name: "tête", weight: 14, run: tiltHead },
      { name: "oreille", weight: 22, run: twitchEar },
      { name: "ébrouement", weight: 9, run: shake },
    ];

    const pick = () => {
      const pool = ACTIONS.filter((action) => !(action.name === "ébrouement" && lastAction === "ébrouement"));
      let roll = Math.random() * pool.reduce((sum, action) => sum + action.weight, 0);
      for (const action of pool) {
        roll -= action.weight;
        if (roll <= 0) return action;
      }
      return pool[0];
    };

    const perform = async (run: () => Promise<unknown>, name: string) => {
      busy = true;
      lastAction = name;
      await run();
      busy = false;
    };

    const scheduleAction = () => {
      actionTimer = setTimeout(async () => {
        if (stopped) return;
        if (!busy && visible && !document.hidden) {
          const action = pick();
          await perform(action.run, action.name);
        }
        scheduleAction();
      }, rand(1800, 4800));
    };

    const scheduleBlink = () => {
      blinkTimer = setTimeout(async () => {
        if (stopped) return;
        if (visible && !document.hidden) await blink(Math.random() < 0.25);
        scheduleBlink();
      }, rand(1800, 5200));
    };

    shakeNow.current = () => {
      if (!busy) void perform(shake, "ébrouement");
    };

    scheduleAction();
    scheduleBlink();

    return () => {
      stopped = true;
      clearTimeout(actionTimer);
      clearTimeout(blinkTimer);
      observer.disconnect();
      svg.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      shakeNow.current = () => undefined;
    };
  }, []);

  const pivot = (origin: string) => ({ transformBox: "fill-box" as const, transformOrigin: origin });

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1932 1932"
      width={360}
      height={360}
      role="img"
      aria-label={label}
      className={className}
      onClick={() => shakeNow.current()}
    >
      <path
        d="M390 1548C300 1520 240 1440 300 1340C360 1240 520 1120 545 1020C570 920 555 840 600 868C650 900 720 975 805 1005L1270 1003C1330 995 1335 1050 1333 1130C1330 1290 1450 1410 1445 1480C1442 1530 1420 1545 1400 1550Z"
        fill={C.y}
      />
      <ellipse ref={shadowRef} cx={888} cy={1560} rx={532} ry={38} fill={C.g} style={pivot("50% 50%")} />

      <g ref={foxRef} style={pivot("69% 100%")}>
        <g ref={tailRef} style={pivot("75% 82%")}>
          <path d="M400 1140C420 1180 450 1210 485 1232L557 1266L523 1266L523 1316L435 1328L465 1410C400 1395 355 1350 339 1305C345 1250 365 1195 400 1140Z" fill={C.cr} />
          <polygon points="523,1266 557,1266 670,1316 523,1316" fill={C.o} />
          <path d="M435 1328L523 1316L670 1316L670 1497C600 1460 520 1420 465 1410Z" fill={C.od} />
          <path d="M339 1305C355 1350 400 1395 465 1410L418 1442L455 1537L405 1508C360 1470 330 1400 339 1305Z" fill={C.g} />
          <path d="M465 1410C520 1420 600 1460 670 1497L780 1556L486 1556L418 1442Z" fill={C.r} />
        </g>

        <polygon points="830,965 995,1133 1003,1556 780,1556 670,1497 670,1215" fill={C.o} />
        <polygon points="995,1133 1051,1188 1108,1130 1100,1556 1003,1556" fill={C.r} />
        <polygon points="1270,965 1225,1205 1207,1303 1105,1303 1108,1130" fill={C.o} />
        <polygon points="1225,1205 1310,1287 1203,1490 1167,1505 1207,1303" fill={C.r} />
        <polygon points="858,1078 898,1305 933,1508 912,1492 852,1492 830,1525 873,1308 840,1233 726,1188 843,1205" fill={C.r} />
        <polygon points="898,1305 998,1303 1003,1556 810,1556 852,1492 912,1492 933,1508" fill={C.k} />
        <polygon points="1105,1303 1207,1303 1167,1505 1191,1492 1252,1494 1290,1556 1100,1556" fill={C.k} />
        <polygon points="890,742 944,770 838,942" fill={C.o} />
        <polygon points="1215,740 1160,768 1272,958" fill={C.o} />
        <polygon points="944,770 1023,810 1080,810 1160,768 1175,792 1098,832 1003,832 930,797" fill={C.g} />
        <polygon points="930,797 1003,832 1098,832 1175,792 1272,958 1270,965 1051,1188 830,965 838,942" fill={C.cr} />

        <g ref={headRef} style={pivot("50% 97%")}>
          <g ref={earLRef} style={pivot("65% 85%")}>
            <path d="M818 292L983 437L848 560Q818 430 818 292Z" fill={C.o} />
            <path d="M835 337Q900 425 947 468L880 530Q852 450 835 337Z" fill={C.k} />
          </g>
          <g ref={earRRef} style={pivot("37% 85%")}>
            <path d="M1283 292L1119 437L1254 560Q1283 430 1283 292Z" fill={C.o} />
            <path d="M1266 337Q1201 425 1155 468L1222 530Q1249 450 1266 337Z" fill={C.k} />
          </g>
          <polygon points="735,662 1366,662 1080,815 1023,815" fill={C.cr} />
          <polygon points="983,437 1051,437 1051,760 1028,766 995,660 968,613 912,598 862,634 735,662" fill={C.ol} />
          <polygon points="1119,437 1051,437 1051,760 1074,766 1107,660 1133,613 1190,598 1240,634 1366,662" fill={C.o} />
          <polygon points="862,634 912,598 938,643 995,660 1028,766 980,700" fill={C.rc} />
          <polygon points="1240,634 1190,598 1164,643 1107,660 1074,766 1122,700" fill={C.rc} />
          <g ref={eyesRef} style={pivot("50% 50%")}>
            <polygon points="912,598 968,613 984,630 995,660 938,643" fill={C.k} />
            <polygon points="1190,598 1133,613 1117,630 1107,660 1164,643" fill={C.k} />
          </g>
          <polygon points="735,662 862,634 980,700 1000,745 1023,772 1051,797 1023,812" fill={C.cr} />
          <polygon points="1366,662 1240,634 1122,700 1102,745 1080,772 1051,797 1080,812" fill={C.cr} />
          <path d="M1030 762L1051 758L1072 762L1080 772Q1066 790 1051 797Q1036 790 1023 772Z" fill={C.k} />
          <polygon points="1023,810 1051,797 1080,810 1072,815 1030,815" fill={C.k} />
        </g>
      </g>

      {TUFTS.map((tuft, index) => (
        <polygon
          key={index}
          ref={(element) => {
            tuftsRef.current[index] = element;
          }}
          points={`${tuft.x},${tuft.y} ${tuft.x + 50},${tuft.y - 66} ${tuft.x + 86},${tuft.y + 10}`}
          fill={tuft.fill}
          opacity={0}
          style={pivot("50% 50%")}
        />
      ))}
    </svg>
  );
}
