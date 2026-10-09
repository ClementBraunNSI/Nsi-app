import {
  sheetFoxArt,
  type FoxPose,
  type FoxProp,
  type FoxScene,
} from "@/lib/sheet-badge-art";

const ORANGE = "#f08820";
const MID = "#e86818";
const DEEP = "#c04018";
const CREAM = "#f8f0e0";
const INK = "#302020";
const LIGHT = "#f6a04a";

const stroke = {
  fill: "none" as const,
  stroke: INK,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Scene({ scene }: { scene: FoxScene }) {
  if (scene === "night") {
    return (
      <g>
        <rect width="120" height="120" fill="#1c3b30" />
        <circle cx="96" cy="22" r="8" fill={CREAM} />
        <circle cx="100" cy="20" r="6" fill="#1c3b30" />
        <circle cx="22" cy="18" r="1.2" fill={CREAM} />
        <circle cx="34" cy="28" r="0.8" fill={CREAM} />
        <ellipse cx="52" cy="104" rx="36" ry="8" fill="#14281f" />
      </g>
    );
  }
  if (scene === "parchment") {
    return (
      <g>
        <rect width="120" height="120" fill="#f4e2c0" />
        <path d="M16 28 H104 M16 44 H104 M16 60 H104" stroke="#e2c89a" strokeWidth="2" />
        <ellipse cx="52" cy="104" rx="34" ry="7" fill="#e4c99a" opacity="0.7" />
      </g>
    );
  }
  if (scene === "desk") {
    return (
      <g>
        <rect width="120" height="120" fill="#f7efe2" />
        <rect y="78" width="120" height="42" fill="#e7d3a8" />
        <path d="M0 78 H120" stroke="#c4a36a" strokeWidth="2" />
        <rect x="8" y="86" width="28" height="6" rx="1" fill="#d7b98a" />
      </g>
    );
  }
  return (
    <g>
      <rect width="120" height="120" fill="#d7efc8" />
      <circle cx="92" cy="24" r="10" fill="#f6d36b" />
      <ellipse cx="60" cy="108" rx="70" ry="22" fill="#7dae62" />
      <ellipse cx="52" cy="100" rx="30" ry="6" fill="#302020" opacity="0.12" />
    </g>
  );
}

function Ears() {
  return (
    <g>
      <polygon points="26,28 12,4 44,22" fill={ORANGE} />
      <polygon points="28,26 20,10 40,22" fill={DEEP} />
      <polygon points="74,28 88,4 56,22" fill={ORANGE} />
      <polygon points="72,26 80,10 60,22" fill={DEEP} />
    </g>
  );
}

function FrontFox({ face }: { face: "calm" | "wink" | "think" | "read" }) {
  const downcast = face === "read";
  return (
    <g>
      <polygon points="16,64 4,78 14,94 34,82 30,66" fill={MID} />
      <polygon points="4,78 8,96 20,86" fill={CREAM} />
      <polygon points="16,64 24,72 22,86 10,78" fill={DEEP} />
      <polygon points="28,46 76,46 82,88 22,88" fill={ORANGE} />
      <polygon points="28,46 40,56 36,88 22,88" fill={MID} />
      <polygon points="44,58 66,56 70,88 40,88" fill={CREAM} />
      <polygon points="32,82 46,82 44,98 30,98" fill={INK} />
      <polygon points="58,82 74,82 76,98 56,98" fill={INK} />
      <polygon points="26,24 76,24 82,54 20,54" fill={ORANGE} />
      <polygon points="36,24 66,24 60,36 42,36" fill={LIGHT} />
      <polygon points="38,40 64,40 68,54 34,54" fill={CREAM} />
      <Ears />
      {face === "wink" ? (
        <path d="M40 34 Q46 30 52 34" {...stroke} />
      ) : downcast ? (
        <path d="M40 36 Q46 40 52 36" {...stroke} />
      ) : (
        <polygon points="40,32 51,32 50,36 41,36" fill={INK} />
      )}
      {downcast ? (
        <path d="M56 36 Q62 40 68 36" {...stroke} />
      ) : (
        <polygon points="56,32 67,32 66,36 57,36" fill={INK} />
      )}
      <polygon points="48,44 58,44 53,49" fill={INK} />
      {face === "think" && (
        <g>
          <polygon points="60,50 76,42 80,56 64,62" fill={ORANGE} />
          <polygon points="72,44 80,42 82,52 74,54" fill={INK} />
        </g>
      )}
      {face === "read" && (
        <g>
          <polygon points="30,68 72,68 74,90 28,90" fill={CREAM} stroke={INK} strokeWidth="1.3" />
          <path d="M51 68 V90" stroke={DEEP} strokeWidth="1.2" />
          <path d="M36 74 H46 M56 74 H66 M36 80 H46" stroke="#e2c89a" strokeWidth="1.2" />
        </g>
      )}
    </g>
  );
}

function CheerFox() {
  return (
    <g>
      <polygon points="8,20 20,8 28,42 14,46" fill={ORANGE} />
      <polygon points="10,16 18,12 20,24" fill={DEEP} />
      <polygon points="8,10 16,6 20,16 12,18" fill={INK} />
      <polygon points="92,20 80,8 72,42 86,46" fill={ORANGE} />
      <polygon points="90,16 82,12 80,24" fill={DEEP} />
      <polygon points="92,10 84,6 80,16 88,18" fill={INK} />
      <polygon points="14,58 2,72 14,86 32,74" fill={MID} />
      <polygon points="2,72 6,88 18,78" fill={CREAM} />
      <polygon points="30,40 74,40 78,76 26,76" fill={ORANGE} />
      <polygon points="30,40 42,48 38,76 26,76" fill={MID} />
      <polygon points="44,52 64,50 68,76 40,76" fill={CREAM} />
      <polygon points="34,72 46,72 44,92 32,92" fill={INK} />
      <polygon points="58,72 70,72 72,92 56,92" fill={INK} />
      <polygon points="28,18 74,18 80,48 22,48" fill={ORANGE} />
      <polygon points="38,18 64,18 58,30 44,30" fill={LIGHT} />
      <polygon points="40,34 62,34 66,48 36,48" fill={CREAM} />
      <polygon points="28,22 14,0 46,16" fill={ORANGE} />
      <polygon points="30,20 22,6 42,16" fill={DEEP} />
      <polygon points="74,22 88,0 56,16" fill={ORANGE} />
      <polygon points="72,20 80,6 60,16" fill={DEEP} />
      <path d="M40 30 Q46 24 52 30" {...stroke} />
      <path d="M56 30 Q62 24 68 30" {...stroke} />
      <polygon points="48,38 58,38 53,43" fill={INK} />
      <path d="M46 44 Q52 50 58 44" {...stroke} />
    </g>
  );
}

function SideFox() {
  return (
    <g>
      <polygon points="6,58 24,48 34,66 16,74" fill={MID} />
      <polygon points="4,62 2,76 16,72" fill={CREAM} />
      <polygon points="22,46 86,42 92,70 20,74" fill={ORANGE} />
      <polygon points="28,58 70,54 74,74 24,74" fill={CREAM} />
      <polygon points="22,46 40,44 38,58 24,60" fill={LIGHT} />
      <polygon points="34,68 42,68 40,92 32,92" fill={INK} />
      <polygon points="48,66 56,66 58,92 48,92" fill={INK} />
      <polygon points="66,64 74,64 76,92 66,92" fill={INK} />
      <polygon points="78,62 86,62 90,92 78,92" fill={INK} />
      <polygon points="78,28 112,34 106,62 76,56" fill={ORANGE} />
      <polygon points="92,40 112,42 106,58 90,54" fill={CREAM} />
      <polygon points="80,32 88,10 100,32" fill={ORANGE} />
      <polygon points="84,30 90,16 96,32" fill={DEEP} />
      <polygon points="92,40 100,40 99,44 93,44" fill={INK} />
      <polygon points="106,48 114,48 110,53" fill={INK} />
    </g>
  );
}

function FoxPose({ pose }: { pose: FoxPose }) {
  if (pose === "cheer") return <CheerFox />;
  if (pose === "side") return <SideFox />;
  if (pose === "think") return <FrontFox face="think" />;
  if (pose === "read") return <FrontFox face="read" />;
  if (pose === "wink") return <FrontFox face="wink" />;
  return <FrontFox face="calm" />;
}

function Glyph({ prop }: { prop: FoxProp }) {
  switch (prop) {
    case "binary":
      return (
        <g {...stroke}>
          <rect x="3" y="4" width="8" height="16" rx="1.5" fill={CREAM} />
          <rect x="13" y="4" width="8" height="16" rx="1.5" fill={ORANGE} />
          <path d="M6 8 V16 M7.5 8 H5.2 M7.2 16 H5.2 M15.2 8 H18.2 M16.7 8 V16" />
        </g>
      );
    case "tags":
      return (
        <g>
          <rect x="3" y="4" width="18" height="6" rx="1.5" fill={ORANGE} />
          <rect x="3" y="14" width="12" height="6" rx="1.5" fill={CREAM} stroke={INK} strokeWidth="1.2" />
        </g>
      );
    case "lock":
      return (
        <g>
          <rect x="5" y="11" width="14" height="9" rx="1.5" fill={ORANGE} />
          <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" {...stroke} />
        </g>
      );
    case "toggle":
      return (
        <g>
          <rect x="2" y="7" width="20" height="10" rx="5" fill={ORANGE} />
          <circle cx="16" cy="12" r="3.2" fill={CREAM} />
        </g>
      );
    case "pin":
      return (
        <g>
          <path d="M12 22 L8 12 a6 6 0 1 1 8 0 Z" fill={ORANGE} />
          <circle cx="12" cy="9" r="2" fill={CREAM} />
        </g>
      );
    case "terminal":
      return (
        <g>
          <rect x="2" y="4" width="20" height="16" rx="2" fill="#1c3b30" />
          <path d="M6 10 L10 12 L6 14 M12 15 H18" {...stroke} stroke={CREAM} />
        </g>
      );
    case "loop":
      return (
        <g>
          <path d="M16 7 A6 6 0 1 0 16 16" {...stroke} />
          <polygon points="14,4 20,8 13,10" fill={ORANGE} />
        </g>
      );
    case "table":
      return (
        <g {...stroke}>
          <rect x="3" y="4" width="18" height="16" rx="1" fill={CREAM} />
          <path d="M3 9 H21 M3 14 H21 M10 4 V20" />
        </g>
      );
    case "satellite":
      return (
        <g>
          <rect x="9" y="9" width="6" height="6" fill={ORANGE} />
          <polygon points="9,9 3,5 3,13" fill={DEEP} />
          <polygon points="15,9 21,5 21,13" fill={DEEP} />
          <path d="M12 15 V20" {...stroke} />
        </g>
      );
    case "camera":
      return (
        <g>
          <rect x="2" y="7" width="20" height="13" rx="2" fill={ORANGE} />
          <polygon points="8,7 10,4 14,4 16,7" fill={MID} />
          <circle cx="12" cy="13" r="3.2" fill={CREAM} />
        </g>
      );
    case "nodes":
      return (
        <g>
          <path d="M6 16 L12 6 L18 16 L6 16" {...stroke} />
          <circle cx="6" cy="16" r="2.2" fill={ORANGE} />
          <circle cx="12" cy="6" r="2.2" fill={ORANGE} />
          <circle cx="18" cy="16" r="2.2" fill={CREAM} stroke={INK} />
        </g>
      );
    case "magnifier":
      return (
        <g {...stroke}>
          <circle cx="10" cy="10" r="5.5" fill={CREAM} />
          <path d="M14 14 L20 20" />
        </g>
      );
    case "branch":
      return <polygon points="12,3 21,12 12,21 3,12" fill={CREAM} stroke={INK} strokeWidth="1.4" />;
    case "stamp":
      return (
        <g>
          <rect x="4" y="3" width="16" height="18" rx="1" fill={CREAM} stroke={INK} strokeWidth="1.2" />
          <circle cx="12" cy="12" r="4" fill="none" stroke={DEEP} strokeWidth="1.4" />
        </g>
      );
    case "wheel":
      return (
        <g {...stroke}>
          <circle cx="12" cy="12" r="8" fill={CREAM} />
          <circle cx="12" cy="12" r="2" fill={ORANGE} />
          <path d="M12 4 V8 M12 16 V20 M4 12 H8 M16 12 H20" />
        </g>
      );
    case "classbox":
      return (
        <g {...stroke}>
          <rect x="3" y="3" width="18" height="18" fill={CREAM} />
          <path d="M3 9 H21 M3 14 H21" />
        </g>
      );
    case "warning":
      return (
        <g>
          <polygon points="12,3 22,20 2,20" fill={ORANGE} />
          <path d="M12 9 V14" {...stroke} />
          <circle cx="12" cy="17" r="0.9" fill={INK} />
        </g>
      );
    case "database":
      return (
        <g>
          <ellipse cx="12" cy="6" rx="7" ry="3" fill={CREAM} stroke={INK} strokeWidth="1.2" />
          <path d="M5 6 V16 A7 3 0 0 0 19 16 V6" fill={ORANGE} />
          <path d="M5 11 A7 3 0 0 0 19 11" {...stroke} />
        </g>
      );
    case "blocks":
      return (
        <g>
          <rect x="2" y="8" width="6" height="6" fill={ORANGE} />
          <rect x="9" y="8" width="6" height="6" fill={MID} />
          <rect x="16" y="8" width="6" height="6" fill={DEEP} />
          <path d="M8 11 H9 M15 11 H16" {...stroke} />
        </g>
      );
    case "shield":
      return <path d="M12 3 L20 6 V12 C20 17 12 21 12 21 C12 21 4 17 4 12 V6 Z" fill={ORANGE} />;
    case "chart":
      return (
        <g>
          <path d="M3 20 H21" {...stroke} />
          <rect x="5" y="12" width="3" height="8" fill={MID} />
          <rect x="10" y="7" width="3" height="13" fill={ORANGE} />
          <rect x="15" y="10" width="3" height="10" fill={DEEP} />
        </g>
      );
    case "stack":
      return (
        <g>
          <rect x="5" y="4" width="14" height="4" rx="1" fill={DEEP} />
          <rect x="5" y="10" width="14" height="4" rx="1" fill={ORANGE} />
          <rect x="5" y="16" width="14" height="4" rx="1" fill={CREAM} stroke={INK} strokeWidth="1" />
        </g>
      );
    case "spiral":
      return <path d="M12 12 m-2 0 a2 2 0 1 0 4 0 a4 4 0 1 1 -8 0 a6 6 0 1 0 12 0" {...stroke} />;
    case "infinity":
      return <path d="M4 12 C4 8 8 8 12 12 C16 16 20 16 20 12 C20 8 16 8 12 12 C8 16 4 16 4 12 Z" {...stroke} />;
    case "tree":
      return (
        <g>
          <polygon points="12,3 20,12 4,12" fill={ORANGE} />
          <polygon points="12,9 21,18 3,18" fill={MID} />
          <rect x="10" y="18" width="4" height="4" fill={DEEP} />
        </g>
      );
    case "split":
      return (
        <g>
          <path d="M4 12 H12 M12 12 L18 6 M12 12 L18 18" {...stroke} />
          <polygon points="16,4 21,6 16,8" fill={ORANGE} />
          <polygon points="16,16 21,18 16,20" fill={ORANGE} />
        </g>
      );
    case "gear":
      return (
        <g {...stroke}>
          <circle cx="12" cy="12" r="4" fill={CREAM} />
          <path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21 M5.5 5.5 L7.5 7.5 M16.5 16.5 L18.5 18.5 M18.5 5.5 L16.5 7.5 M7.5 16.5 L5.5 18.5" />
        </g>
      );
    case "boxarrow":
      return (
        <g>
          <rect x="3" y="6" width="12" height="12" rx="1" fill={CREAM} stroke={INK} strokeWidth="1.2" />
          <path d="M14 12 H21 M18 9 L21 12 L18 15" {...stroke} />
        </g>
      );
    case "alert":
      return (
        <g>
          <circle cx="12" cy="12" r="8" fill={ORANGE} />
          <path d="M12 8 V13" {...stroke} />
          <circle cx="12" cy="16" r="0.9" fill={INK} />
        </g>
      );
    case "lines":
      return (
        <g {...stroke}>
          <path d="M4 6 H20 M4 11 H16 M4 16 H18" />
        </g>
      );
    case "layers":
      return (
        <g>
          <polygon points="12,4 22,9 12,14 2,9" fill={CREAM} stroke={INK} strokeWidth="1" />
          <polygon points="12,9 22,14 12,19 2,14" fill={ORANGE} stroke={INK} strokeWidth="1" />
        </g>
      );
    case "router":
      return (
        <g>
          <rect x="3" y="10" width="18" height="8" rx="1.5" fill={ORANGE} />
          <path d="M8 10 V6 M12 10 V4 M16 10 V6" {...stroke} />
          <circle cx="7" cy="14" r="1" fill={CREAM} />
        </g>
      );
    case "counter":
      return (
        <g {...stroke}>
          <rect x="3" y="5" width="18" height="14" rx="2" fill={CREAM} />
          <path d="M12 8 V16 M8 12 H16" />
        </g>
      );
    case "cards":
      return (
        <g>
          <rect x="6" y="3" width="14" height="16" rx="1.5" fill={MID} />
          <rect x="3" y="6" width="14" height="16" rx="1.5" fill={CREAM} stroke={INK} strokeWidth="1.1" />
        </g>
      );
    case "boxes":
      return (
        <g>
          <rect x="3" y="12" width="8" height="8" fill={ORANGE} />
          <rect x="12" y="8" width="8" height="12" fill={MID} />
        </g>
      );
    case "exchange":
      return (
        <g>
          <path d="M4 8 H18 L15 5 M20 16 H6 L9 19" {...stroke} />
        </g>
      );
    case "coin":
      return (
        <g>
          <circle cx="12" cy="12" r="8" fill={ORANGE} />
          <circle cx="12" cy="12" r="4" fill="none" stroke={CREAM} strokeWidth="1.4" />
        </g>
      );
    case "window":
      return (
        <g {...stroke}>
          <rect x="3" y="4" width="18" height="16" rx="1.5" fill={CREAM} />
          <path d="M3 9 H21 M12 9 V20" />
        </g>
      );
    case "check":
      return (
        <g>
          <circle cx="12" cy="12" r="8" fill={ORANGE} />
          <path d="M8 12 L11 15 L16 9" {...stroke} stroke={CREAM} />
        </g>
      );
    case "books":
      return (
        <g>
          <rect x="4" y="5" width="5" height="14" fill={DEEP} />
          <rect x="10" y="5" width="5" height="14" fill={ORANGE} />
          <rect x="16" y="5" width="4" height="14" fill={CREAM} stroke={INK} strokeWidth="1" />
        </g>
      );
    case "disk":
      return (
        <g>
          <rect x="4" y="3" width="16" height="18" rx="1" fill={ORANGE} />
          <rect x="7" y="3" width="10" height="6" fill={CREAM} />
          <rect x="8" y="13" width="8" height="5" fill={INK} />
        </g>
      );
    case "menu":
      return (
        <g {...stroke}>
          <path d="M4 7 H20 M4 12 H20 M4 17 H14" />
        </g>
      );
    case "brackets":
      return <path d="M9 4 H5 V20 H9 M15 4 H19 V20 H15" {...stroke} />;
    case "leaf":
      return <path d="M6 18 C6 8 14 4 20 4 C20 12 14 20 6 18 Z" fill="#7dae62" />;
    case "ballot":
      return (
        <g>
          <rect x="4" y="3" width="16" height="18" rx="1" fill={CREAM} stroke={INK} strokeWidth="1.2" />
          <path d="M8 10 L11 13 L16 7" {...stroke} />
        </g>
      );
    case "hex":
      return (
        <g {...stroke}>
          <polygon points="12,3 20,8 20,16 12,21 4,16 4,8" fill={CREAM} />
          <path d="M9 12 H15 M12 9 V15" />
        </g>
      );
    case "nest":
      return (
        <g {...stroke}>
          <rect x="3" y="3" width="18" height="18" rx="1" fill={CREAM} />
          <rect x="7" y="7" width="10" height="10" fill={ORANGE} />
        </g>
      );
    case "note":
      return (
        <g>
          <circle cx="8" cy="17" r="3" fill={ORANGE} />
          <path d="M11 17 V5 L19 3 V15" {...stroke} />
          <circle cx="16" cy="15" r="3" fill={MID} />
        </g>
      );
    case "gamepad":
      return (
        <g>
          <rect x="2" y="7" width="20" height="11" rx="5" fill={ORANGE} />
          <path d="M7 12 H11 M9 10 V14" {...stroke} />
          <circle cx="16" cy="11" r="1" fill={INK} />
          <circle cx="18" cy="14" r="1" fill={INK} />
        </g>
      );
    case "spark":
      return <polygon points="12,2 14,10 22,12 14,14 12,22 10,14 2,12 10,10" fill={ORANGE} />;
    case "trophy":
      return (
        <g>
          <path d="M8 4 H16 V10 A4 4 0 0 1 8 10 Z" fill={ORANGE} />
          <path d="M8 6 H5 V8 A3 3 0 0 0 8 11 M16 6 H19 V8 A3 3 0 0 1 16 11" {...stroke} />
          <path d="M12 14 V18 M8 20 H16" {...stroke} />
        </g>
      );
    case "merge":
      return (
        <g>
          <path d="M5 6 H12 L18 12 L12 18 H5" {...stroke} />
          <polygon points="16,9 22,12 16,15" fill={ORANGE} />
        </g>
      );
    case "speech":
      return <path d="M4 4 H20 V16 H10 L6 20 V16 H4 Z" fill={CREAM} stroke={INK} strokeWidth="1.3" />;
    case "crest":
      return (
        <g>
          <circle cx="12" cy="12" r="8" fill={ORANGE} />
          <circle cx="12" cy="12" r="3" fill={CREAM} />
          <path d="M12 4 V8 M12 16 V20" {...stroke} />
        </g>
      );
    case "swords":
      return <path d="M5 19 L19 5 M15 5 H19 V9 M5 15 L9 19 M8 5 L5 8 M16 19 L19 16" {...stroke} />;
    case "scroll":
      return (
        <g>
          <path d="M6 5 H18 V19 H8 A2 2 0 0 1 6 17 Z" fill={CREAM} stroke={INK} strokeWidth="1.2" />
          <path d="M6 5 V7 A2 2 0 0 0 8 5" {...stroke} />
        </g>
      );
    case "bars":
      return (
        <g>
          <rect x="3" y="14" width="4" height="6" fill={DEEP} />
          <rect x="10" y="8" width="4" height="12" fill={ORANGE} />
          <rect x="17" y="4" width="4" height="16" fill={MID} />
        </g>
      );
    case "gate":
      return (
        <g {...stroke}>
          <path d="M4 8 H10 A6 6 0 0 1 10 16 H4 M14 6 V18 M18 6 V18" />
        </g>
      );
    case "hourglass":
      return <path d="M6 4 H18 L12 12 L18 20 H6 L12 12 Z" fill={ORANGE} />;
    case "struct":
      return <path d="M8 5 H4 V19 H8 M9 12 H15 M16 5 H20 V19 H16" {...stroke} />;
    case "braces":
      return <path d="M9 4 H7 Q4 4 4 8 V10 Q4 12 2 12 Q4 12 4 14 V16 Q4 20 7 20 H9 M15 4 H17 Q20 4 20 8 V10 Q20 12 22 12 Q20 12 20 14 V16 Q20 20 17 20 H15" {...stroke} />;
    case "hash":
      return <path d="M9 4 L7 20 M17 4 L15 20 M4 9 H20 M4 15 H20" {...stroke} />;
    case "equals":
      return <path d="M5 9 H19 M5 15 H19" {...stroke} />;
    case "grid":
      return (
        <g {...stroke}>
          <rect x="3" y="3" width="18" height="18" fill={CREAM} />
          <path d="M3 9 H21 M3 15 H21 M9 3 V21 M15 3 V21" />
        </g>
      );
    case "row":
      return (
        <g>
          <rect x="2" y="8" width="6" height="8" fill={DEEP} />
          <rect x="9" y="8" width="6" height="8" fill={ORANGE} />
          <rect x="16" y="8" width="6" height="8" fill={MID} />
        </g>
      );
    case "key":
      return (
        <g {...stroke}>
          <circle cx="8" cy="10" r="4" fill={CREAM} />
          <path d="M12 10 H21 M18 10 V13 M21 10 V14" />
        </g>
      );
    default:
      return <circle cx="12" cy="12" r="6" fill={ORANGE} />;
  }
}

export function SheetBadgeFox({
  courseId,
  title,
  earned = true,
  size = 72,
  className = "",
}: {
  courseId: string;
  title?: string;
  earned?: boolean;
  size?: number;
  className?: string;
}) {
  const art = sheetFoxArt(courseId);
  const name = title?.trim() || "fiche";
  const label = earned ? `Badge ${name}` : `Badge ${name}, pas encore obtenu`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={label}
      className={`${earned ? "shrink-0" : "shrink-0 opacity-60 grayscale"} ${className}`}
    >
      <Scene scene={art.scene} />
      <g transform="translate(4 16) scale(0.86)">
        <FoxPose pose={art.pose} />
      </g>
      <g transform="translate(86 82)">
        <circle r="16" fill={CREAM} stroke={INK} strokeWidth="1.4" />
        <g transform="translate(-12 -12)">
          <Glyph prop={art.prop} />
        </g>
      </g>
    </svg>
  );
}
