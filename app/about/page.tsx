import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import AnimationsInit from '@/components/AnimationsInit';
import AboutHeroSlideshow from '@/components/AboutHeroSlideshow';

export const metadata: Metadata = { title: 'About Us' };

const SLIDES = [
  '/screenshot-s7.png',
  '/screenshot-s5.png',
  '/screenshot-s3.png',
  '/screenshot-s6.png',
  '/screenshot-s2.png',
];

export default function AboutPage() {
  return (
    <>
      <AnimationsInit />

      <AboutHeroSlideshow slides={SLIDES} />

      <div className="section-divider" aria-hidden="true">✦</div>

      <div className="about-split">
        <div className="about-split-img">
          <Image src="/screenshot-s9.png" alt="Ethiopian Orthodox icon of the Transfiguration, gold background" width={500} height={500} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
        </div>
        <div className="about-split-text">
          <h2>Our Mission</h2>
          <p>We gather to glorify the Holy Trinity, proclaim the Gospel, and serve our community with love and humility. Our worship flows from the unbroken apostolic tradition of the Ethiopian Orthodox Tewahedo Church — one of the oldest Christian communities in the world.</p>
          <p>Rooted in Scripture, the Holy Fathers, and the sacred liturgy, we strive to live as a community of prayer, sacrifice, and service — drawing all who seek God into the life of His Church.</p>
        </div>
      </div>

      <div className="section-divider" aria-hidden="true">✦</div>

      <div className="about-split about-split--reverse">
        <div className="about-split-text">
          <h2>Our Tradition</h2>
          <p>Our church stands in the line of the apostolic and patristic tradition, celebrating the Divine Liturgy, the Holy Mysteries, and the feasts and fasts of the Orthodox calendar. The Transfiguration of Christ — Debre Tabor, the Mountain of Light — is the mystery at the heart of our identity.</p>
          <p>Through the ancient chants, vestments, icons, and rites of the Tewahedo tradition, we participate in a living inheritance stretching back to the Apostles and to Ethiopia&apos;s own Saint Frumentius, Apostle of Ethiopia.</p>
        </div>
        <div className="about-split-img">
          <Image src="/screenshot-s8.png" alt="Ethiopian Orthodox icon of the Transfiguration of Christ" width={500} height={500} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
        </div>
      </div>

      <div className="section-divider" aria-hidden="true">✦</div>

      <section className="about-icons-section">
        <h2 className="about-icons-title">Sacred Icons</h2>
        <p className="about-icons-subtitle">Ethiopian Orthodox iconography — windows into the heavenly realm</p>
        <div className="about-icons-grid">
          <figure className="about-icon-frame">
            <Image src="/screenshot-s12.png" alt="Ethiopian Orthodox icon of the Holy Trinity" width={300} height={300} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            <figcaption>The Holy Trinity</figcaption>
          </figure>
          <figure className="about-icon-frame">
            <Image src="/screenshot-s11.png" alt="Ethiopian Orthodox icon of the Virgin Mary with Christ Child" width={300} height={300} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            <figcaption>Virgin Mary &amp; Christ as a Child</figcaption>
          </figure>
          <figure className="about-icon-frame">
            <Image src="/screenshot-s10.png" alt="Ethiopian Orthodox saint icon with golden halo" width={300} height={300} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            <figcaption>Ancient of Days God the Father</figcaption>
          </figure>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true">✦</div>

      <div className="about-church-feature">
        <div className="about-church-img">
          <Image src="/screenshot-s2.png" alt="Debre Tabor Holy God Father Church building at dusk" width={700} height={380} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
        </div>
        <div className="about-church-caption">
          <h2>Our Community</h2>
          <p>We welcome all who seek to encounter the presence of God in word, sacrament, and fellowship. Whether you are Ethiopian Orthodox, a curious visitor, or someone searching for the ancient faith — our doors are open.</p>
          <p>Located in Durham, NC, our parish is a spiritual home for our congregation and a witness to the broader community of the beauty of the Orthodox Christian life.</p>
          <Link href="/contact" className="btn btn-primary">Visit Us <i className="fas fa-arrow-right"></i></Link>
        </div>
      </div>
    </>
  );
}
