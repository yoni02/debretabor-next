import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'The Seven Sacraments' };

const SACRAMENTS = [
  {
    number: 1,
    name: 'Baptism',
    ge_ez: 'Timket — ጥምቀት',
    icon: 'fa-water',
    color: 'eth-lapis',
    description:
      'Baptism is full immersion in water performed three times in the name of the Holy Trinity. It cleanses original sin, unites the believer with Christ\'s death and resurrection, and initiates them as a member of the Church.',
    prepare: [
      'Bring a godfather and godmother who are baptized Orthodox Christians.',
      'Prepare white garments to be worn after baptism as a sign of purity.',
      'Parents and godparents should fast and pray in the days before the ceremony.',
      'Speak with the priest to schedule the baptism and receive full guidance.',
    ],
  },
  {
    number: 2,
    name: 'Chrismation',
    ge_ez: 'Qidus Meron — ቅዱስ ሜሮን',
    icon: 'fa-oil-can',
    color: 'eth-malachite',
    description:
      'Received immediately after Baptism, Chrismation is the anointing of the newly baptized with consecrated holy oil (Meron). It bestows the gift of the Holy Spirit, completing initiation into the Church and sealing the believer as a temple of God.',
    prepare: [
      'Chrismation is administered directly after Baptism — no separate appointment is needed.',
      'The holy Meron is prepared and blessed by the Patriarch of the Ethiopian Orthodox Church.',
      'Approach this mystery with reverence and gratitude for the gift of the Holy Spirit.',
    ],
  },
  {
    number: 3,
    name: 'Holy Eucharist',
    ge_ez: 'Qidus Qurban — ቅዱስ ቁርባን',
    icon: 'fa-bread-slice',
    color: 'eth-crimson',
    description:
      'The Eucharist is the center of the Divine Liturgy. The bread and wine become the true Body and Blood of our Lord Jesus Christ. Receiving Communion unites the faithful with Christ and one another in the one Body of the Church.',
    prepare: [
      'Fast from all food and drink from midnight until after you receive Communion.',
      'Confess your sins to a priest before receiving — Confession is required.',
      'Attend the full Divine Liturgy from the beginning, not just the Communion portion.',
      'Women should cover their heads; men should wear a netela.',
    ],
  },
  {
    number: 4,
    name: 'Confession',
    ge_ez: 'Nuzaze — ኑዛዜ',
    icon: 'fa-hands-praying',
    color: 'eth-ochre',
    description:
      'Confession is the sacrament by which sins committed after Baptism are forgiven through the priest, who acts as a witness and minister of God\'s mercy. It is required before receiving Holy Communion and restores the soul to the grace of God.',
    prepare: [
      'Examine your conscience honestly, recalling sins of thought, word, and deed.',
      'Approach the priest with sincerity, naming your sins without minimizing them.',
      'Express genuine sorrow and the firm intention to amend your life.',
      'Accept and fulfill the penance or guidance the priest gives you.',
    ],
  },
  {
    number: 5,
    name: 'Holy Orders',
    ge_ez: 'Kihnet — ክህነት',
    icon: 'fa-cross',
    color: 'eth-lapis',
    description:
      'Holy Orders is the sacrament by which men are ordained as deacons, priests, or bishops to serve the Church. Through the laying on of hands by a bishop, the ordained receives the grace to teach, sanctify, and shepherd the people of God.',
    prepare: [
      'Ordination requires extensive theological formation and study of the scriptures and canons.',
      'A candidate must be living a holy and blameless life, approved by the Church.',
      'Marriage (if desired) must take place before ordination to the priesthood.',
      'Speak with your priest or bishop if you believe God is calling you to holy orders.',
    ],
  },
  {
    number: 6,
    name: 'Holy Matrimony',
    ge_ez: 'Gabcha — ጋብቻ',
    icon: 'fa-ring',
    color: 'eth-malachite',
    description:
      'Marriage is the sacred union of a man and woman, blessed and sealed by God before the Church. It reflects the union of Christ with His Church and calls spouses to love, fidelity, and the raising of children in the Orthodox faith.',
    prepare: [
      'Contact the priest several months in advance to begin pre-marital preparation.',
      'Both spouses must be baptized members of the Ethiopian Orthodox Church.',
      'Complete the pre-marital counseling sessions with the priest.',
      'Both parties should go to Confession and receive Communion before the wedding.',
    ],
  },
  {
    number: 7,
    name: 'Anointing of the Sick',
    ge_ez: "Qib'a Qidusan — ቅብዐ ቅዱሳን",
    icon: 'fa-hand-holding-medical',
    color: 'eth-crimson',
    description:
      'Anointing of the Sick is the sacrament of healing in which a priest anoints the ill with holy oil and prays for the restoration of body and soul. It forgives sins and brings comfort, strength, and — if God wills — physical healing.',
    prepare: [
      'Contact the priest as soon as a serious illness arises — do not wait until the last moment.',
      'If possible, the sick person should confess and receive Holy Communion beforehand.',
      'Family and loved ones are encouraged to gather and pray together during the anointing.',
      'Approach this mystery with faith and trust in God\'s mercy and will.',
    ],
  },
];

const COLOR_MAP: Record<string, string> = {
  'eth-lapis':     '#1A3478',
  'eth-malachite': '#1C5526',
  'eth-crimson':   '#7A1818',
  'eth-ochre':     '#7A4A08',
};

export default function SacramentsPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>The Seven Sacraments</h1>
        <p>The holy mysteries of the Ethiopian Orthodox Tewahedo Church</p>
      </div>

      <div className="sacraments-intro content-section">
        <p>
          The Ethiopian Orthodox Tewahedo Church recognizes seven holy Sacraments — called
          <em> Mysteries</em> (ምሥጢራት) — through which God bestows grace upon His people.
          Each sacrament is a sacred encounter with the living Christ, uniting us more deeply
          to Him and to the Body of the Church.
        </p>
      </div>

      <div className="sacraments-grid">
        {SACRAMENTS.map((s) => (
          <div className="sacrament-card" key={s.number}>
            <div className="sacrament-header">
              <div
                className="sacrament-icon"
                style={{ background: COLOR_MAP[s.color] }}
              >
                <i className={`fas ${s.icon}`}></i>
              </div>
              <div className="sacrament-title-block">
                <span className="sacrament-number">Sacrament {s.number}</span>
                <h2 className="sacrament-name">{s.name}</h2>
                <span className="sacrament-ge_ez">{s.ge_ez}</span>
              </div>
            </div>

            <p className="sacrament-description">{s.description}</p>

            <div className="sacrament-prepare">
              <h3><i className="fas fa-list-check"></i> How to Prepare</h3>
              <ul>
                {s.prepare.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="content-section sacraments-closing">
        <p>
          For questions about any of the sacraments or to schedule one, please{' '}
          <a href="/contact" className="address-link">contact us</a> or speak with
          the priest after Sunday Liturgy.
        </p>
      </div>
    </>
  );
}
