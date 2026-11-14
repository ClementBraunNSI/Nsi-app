import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Backpack,
  Building2,
  Compass,
  Contrast,
  EyeOff,
  Globe,
  GraduationCap,
  KeyRound,
  Landmark,
  Library,
  Mail,
  MapPin,
  Sailboat,
  School,
  Server,
  Trees,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import { FoxHead } from '@/components/ui/FoxHead';
import { AnimatedFox } from '@/components/home/AnimatedFox';
import { GAME_NAME } from '@/app/foxtest/academy/meta';
import { getNsiLevel } from '@/lib/nsi-levels';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'Clément Braun, enseignant NSI',
  description:
    'Clément Braun, enseignant certifié de NSI, propose des cours et des exercices de Python et de SQL pour la SNT, la Première et la Terminale.',
  alternates: {
    canonical: '/a-propos',
  },
};

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: 'https://www.clementbraun.info/a-propos',
  mainEntity: {
    '@type': 'Person',
    name: 'Clément Braun',
    jobTitle: 'Enseignant de NSI',
    url: 'https://www.clementbraun.info',
  },
};

const MAIL = 'clementbraun@ac-lille.fr';

/** Les trois niveaux cités sur la page, dans l'ordre du lycée. Le premier prend toute la largeur. */
const LEVELS = ['1', '2', '3'].map((folder) => getNsiLevel(folder));

const STEPS = [
  {
    title: 'Lire le cours',
    text: 'Les cours sont rangés par niveau, puis par chapitre. Ceux qui sont publics se lisent sans compte.',
  },
  {
    title: 'Écrire le code',
    text: 'Les exercices se font dans la page. Python tourne dans le navigateur, sans rien installer, et la correction est automatique.',
  },
  {
    title: 'Valider la fiche',
    text: "Une fiche validée rapporte un badge. Une fois connecté, l'élève retrouve sa progression et ses devoirs dans son espace.",
  },
];

const CONTRIBUTORS: { name: string; role: string; avatar: ReactNode; desc: string; main?: boolean }[] = [
  { name: 'Clément Braun', role: 'Auteur principal', avatar: <FoxHead size={30} />, desc: 'Enseignant NSI et concepteur de la plateforme.', main: true },
  { name: 'Nicolas DELPLACE', role: "Lycée de l'Escaut", avatar: <Building2 size={24} />, desc: "Enseignant d'informatique à Valenciennes." },
  { name: 'Stéphane RAMSTEIN', role: 'Lycée Raymond Queneau', avatar: <Library size={24} />, desc: "Enseignant d'informatique à Villeneuve-d'Ascq." },
  { name: 'Benoit PAPEGAY', role: 'Université de Lille', avatar: <GraduationCap size={24} />, desc: 'Enseignant-chercheur et contributeur pédagogique.' },
  { name: 'Mathieu MARCHAND', role: 'Lycée Benjamin Franklin', avatar: <Waves size={24} />, desc: "Enseignant d'informatique à Auray." },
];

type TimelineStep = {
  year: string;
  icon: LucideIcon;
  subject: string;
  current?: boolean;
  establishments: { place: string; city: string }[];
};

/** Du premier poste au poste actuel : le chemin se lit de gauche à droite, puis de haut en bas sur téléphone. */
const TIMELINE: TimelineStep[] = [
  {
    year: '2021 - 2022',
    icon: Backpack,
    subject: 'SNT / NSI',
    establishments: [{ place: 'Lycée Louis Pasteur', city: 'Hénin-Beaumont (62)' }],
  },
  {
    year: '2022 - 2024',
    icon: Landmark,
    subject: 'SNT / NSI',
    establishments: [{ place: 'Lycée Raymond Queneau', city: "Villeneuve-d'Ascq (59)" }],
  },
  {
    year: '2024 - 2025',
    icon: Sailboat,
    subject: 'SNT / NSI',
    establishments: [
      { place: 'Lycée Charles de Gaulle', city: 'Vannes (56)' },
      { place: 'Lycée Benjamin Franklin', city: 'Auray (56)' },
    ],
  },
  {
    year: '2025 - 2026',
    icon: School,
    subject: 'SNT / BTS SIO',
    establishments: [
      { place: 'Lycée Paul Duez', city: 'Cambrai (59)' },
      { place: 'Lycée Henri Wallon', city: 'Valenciennes (59)' },
      { place: 'Lycée Montebello', city: 'Lille (59)' },
    ],
  },
  {
    year: '2026 - 2027',
    icon: Compass,
    subject: 'SNT / NSI',
    current: true,
    establishments: [{ place: 'Lycée Yves Kernanec', city: 'Marcq-en-Barœul (59)' }],
  },
];

function Kicker({ num, children }: { num: string; children: ReactNode }) {
  return (
    <p className={styles.kicker}>
      <span className={styles.num} aria-hidden="true">
        {num}
      </span>
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <div className={`${styles.page} font-sans selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }} />
      <button
        type="button"
        data-fox-easter-id="apropos"
        aria-label="Secret renard a propos"
        className="fox-secret-spot absolute top-28 right-8 z-20"
      />

      <div className={styles.wrap}>
        {/* Qui parle */}
        <header className={styles.hero}>
          <div className="min-w-0">
            <span className={styles.chip}>
              <GraduationCap size={14} aria-hidden /> Certifié de NSI, TZR
            </span>
            <h1 className={styles.title}>
              Clément <em>Braun</em>
              <span className={styles.titleSub}>Enseignant de NSI</span>
            </h1>
            <p className={styles.lead}>
              Bonjour à tous. Je suis <strong>enseignant certifié de sciences informatiques</strong> dans l'académie de Lille,
              passionné d'informatique, de programmation et des nouvelles technologies.
            </p>
            <p className={styles.lead}>
              La tanière du code est le site de mes cours. Cette page raconte à quoi il sert, comment il s'utilise et pourquoi
              sa mascotte est un renard.
            </p>
            <div className={styles.actions}>
              <a href="#contact" className={styles.btn}>
                <Mail size={18} aria-hidden /> Me contacter
              </a>
              <Link href="/" className={styles.btnGhost}>
                Voir les cours <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>

          <div className={styles.stage}>
            <span className={styles.stageNote}>
              La mascotte de la tanière
              <small>malin, curieux, attaché à son groupe</small>
            </span>
            <AnimatedFox className={styles.stageFox} />
          </div>
        </header>

        <main>
          {/* 01. Pourquoi le site existe */}
          <section className={styles.chapter} aria-labelledby="pourquoi">
            <div className={styles.chapterHead}>
              <div>
                <Kicker num="01">Le point de départ</Kicker>
                <h2 id="pourquoi" className={styles.h2}>
                  Un site fait d'abord pour mes classes
                </h2>
              </div>
            </div>
            <div className={styles.bento}>
              <div className={`${styles.tile} ${styles.span5} ${styles.why}`}>
                <p className={styles.text}>
                  Ce site est d'abord destiné à <strong>mes classes</strong>. Il contient toutes les ressources nécessaires à la
                  réussite des élèves en <strong>seconde, première et terminale</strong>, et plus encore.
                </p>
                <p className={styles.text}>
                  La <strong>SNT</strong> s'adresse à tous les élèves de seconde.
                </p>
                <p className={styles.text}>
                  La <strong>NSI</strong> est la spécialité de Première et de Terminale.
                </p>
              </div>
              <nav aria-label="Niveaux" className={styles.levels}>
                {LEVELS.map((level, index) => (
                  <Link
                    key={level.folder}
                    href={`/cours/${level.urlSlug}`}
                    data-level={level.folder}
                    className={`${styles.level} ${index === 0 ? styles.levelWide : ''}`}
                  >
                    <div className={styles.levelTxt}>
                      <span className={styles.levelAud}>{level.audience}</span>
                      <h3>{level.label}</h3>
                      <span className={styles.levelDesc}>{level.description}</span>
                      <span className={styles.levelGo}>
                        Voir les cours <ArrowRight size={13} aria-hidden />
                      </span>
                    </div>
                    <span className={styles.levelPlate}>
                      <Image src={level.image} alt="" width={240} height={240} />
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </section>

          {/* 02. Comment un élève s'en sert */}
          <section className={styles.chapter} aria-labelledby="usage">
            <div className={styles.chapterHead}>
              <div>
                <Kicker num="02">En pratique</Kicker>
                <h2 id="usage" className={styles.h2}>
                  Lire le cours, écrire le code, valider la fiche
                </h2>
                <p className={styles.sub}>Une fiche se travaille en trois temps. Deux jeux permettent de s'entraîner autrement.</p>
              </div>
            </div>
            <div className={styles.bento}>
              {STEPS.map((step, index) => (
                <div key={step.title} className={`${styles.tile} ${styles.step}`}>
                  <span className={styles.stepNum} aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
              <Link href="/academie" className={`${styles.tile} ${styles.span6} ${styles.play}`}>
                <span className={styles.playPic}>
                  <Image src="/images/fox_act.png" alt="" width={92} height={92} />
                </span>
                <div className="min-w-0">
                  <span className={styles.eyebrow}>Apprentissage Python</span>
                  <b>{GAME_NAME}</b>
                  <p>Fonctions, variables, conditions et boucles : le renard doit rejoindre la poule.</p>
                  <span className={styles.playLink}>
                    Jouer <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </Link>
              <Link href="/enquetes" className={`${styles.tile} ${styles.span6} ${styles.play}`}>
                <span className={styles.playPic}>
                  <Image src="/images/fox_enquetes.svg" alt="" width={98} height={92} />
                </span>
                <div className="min-w-0">
                  <span className={styles.eyebrow}>Blocs, Python ou SQL</span>
                  <b>Enquêtes de la forêt</b>
                  <p>Des registres à fouiller et des témoignages à croiser pour démasquer les coupables.</p>
                  <span className={styles.playLink}>
                    Enquêter <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {/* 03. Ce qui le distingue */}
          <section className={styles.chapter} aria-labelledby="choix">
            <div className={styles.chapterHead}>
              <div>
                <Kicker num="03">Ce qui le distingue</Kicker>
                <h2 id="choix" className={styles.h2}>
                  Pas de publicité, pas de mesure d'audience
                </h2>
              </div>
            </div>
            <div className={styles.bento}>
              <div className={styles.tile}>
                <span className={styles.tileIcon}>
                  <EyeOff size={20} aria-hidden />
                </span>
                <h3>Aucun pistage</h3>
                <p>
                  Pas de mesure d'audience, pas de publicité, pas de bouton de réseau social. Sans connexion à un compte, aucun
                  cookie n'est déposé.
                </p>
                <Link href="/mentions-legales#cookies" className={styles.inlineLink}>
                  Le détail dans les mentions légales <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
              <div className={styles.tile}>
                <span className={styles.tileIcon}>
                  <Server size={20} aria-hidden />
                </span>
                <h3>Tout vient du site</h3>
                <p>Les polices de caractères, l'éditeur de code, Python et ses modules sont servis par le site lui-même.</p>
              </div>
              <div className={styles.tile}>
                <span className={styles.tileIcon}>
                  <Contrast size={20} aria-hidden />
                </span>
                <h3>Un affichage réglable</h3>
                <p>Mode sombre, contraste élevé, police adaptée à la dyslexie : les réglages sont dans l'en-tête de chaque page.</p>
              </div>
              <div className={`${styles.tile} ${styles.span7}`}>
                <span className={styles.tileIcon}>
                  <KeyRound size={20} aria-hidden />
                </span>
                <h3>Des comptes créés par l'enseignant</h3>
                <p>
                  Il n'y a pas d'inscription libre. Un compte tient en un prénom, une adresse e-mail et un mot de passe. Les
                  données personnelles des classes sont supprimées à la fin de l'année scolaire.
                </p>
              </div>
              <div className={`${styles.tile} ${styles.span5} ${styles.bug}`}>
                <Image src="/images/fox_bug.png" alt="" width={120} height={111} />
                <div>
                  <h3>Un bug ?</h3>
                  <p>Un élève connecté peut le signaler depuis l'accueil, capture d'écran à l'appui.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 04. Le renard : le bloc vert est celui de l'ancienne page, texte inchangé */}
          <section className={styles.chapter} aria-labelledby="renard">
            <div className={styles.chapterHead}>
              <div>
                <Kicker num="04">La mascotte</Kicker>
              </div>
            </div>
            <div className={styles.bento}>
              <div className={`${styles.tile} ${styles.mascot}`}>
                <div className={styles.mascotPic}>
                  <Image src="/images/fox_0.png" alt="Deux renards endormis côte à côte" width={420} height={420} />
                </div>
                <div>
                  <h3>Malin, curieux, attaché à son groupe</h3>
                  <p>
                    Certains se demanderont pourquoi j'ai choisi le renard comme mascotte. C'est un animal intelligent, malin et
                    très curieux. C'est aussi un animal attaché à son groupe lorsque les ressources sont abondantes.
                  </p>
                  <p className="mt-3">
                    Le choix a donc été une évidence : comme les ressources sont nombreuses, chacun peut progresser et réussir,
                    en misant sur l'entraide et la solidarité.
                  </p>
                </div>
              </div>
              <div className={styles.green}>
                <div className={styles.greenBody}>
                  <div className={styles.greenKicker}>
                    <Trees size={24} aria-hidden /> Écosystème & Engagement
                  </div>
                  <h2 id="renard" className={styles.greenTitle}>
                    Pourquoi un <em>renard</em> ?
                  </h2>
                  <p className={styles.greenText}>
                    Le renard a été choisi pour son intelligence et sa capacité d'adaptation, deux qualités utiles en
                    informatique, et parce qu'il <strong>fédère</strong> facilement.
                  </p>
                  <p className={styles.greenText}>
                    Il rappelle aussi notre lien avec la nature. À travers ce thème, je souhaite rappeler l'importance de la{' '}
                    <strong>préservation de la biodiversité</strong>, car les sciences numériques aident aussi à comprendre le
                    monde qui nous entoure et à le protéger.
                  </p>
                </div>
                <div className={styles.greenGlobe} aria-hidden="true">
                  <Globe size={420} />
                </div>
              </div>
            </div>
          </section>

          {/* 05. Le parcours */}
          <section className={styles.chapter} aria-labelledby="itineraire">
            <div className={styles.chapterHead}>
              <div>
                <Kicker num="05">Le parcours</Kicker>
                <h2 id="itineraire" className={styles.h2}>
                  L'itinéraire du renard
                </h2>
                <p className={styles.sub}>
                  Parcours d'enseignant de NSI, entre terrils, métropole et océan. TZR, titulaire sur zone de remplacement : le
                  lycée change presque à chaque rentrée.
                </p>
              </div>
              <Image src="/images/fox_3_mark.png" alt="" width={190} height={103} className={styles.trailFox} />
            </div>
            <ol className={styles.trail}>
              {TIMELINE.map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.year} className={`${styles.stop} ${step.current ? styles.stopNow : ''}`}>
                    <div className={styles.stopTop}>
                      <span className={styles.stopYear}>{step.year}</span>
                      <Icon size={18} aria-hidden />
                    </div>
                    <p className={styles.stopSubject}>
                      {step.subject}
                      {step.establishments.length > 1 ? `, ${step.establishments.length} établissements` : ''}
                      {step.current ? <span className={styles.now}>en poste</span> : null}
                    </p>
                    <ul className={styles.places}>
                      {step.establishments.map((establishment) => (
                        <li key={establishment.place} className={styles.place}>
                          <b>{establishment.place}</b>
                          <span>
                            <MapPin size={13} aria-hidden /> {establishment.city}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* 06. Les collègues */}
          <section className={styles.chapter} aria-labelledby="collegues">
            <div className={styles.chapterHead}>
              <div>
                <Kicker num="06">Les collègues</Kicker>
                <h2 id="collegues" className={styles.h2}>
                  Une démarche collaborative
                </h2>
                <p className={styles.quote}>« Seul on va plus vite, ensemble on va plus loin. »</p>
                <p className={styles.sub}>
                  Ce projet mutualise les travaux de collègues passionnés rencontrés au fil de mon parcours.
                </p>
              </div>
            </div>
            <div className={styles.people}>
              {CONTRIBUTORS.map((person) => (
                <div key={person.name} className={`${styles.person} ${person.main ? styles.personMain : ''}`}>
                  <div className={styles.avatar}>{person.avatar}</div>
                  <h3>{person.name}</h3>
                  <p className={styles.personRole}>{person.role}</p>
                  <p className={styles.personDesc}>{person.desc}</p>
                </div>
              ))}
            </div>
            <div className={styles.others}>
              <p>À côté de ce projet, d'autres enseignants de SNT et de NSI publient leurs propres cours.</p>
              <Link href="/autres-cours-nsi" className={styles.inlineLink}>
                Voir les autres cours NSI <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </section>

          {/* 07. Écrire */}
          <section id="contact" className={styles.chapter} aria-labelledby="ecrire">
            <div className={styles.contact}>
              <div className="min-w-0">
                <Kicker num="07">Mail professionnel</Kicker>
                <h2 id="ecrire" className={styles.h2}>
                  Pour m'écrire
                </h2>
                <p className={styles.text}>Un élève de mes classes, un parent ou un collègue peut m'écrire.</p>
                <p className={styles.mail}>{MAIL}</p>
                <a href={`mailto:${MAIL}`} className={styles.btn}>
                  <Mail size={20} aria-hidden /> Me contacter par mail
                </a>
              </div>
              <Image src="/images/fox_1.png" alt="" width={190} height={190} className={styles.contactFox} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
