import mongoose, { Document, Schema } from 'mongoose'

// Interface TypeScript pour l'utilisateur
export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password:string
  description: string
  rating: number[] 
  tags: mongoose.Types.ObjectId[];  
  stuff: string[]  
  isPhotograph: boolean 
  price : number
  avatar: string
}

// Schéma Mongoose pour l'utilisateur
const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password:{ type: String, required: true },
  description:{ type: String, required: true },
  rating: { type: [Number], default: [] }, 
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }], 
  stuff: { type: [String], default: [] },   
  slotsBooked: { type: [String], default: [] },
  isPhotograph: { type: Boolean, default: false },
  price: { type: Number, default: 10.0 },
  avatar: { type: String, default: "https://images.pexels.com/photos/18325094/pexels-photo-18325094/free-photo-of-man-taking-pictures-with-camera.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"  },
})

export const UserModel = mongoose.model<IUser>('User', userSchema)
