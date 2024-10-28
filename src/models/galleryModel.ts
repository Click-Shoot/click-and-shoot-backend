// models/galleryModel.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IGallery extends Document {
  photographId: mongoose.Types.ObjectId;
  urls: string[]; // Tableau d'URLs pour plusieurs images
}

const GallerySchema = new Schema({
  photographId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  urls: [{ type: String, required: true }], // Tableau d'URLs
});

export const GalleryModel = mongoose.model<IGallery>('Gallery', GallerySchema);