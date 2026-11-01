/**
 * Schéma du modèle de von Neumann pour le cours (content/2/archi_von_neumann.md) : <VonNeumann />.
 * Processeur, mémoire (instructions et données côte à côte) et entrées-sorties reliés par les trois bus.
 * SVG rendu côté serveur ; les couleurs suivent le thème clair ou sombre (classes vn-* de globals.css).
 */

const MEMORY = [
  { address: "0", content: "CHARGER [4]", kind: "instruction" },
  { address: "1", content: "AJOUTER [5]", kind: "instruction" },
  { address: "2", content: "RANGER [4]", kind: "instruction" },
  { address: "3", content: "STOP", kind: "instruction" },
  { address: "4", content: "12", kind: "donnée" },
  { address: "5", content: "30", kind: "donnée" },
] as const;

const BUSES = [
  { name: "Bus d'adresses", note: "où lire ou écrire", y: 262, className: "vn-bus-address" },
  { name: "Bus de données", note: "les valeurs", y: 288, className: "vn-bus-data" },
  { name: "Bus de contrôle", note: "lecture, écriture, horloge", y: 314, className: "vn-bus-control" },
] as const;

/** Liaison verticale d'un bloc vers les trois bus, avec un point à chaque croisement. */
function Connector({ x, from, to }: { x: number; from: number; to: number }) {
  return (
    <g>
      <line x1={x} y1={from} x2={x} y2={to} className="vn-link" />
      {BUSES.map((bus) => (
        <circle key={bus.name} cx={x} cy={bus.y} r={4.5} className={`vn-dot ${bus.className}`} />
      ))}
    </g>
  );
}

export function VonNeumann() {
  return (
    <figure className="vn-figure">
      <svg
        viewBox="0 0 760 470"
        role="img"
        aria-labelledby="vn-title vn-desc"
        className="vn-diagram"
      >
        <title id="vn-title">Modèle de von Neumann</title>
        <desc id="vn-desc">
          Le processeur, formé de l&apos;unité de contrôle, de l&apos;unité arithmétique et logique et des registres,
          est relié à la mémoire et aux entrées-sorties par trois bus : adresses, données et contrôle. La mémoire
          contient à la fois les instructions du programme et les données.
        </desc>
        <defs>
          <marker id="vn-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="vn-arrowhead" />
          </marker>
        </defs>

        {/* Processeur */}
        <rect x={20} y={16} width={340} height={200} rx={16} className="vn-block vn-cpu" />
        <text x={40} y={44} className="vn-block-title">Processeur (CPU)</text>

        <rect x={40} y={60} width={135} height={66} rx={10} className="vn-part" />
        <text x={107.5} y={88} textAnchor="middle" className="vn-part-title">Unité de contrôle</text>
        <text x={107.5} y={108} textAnchor="middle" className="vn-part-note">décide et ordonne</text>

        <rect x={205} y={60} width={135} height={66} rx={10} className="vn-part" />
        <text x={272.5} y={88} textAnchor="middle" className="vn-part-title">UAL</text>
        <text x={272.5} y={108} textAnchor="middle" className="vn-part-note">calcule, compare</text>

        <line x1={177} y1={93} x2={203} y2={93} className="vn-inner" markerStart="url(#vn-arrow)" markerEnd="url(#vn-arrow)" />

        <rect x={40} y={146} width={300} height={52} rx={10} className="vn-part" />
        <text x={58} y={177} className="vn-part-title">Registres</text>
        {["R0", "R1", "R2", "R3"].map((name, index) => (
          <g key={name}>
            <rect x={148 + index * 47} y={158} width={40} height={28} rx={5} className="vn-cell" />
            <text x={168 + index * 47} y={177} textAnchor="middle" className="vn-cell-text">{name}</text>
          </g>
        ))}
        <line x1={107.5} y1={128} x2={107.5} y2={144} className="vn-inner" markerStart="url(#vn-arrow)" markerEnd="url(#vn-arrow)" />
        <line x1={272.5} y1={128} x2={272.5} y2={144} className="vn-inner" markerStart="url(#vn-arrow)" markerEnd="url(#vn-arrow)" />

        {/* Mémoire : programme enregistré, instructions et données au même endroit */}
        <rect x={400} y={16} width={340} height={200} rx={16} className="vn-block vn-memory" />
        <text x={420} y={44} className="vn-block-title">Mémoire (RAM)</text>
        <text x={720} y={44} textAnchor="end" className="vn-part-note">adresse · contenu</text>
        {MEMORY.map((cell, index) => {
          const y = 58 + index * 25;
          return (
            <g key={cell.address}>
              <rect x={420} y={y} width={300} height={21} rx={4} className={cell.kind === "instruction" ? "vn-row-instruction" : "vn-row-data"} />
              <text x={436} y={y + 15} textAnchor="middle" className="vn-address">{cell.address}</text>
              <text x={460} y={y + 15} className="vn-mono">{cell.content}</text>
              <text x={710} y={y + 15} textAnchor="end" className="vn-kind">{cell.kind}</text>
            </g>
          );
        })}

        {/* Les trois bus, partagés par tous les blocs */}
        {BUSES.map((bus) => (
          <g key={bus.name}>
            <line x1={20} y1={bus.y} x2={740} y2={bus.y} className={`vn-bus ${bus.className}`} />
            <text x={300} y={bus.y - 6} className={`vn-bus-label ${bus.className}`}>
              {bus.name} <tspan className="vn-bus-note">: {bus.note}</tspan>
            </text>
          </g>
        ))}

        <Connector x={190} from={216} to={360} />
        <Connector x={570} from={216} to={360} />

        {/* Entrées et sorties */}
        <rect x={20} y={360} width={340} height={88} rx={16} className="vn-block vn-io" />
        <text x={40} y={392} className="vn-block-title">Entrées</text>
        <text x={40} y={418} className="vn-part-note">clavier, souris, capteur, micro</text>
        <rect x={400} y={360} width={340} height={88} rx={16} className="vn-block vn-io" />
        <text x={420} y={392} className="vn-block-title">Sorties</text>
        <text x={420} y={418} className="vn-part-note">écran, imprimante, haut-parleur</text>
      </svg>
      <figcaption>
        Le processeur lit une à une les instructions rangées en mémoire, au milieu des données, en passant par les bus.
      </figcaption>
    </figure>
  );
}
