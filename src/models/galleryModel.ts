import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './userModel'; 

// Interface TypeScript pour la galerie
export interface IGallery extends Document {
  urls: string[]
  idPhotograph: IUser['_id'];

}

// Schéma Mongoose pour la galerie
const gallerySchema: Schema = new Schema({
  urls: { type: [String], required: true }, 
  idPhotograph: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

export const GalleryModel = mongoose.model<IGallery>('Gallery', gallerySchema)
