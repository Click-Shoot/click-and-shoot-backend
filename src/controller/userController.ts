import { Context } from 'hono'
import { UserModel } from '../models/userModel'
import { SlotModel } from '../models/slotsModel' 
import { GalleryModel } from '../models/galleryModel'
import bcrypt from 'bcrypt'

export const getUsers = async (c: Context) => {
  try {
    const users = await UserModel.find()
    return c.json(users)
  } catch (error) {
    return c.json({ message: 'Error fetching users', error }, 500)
  }
}

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

export const createUserHandler = async (c: Context) => {
  try {
    const { firstName, lastName, email, password, description, rating, tags, stuff, slotsBooked, isPhotograph } = await c.req.json()
    const existingUser = await UserModel.findOne({ email });
    const user = await UserModel.findOne({ email });

    if (existingUser) {
      return c.json({ message: "Un compte avec cet email existe déjà." }, 409);
    }

    if (user) {
      return c.json({ message: "email deja pris" }, 404);
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      description,
      rating,
      tags,
      stuff,
      slotsBooked,
      isPhotograph
    })

    await newUser.save()

    if(newUser.isPhotograph){
      const newGallery = new GalleryModel({ photographId: newUser._id, urls: [
        '/assets/slider/1.jpeg',
        '/assets/slider/2.jpeg',
        '/assets/slider/3.jpeg',
        '/assets/slider/4.jpeg',
      ] })
      await newGallery.save()
    }
    return c.json(newUser, 201)
  } catch (error) {
    return c.json({ message: 'Error creating user', error }, 500)
  }
}


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

export const getSlotsByUserId = async (c: Context) => {
  try {
    const userId = c.req.param('id');
    const type = c.req.query('type');

    if (!userId) {
      return c.json({ message: 'User ID is required' }, 400);
    }

    if (!type || !['customer', 'photograph'].includes(type)) {
      return c.json({ message: 'Invalid type parameter' }, 400);
    }

    const filter =
      type === 'customer' ? { customersId: userId } : { photographId: userId };

    const slots = await SlotModel.find(filter);

    return c.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return c.json({ message: 'Error fetching slots', error: error }, 500);
  }
};



export const getPhotographers = async (c: Context) => {
  try {
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
    const tag = c.req.param('tag'); 

    if (!tag) {
      return c.json({ message: 'Tag is required' }, 400);
    }
    const users = await UserModel.find({ tags: tag });

    if (users.length === 0) {
      return c.json({ message: 'No users found with this tag' }, 404);
    }

    return c.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users by tag:', error);
    return c.json({ message: 'Error fetching users by tag', error }, 500);
  }
};





export const getUsersByLoc = async (c: Context) => {
  try {
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
    const topRatedUsers = await UserModel.aggregate([
      {
        $match: {
          rating: { $exists: true, $ne: [] }, 
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          rating: 1,
          description: 1, 
          isPhotograph: 1,
          price: 1,
          avatar: 1,
          averageRating: { $avg: "$rating" }, 
        },
      },
      {
        $sort: { averageRating: -1 }, 
      },
      {
        $limit: 10, 
      },
    ]);

    return c.json(topRatedUsers, 200);
  } catch (error) {
    console.error('Error fetching top-rated users:', error);
    return c.json({ message: 'Error fetching top-rated users', error }, 500);
  }
};

  
