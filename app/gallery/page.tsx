import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';
import GalleryLive from '@/components/GalleryLive';

export const metadata: Metadata = { title: 'Photo Gallery' };

export default function GalleryPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Photo Gallery</h1>
        <p>Moments from our church community</p>
      </div>
      <GalleryLive />
    </>
  );
}
