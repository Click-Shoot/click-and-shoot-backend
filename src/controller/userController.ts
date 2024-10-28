import { Context } from 'hono'
import { UserModel } from '../models/userModel'
import { SlotModel } from '../models/slotsModel' // Assurez-vous d'importer le modèle Slot

// Récupérer tous les utilisateurs
export const getUsers = async (c: Context) => {
  try {
    const users = await UserModel.find()
    return c.json(users)
  } catch (error) {
    return c.json({ message: 'Error fetching users', error }, 500)
  }
}

// Récupérer un utilisateur par son ID
export const getUserById = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const user = await UserModel.findById(id)
    if (user) {
      return c.json(user)
    } else {
      return c.json({ message: 'User not found' }, 404)
    }
  } catch (error) {
    return c.json({ message: 'Error fetching user', error }, 500)
  }
}

// Créer un nouvel utilisateur
export const createUserHandler = async (c: Context) => {
  try {
    const { firstName, lastName, description, rating, tags, stuff, slotsBooked, isPhotograph } = await c.req.json()
    const newUser = new UserModel({ firstName, lastName, description, rating, tags, stuff, slotsBooked, isPhotograph})
    await newUser.save()
    return c.json(newUser, 201)
  } catch (error) {
    return c.json({ message: 'Error creating user', error }, 500)
  }
}

// Mettre à jour un utilisateur
export const updateUserHandler = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const { firstName, lastName, description, rating, tags, stuff, slotsBooked, isPhotograph } = await c.req.json()
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { firstName, lastName, description, rating, tags, stuff, slotsBooked, isPhotograph },
      { new: true }
    )
    if (updatedUser) {
      return c.json(updatedUser)
    } else {
      return c.json({ message: 'User not found' }, 404)
    }
  } catch (error) {
    return c.json({ message: 'Error updating user', error }, 500)
  }
}

// Supprimer un utilisateur
export const deleteUserHandler = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const deletedUser = await UserModel.findByIdAndDelete(id)
    if (deletedUser) {
      return c.json({ message: 'User deleted successfully' })
    } else {
      return c.json({ message: 'User not found' }, 404)
    }
  } catch (error) {
    return c.json({ message: 'Error deleting user', error }, 500)
  }
}

// Récupérer tous les slots réservés par un utilisateur avec les détails des slots
export const getSlotsBookedByUser = async (c: Context) => {
  try {
    const userId = c.req.param('id') 
    const user = await UserModel.findById(userId)

    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }

    const slots = await SlotModel.find({ _id: { $in: user.slotsBooked } }) 
    return c.json(slots) 
  } catch (error) {
    return c.json({ message: 'Error fetching slots booked', error }, 500)
  }
}

// Récupérer tous les slots réservés par un utilisateur
export const getSlotsByUserId = async (c: Context) => {
  try {
    const userId = c.req.param('id') // Récupérer l'ID de l'utilisateur à partir des paramètres de l'URL

    // Récupérer les slots réservés par l'utilisateur
    const slots = await SlotModel.find({ photographId: userId }) // Filtrer les slots par photographId
    return c.json(slots) // Retourner les détails des slots
  } catch (error) {
    return c.json({ message: 'Error fetching slots', error }, 500)
  }
}

// Récupérer les utilisateurs qui sont photographes
export const getPhotographers = async (c: Context) => {
  try {
    // Rechercher les utilisateurs dont le champ isPhotograph est true
    const photographers = await UserModel.find({ isPhotograph: true });
    if (photographers.length === 0) {
      return c.json({ message: 'No photographers found' }, 404);
    }

    return c.json({ success: true, photographers });
  } catch (error) {
    console.error('Error fetching photographers:', error);
    return c.json({ message: 'Error fetching photographers', error }, 500);
  }
};




  
