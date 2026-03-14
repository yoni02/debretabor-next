import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';
import GalleryWithFolders from '@/components/GalleryWithFolders';

export const metadata: Metadata = { title: 'Photo Gallery' };

export default function GalleryPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Photo Gallery</h1>
        <p>Moments from our church community</p>
      </div>
      <GalleryWithFolders />
    </>
  );
}
