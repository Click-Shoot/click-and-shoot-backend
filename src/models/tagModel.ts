import mongoose, { Schema, Document } from 'mongoose';

// Interface TypeScript pour un tag
export interface ITag extends Document {
  label: string; // Libellé du tag
  image: string; // URL de l'image associée au tag
}

// Schéma Mongoose pour les tags
const tagSchema: Schema = new Schema({
  label: { type: String, required: true, unique: true }, // Le libellé doit être unique
  image: { type: String, required: true }
});

export const TagModel = mongoose.model<ITag>('Tag', tagSchema);
