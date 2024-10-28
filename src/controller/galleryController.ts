import { Context } from 'hono'
import { GalleryModel } from '../models/galleryModel'
import { UserModel } from '../models/userModel';

// Récupérer toutes les images de la galerie
export const getGalleries = async (c: Context) => {
  try {
    const galleries = await GalleryModel.find()
    return c.json(galleries)
  } catch (error) {
    return c.json({ message: 'Error fetching galleries', error }, 500)
  }
}

// Récupérer une image de la galerie par son ID
export const getGalleryById = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const gallery = await GalleryModel.findById(id)
    if (gallery) {
      return c.json(gallery)
    } else {
      return c.json({ message: 'Gallery not found' }, 404)
    }
  } catch (error) {
    return c.json({ message: 'Error fetching gallery', error }, 500)
  }
}

// Créer une nouvelle image dans la galerie
export const createGalleryHandler = async (c: Context) => {
  try {
    const { urls, idPhotograph } = await c.req.json()
    const user = await UserModel.findById(idPhotograph);
    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }
    const newGallery = new GalleryModel({ urls, idPhotograph })
    await newGallery.save()
    return c.json(newGallery, 201)
  } catch (error) {
    return c.json({ message: 'Error creating gallery', error }, 500)
  }
}

// Mettre à jour le tableau des urls de la galerie d'un photograph
export const updateGalleryHandler = async (c: Context) => {
  try {
      const id = c.req.param('id');
      const { urls } = await c.req.json(); 

      if (!urls || !Array.isArray(urls)) {
          return c.json({ message: 'Invalid URLs' }, 400);
      }

      const gallery = await GalleryModel.findById(id);
      if (!gallery) {
          return c.json({ message: 'Gallery not found' }, 404);
      }

      gallery.urls.push(...urls); 

      const updatedGallery = await gallery.save();

      return c.json(updatedGallery);
  } catch (error) {
      console.error('Error updating gallery:', error);
      return c.json({ message: 'Error updating gallery', error }, 500);
  }
};



// Supprimer une image de la galerie
export const deleteGalleryHandler = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const deletedGallery = await GalleryModel.findByIdAndDelete(id)
    if (deletedGallery) {
      return c.json({ message: 'Gallery deleted successfully' })
    } else {
      return c.json({ message: 'Gallery not found' }, 404)
    }
  } catch (error) {
    return c.json({ message: 'Error deleting gallery', error }, 500)
  }
}

// Récupérer les galeries par idPhotograph
export const getGalleriesByUser = async (c: Context) => {
  try {
    const { userId } = c.req.param();

    // Vérifier si l'utilisateur existe
    const user = await UserModel.findById(userId);
    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    // Récupérer les galeries associées à ce photographe
    const galleries = await GalleryModel.find({ idPhotograph: userId });

    if (galleries.length === 0) {
      return c.json({ message: 'No galleries found for this user' }, 404);
    }

    return c.json({ success: true, galleries });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return c.json({ message: 'Error fetching galleries', error }, 500);
  }
};
