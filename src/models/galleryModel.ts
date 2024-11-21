import mongoose, { Schema, Document } from 'mongoose';

interface IGallery extends Document {
  photographId: mongoose.Types.ObjectId;
  urls: string[]; 
}

const GallerySchema = new Schema({
  photographId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  urls: [{ type: String, required: true }], 
});

export const GalleryModel = mongoose.model<IGallery>('Gallery', GallerySchema);