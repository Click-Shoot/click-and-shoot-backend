import { Hono } from 'hono'
import {
  getSlots,
  getSlotById,
  createSlotHandler,
  updateSlotHandler,
  deleteSlotHandler,
  getSlotByReserve
} from '../controller/slotsController'
import { jwtAuthMiddleware } from '../middleware/middlewareAuth'


const slotsRoutes = new Hono()

// Définition des routes
slotsRoutes.get('/slots', getSlots)
slotsRoutes.get('/slots/:id', jwtAuthMiddleware, getSlotById)
slotsRoutes.post('/slots', jwtAuthMiddleware, createSlotHandler)
slotsRoutes.put('/slots/:id', jwtAuthMiddleware, updateSlotHandler)
slotsRoutes.delete('/slots/:id', jwtAuthMiddleware, deleteSlotHandler)
slotsRoutes.get('/slot/:photographId', jwtAuthMiddleware, getSlotByReserve);
export default slotsRoutes
