import { Context } from 'hono'
import { UserModel } from '../models/userModel'
import { SlotModel } from '../models/slotsModel' // Assurez-vous d'importer le modèle Slot
import bcrypt from 'bcrypt'
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
    const { firstName, lastName, email, password, description, rating, tags, stuff, slotsBooked, isPhotograph } = await c.req.json()

    const user = await UserModel.findOne({ email });

    if (user) {
      return c.json({ message: "email deja pris" }, 404);
    }

    // Hash le mot de passe avant de créer l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Enregistre le mot de passe haché
      description,
      rating,
      tags,
      stuff,
      slotsBooked,
      isPhotograph
    })

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
    const { firstName, lastName, email, password,  description, rating, tags, stuff, slotsBooked, isPhotograph } = await c.req.json()
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { firstName, lastName, email, password,  description, rating, tags, stuff, slotsBooked, isPhotograph },
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
// export const getSlotsBookedByUser = async (c: Context) => {
//   try {
//     const userId = c.req.param('id') 
//     const user = await UserModel.findById(userId)

//     if (!user) {
//       return c.json({ message: 'User not found' }, 404)
//     }

//     const slots = await SlotModel.find({ _id: { $in: user.slotsBooked } }) 
//     return c.json(slots) 
//   } catch (error) {
//     return c.json({ message: 'Error fetching slots booked', error }, 500)
//   }
// }

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

export const getUsersByTag = async (c: Context) => {
  try {
    // Récupère les tags depuis la requête (paramètre de requête GET ou JSON body)
    const tags = c.req.query('tags'); // Exemple de format attendu: "tag1,tag2,tag3"

    if (!tags) {
      return c.json({ message: 'Tags are required' }, 400);
    }

    // Convertir les tags en tableau
    const tagArray = tags.split(',');

    // Rechercher les utilisateurs avec au moins un des tags spécifiés
    const users = await UserModel.find({
      tags: { $in: tagArray },
    }).populate('tags'); // Optionnel : pour remplir les informations de tag

    if (users.length === 0) {
      return c.json({ message: 'No users found with these tags' }, 404);
    }

    return c.json({ success: true, users }, 200);
  } catch (error) {
    console.error('Error fetching users by tags:', error);
    return c.json({ message: 'Error fetching users by tags', error }, 500);
  }
};

export const getUsersByLoc = async (c: Context) => {
  try {
    // Récupère la localisation depuis les query parameters
    const queryLocation = c.req.query('location'); 

    if (!queryLocation) {
      return c.json({ message: 'Location parameter is required' }, 400);
    }
    const slots = await SlotModel.find({ location: queryLocation }).populate('photographId');
    if (slots.length === 0) {
      return c.json({ message: `No slots found for location "${queryLocation}"` }, 404);
    }
    const photographers = slots.map((slot) => slot.photographId);
    const uniquePhotographers = Array.from(new Set(photographers.map((p) => p._id.toString())))
      .map((id) => photographers.find((p) => p._id.toString() === id));

    return c.json({ success: true, photographers: uniquePhotographers }, 200);
  } catch (error) {
    console.error('Error fetching users by location:', error);
    return c.json({ message: 'Error fetching users by location', error }, 500);
  }
};

export const getTopRatedUsers = async (c: Context) => {
  try {
    // Agrégation pour filtrer et trier les utilisateurs par leur moyenne de notes
    const topRatedUsers = await UserModel.aggregate([
      {
        $match: {
          rating: { $exists: true, $ne: [] }, // Filtre uniquement les utilisateurs ayant des ratings
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          description: 1, 
          isPhotograph: 1,
          price: 1,
          avatar: 1,
          averageRating: { $avg: "$rating" }, // Calcule la moyenne des ratings
        },
      },
      {
        $sort: { averageRating: -1 }, // Trie par moyenne décroissante
      },
      {
        $limit: 10, // Limite à 10 résultats
      },
    ]);

    // Retourne la liste des 10 meilleurs utilisateurs
    return c.json(topRatedUsers, 200);
  } catch (error) {
    console.error('Error fetching top-rated users:', error);
    return c.json({ message: 'Error fetching top-rated users', error }, 500);
  }
};

  
