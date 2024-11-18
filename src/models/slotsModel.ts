import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript pour le slot
export interface ISlot extends Document {
  start_date: Date;
  end_date: Date;
  location: string;
  photographId: mongoose.Types.ObjectId; 
  customersId: mongoose.Types.ObjectId;
  isReserved: boolean ;
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
  },
  customersId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
  },
  isReserved: { type: Boolean, default: false },
});

export const SlotModel = mongoose.model<ISlot>('Slot', slotSchema);