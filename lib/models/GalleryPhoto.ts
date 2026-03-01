import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryPhoto extends Document {
  cloudinaryUrl: string;
  publicId: string;
  caption: string;
  section: 'gallery' | 'about' | 'home';
  createdAt: Date;
}

const GalleryPhotoSchema = new Schema<IGalleryPhoto>(
  {
    cloudinaryUrl: { type: String, required: true },
    publicId:      { type: String, required: true },
    caption:       { type: String, default: '' },
    section:       { type: String, enum: ['gallery', 'about', 'home'], default: 'gallery' },
  },
  { timestamps: true }
);

const GalleryPhoto: Model<IGalleryPhoto> =
  mongoose.models.GalleryPhoto ??
  mongoose.model<IGalleryPhoto>('GalleryPhoto', GalleryPhotoSchema);

export default GalleryPhoto;
