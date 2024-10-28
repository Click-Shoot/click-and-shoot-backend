import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript pour le slot
export interface ISlot extends Document {
  start_date: Date;
  end_date: Date;
  location: string;
  photographId: mongoose.Types.ObjectId; 
}

// Schéma Mongoose pour le slot
const slotSchema: Schema = new Schema({
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  location: { type: String, required: true },
  photographId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
});

export const SlotModel = mongoose.model<ISlot>('Slot', slotSchema);