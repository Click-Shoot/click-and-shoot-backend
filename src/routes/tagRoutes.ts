import { Hono } from 'hono'
import { createTag, getAllTags, getTagById, updateTag, deleteTag } from '../controller/tagController';
import { jwtAuthMiddleware } from '../middleware/middlewareAuth'

const tagRoutes = new Hono()

tagRoutes.post('/tags', jwtAuthMiddleware, createTag); 
tagRoutes.get('/tags', getAllTags);           
tagRoutes.get('/tags/:id', getTagById);        
tagRoutes.put('/tags/:id', jwtAuthMiddleware, updateTag);         
tagRoutes.delete('/tags/:id', jwtAuthMiddleware, deleteTag);       

export default tagRoutes