import { Hono } from 'hono'
import {
  getGalleries,
  getGalleryById,
  createGalleryHandler,
  updateGalleryHandler,
  deleteGalleryHandler,
  getGalleriesByUser,
} from '../controller/galleryController'
import { jwtAuthMiddleware } from '../middleware/middlewareAuth'


const galleryRoutes = new Hono()

// Définition des routes
galleryRoutes.get('/gallery', jwtAuthMiddleware, getGalleries)
galleryRoutes.get('/gallery/:id', jwtAuthMiddleware, getGalleryById)
galleryRoutes.get('/gallery/user/:id', getGalleriesByUser)
galleryRoutes.post('/gallery', jwtAuthMiddleware, createGalleryHandler)
galleryRoutes.put('/gallery/:id', jwtAuthMiddleware, updateGalleryHandler)
galleryRoutes.delete('/gallery/:id', jwtAuthMiddleware, deleteGalleryHandler)

export default galleryRoutes
