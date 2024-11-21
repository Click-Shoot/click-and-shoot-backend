import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  label: string;
  image: string;
}

const tagSchema: Schema = new Schema({
  label: { type: String, required: true, unique: true }, 
  image: { type: String, required: true }
});

export const TagModel = mongoose.model<ITag>('Tag', tagSchema);
