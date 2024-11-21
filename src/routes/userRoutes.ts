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
      origin: 'http://localhost:4000', 
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization'] 
    })
)

userRoutes.get('/users', jwtAuthMiddleware, getUsers)
userRoutes.get('/users/notation', getTopRatedUsers)
userRoutes.get('/users/localitation', jwtAuthMiddleware, getUsersByLoc);
userRoutes.get('/users/:id', getUserById)
userRoutes.get('/photographers', jwtAuthMiddleware, getPhotographers)
userRoutes.post('/users', createUserHandler)
userRoutes.put('/users/:id', jwtAuthMiddleware, updateUserHandler)
userRoutes.delete('/users/:id', jwtAuthMiddleware, deleteUserHandler)
userRoutes.get('/users/:id/slots', getSlotsByUserId)
userRoutes.post('/login', login)
userRoutes.get('/users/photographers/:tag', getUsersByTag);

export default userRoutes
