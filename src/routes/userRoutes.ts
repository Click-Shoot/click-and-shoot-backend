import { Hono } from 'hono'
import {
  getUsers,
  getUserById,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getTopRatedUsers,
  getSlotsByUserId,
  getPhotographers,
  getUsersByLoc,
  getUsersByTag
} from '../controller/userController'
import { login, middleware } from '../controller/authController'
import { use } from 'hono/jsx'
import { jwtAuthMiddleware } from '../middleware/middlewareAuth'
import { cors } from 'hono/cors'

const userRoutes = new Hono()

userRoutes.use(
    '*',
    cors({
      origin: 'http://localhost:4000',  // autoriser uniquement cette origine
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // les méthodes HTTP autorisées
      allowHeaders: ['Content-Type', 'Authorization'] // les en-têtes autorisés
    })
)

// Définition des routes
userRoutes.get('/users', jwtAuthMiddleware, getUsers)
userRoutes.get('/users/notation', jwtAuthMiddleware, getTopRatedUsers)
userRoutes.get('/users/localitation', jwtAuthMiddleware, getUsersByLoc);
userRoutes.get('/users/:id', jwtAuthMiddleware, getUserById)
userRoutes.get('/photographers', jwtAuthMiddleware, getPhotographers)
userRoutes.post('/users', createUserHandler)
userRoutes.put('/users/:id', jwtAuthMiddleware, updateUserHandler)
userRoutes.delete('/users/:id', jwtAuthMiddleware, deleteUserHandler)
userRoutes.get('/users/:id/slots', jwtAuthMiddleware, getSlotsByUserId)
userRoutes.post('/login', login)
userRoutes.get('/users/photographers/:tag', jwtAuthMiddleware, getUsersByTag);

export default userRoutes
