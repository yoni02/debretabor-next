import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';
import GalleryGrid from '@/components/GalleryGrid';

export const metadata: Metadata = { title: 'Photo Gallery' };

const STATIC_PHOTOS = [
  { src: '/screenshot-s12.png', caption: 'The Holy Trinity', alt: 'Ethiopian Orthodox icon of the Holy Trinity' },
  { src: '/screenshot-s11.png', caption: 'Virgin Mary & Christ Child', alt: 'Ethiopian Orthodox icon of the Theotokos with Christ Child' },
  { src: '/screenshot-s10.png', caption: 'Ancient of Days God the Father', alt: 'Depiction of Ancient of Days from Daniel 7:9-10' },
  { src: '/screenshot-s7.png', caption: 'Congregation Gathering', alt: 'Congregation gathered outside the church' },
  { src: '/screenshot-s2.png', caption: 'Our Church', alt: 'Debre Tabor Church building at dusk' },
  { src: '/screenshot-s5.png', caption: 'Sacred Procession', alt: 'Liturgical procession with priests carrying an icon' },
  { src: '/screenshot-s6.png', caption: 'Blessing Ceremony', alt: 'Clergy performing an outdoor blessing ceremony' },
  { src: '/screenshot-s3.png', caption: 'Choir & Deacons', alt: 'Deacons singing in white robes with ceremonial staffs' },
  { src: '/Choir1.JPG', caption: 'Choir Group', alt: 'Church choir members gathered in worship' },
  { src: '/Choir2.JPG', caption: 'Choir Group', alt: 'Choir singing during the Divine Liturgy' },
  { src: '/fellowship.png', caption: 'Fellowship After Liturgy', alt: 'Community gathering for fellowship after Sunday Liturgy' },
  { src: '/sundayschool.png', caption: 'Sunday School', alt: 'Sunday School students learning about the Orthodox faith' },
];

export default function GalleryPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Photo Gallery</h1>
        <p>Moments from our church community</p>
      </div>
      <GalleryGrid photos={STATIC_PHOTOS} />
    </>
  );
}
