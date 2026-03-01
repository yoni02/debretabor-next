import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import GalleryPhoto from '@/lib/models/GalleryPhoto';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const photo = await GalleryPhoto.findById(params.id);
  if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await cloudinary.uploader.destroy(photo.publicId);
  await photo.deleteOne();

  return NextResponse.json({ success: true });
}
