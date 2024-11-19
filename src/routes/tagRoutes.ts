import { Hono } from 'hono'
import { createTag, getAllTags, getTagById, updateTag, deleteTag } from '../controller/tagController';
import { jwtAuthMiddleware } from '../middleware/middlewareAuth'

const tagRoutes = new Hono()

tagRoutes.post('/tags', jwtAuthMiddleware, createTag);              // Créer un tag
tagRoutes.get('/tags', getAllTags);              // Lire tous les tags
tagRoutes.get('/tags/:id', getTagById);          // Lire un tag par ID
tagRoutes.put('/tags/:id', jwtAuthMiddleware, updateTag);           // Mettre à jour un tag
tagRoutes.delete('/tags/:id', jwtAuthMiddleware, deleteTag);       

export default tagRoutes