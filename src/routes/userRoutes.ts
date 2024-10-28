import { Hono } from 'hono'
import {
  getUsers,
  getUserById,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getSlotsBookedByUser,
  getSlotsByUserId,
  getPhotographers,
} from '../controller/userController'
import { login, middleware } from '../controller/authController'
import { use } from 'hono/jsx'
import { jwtAuthMiddleware } from '../middleware/middlewareAuth'

const userRoutes = new Hono()

// Définition des routes
userRoutes.get('/users', jwtAuthMiddleware, getUsers)
userRoutes.get('/users/:id', jwtAuthMiddleware, getUserById)
userRoutes.get('/photographers', jwtAuthMiddleware, getPhotographers)
userRoutes.post('/users', jwtAuthMiddleware, createUserHandler)
userRoutes.put('/users/:id', jwtAuthMiddleware, updateUserHandler)
userRoutes.delete('/users/:id', jwtAuthMiddleware, deleteUserHandler)
userRoutes.get('/users/:id/slotsBooked', jwtAuthMiddleware, getSlotsBookedByUser)
userRoutes.get('/users/:id/slots', jwtAuthMiddleware, getSlotsByUserId)
userRoutes.post('/login', login)



export default userRoutes
