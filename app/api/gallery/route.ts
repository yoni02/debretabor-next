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

export async function GET() {
  await connectDB();
  const photos = await GalleryPhoto.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const caption = (formData.get('caption') as string) || '';
  const section = (formData.get('section') as string) || 'gallery';

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'debretabor', resource_type: 'image' },
      (err, result) => {
        if (err || !result) reject(err);
        else resolve(result as { secure_url: string; public_id: string });
      }
    ).end(buffer);
  });

  await connectDB();
  const photo = await GalleryPhoto.create({
    cloudinaryUrl: uploadResult.secure_url,
    publicId:      uploadResult.public_id,
    caption,
    section,
  });

  return NextResponse.json(photo, { status: 201 });
}
