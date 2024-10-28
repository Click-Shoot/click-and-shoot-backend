import mongoose, { Document, Schema } from 'mongoose'

// Interface TypeScript pour l'utilisateur
export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password:string
  description: string
  rating: number[] 
  tags: string[]   
  stuff: string[]  
  slotsBooked: string[] 
  isPhotograph: boolean 
}

// Schéma Mongoose pour l'utilisateur
const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password:{ type: String, required: true },
  description:{ type: String, required: true },
  rating: { type: [Number], default: [] }, 
  tags: { type: [String], default: [] },   
  stuff: { type: [String], default: [] },   
  slotsBooked: { type: [String], default: [] },
  isPhotograph: { type: Boolean, default: false },
})

export const UserModel = mongoose.model<IUser>('User', userSchema)
