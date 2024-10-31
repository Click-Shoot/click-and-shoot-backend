import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import userRoutes from './routes/userRoutes'
import slotsRoutes from './routes/slotsRoutes'
import galleryRoutes from './routes/galleryRoutes'
import { connectDB } from './db'
import { login, middleware } from './controller/authController'
import { create } from 'domain'
import { createUserHandler } from './controller/userController'
import { UserModel } from './models/userModel';
import fakerRoutes from './routes/fakerRoutes'
import { cors } from 'hono/cors'



// Créer l'application Hono
const app = new Hono()

// Connexion à la base de données MongoDB
connectDB()
export const initializeUsers = async () => {
    try {
      const users = await UserModel.find();
      
      if (users.length === 0) {
        const defaultUsers = [
          {
            firstName: 'John',
            lastName: 'Doe',
            description: 'Photographer based in New York',
            rating: [5, 4],
            tags: ['portrait', 'landscape'],
            stuff: ['camera', 'lens'],
            slotsBooked: [],
            isPhotograph: true
          },
          {
            firstName: 'Jane',
            lastName: 'Smith',
            description: 'Freelance photographer in London',
            rating: [4, 5],
            tags: ['event', 'wedding'],
            stuff: ['tripod', 'lights'],
            slotsBooked: [],
            isPhotograph: true
          }
        ];
  
        await UserModel.insertMany(defaultUsers);
        console.log('Default users created!');
      } else {
        console.log('Users already exist in the database.');
      }
    } catch (error) {
      console.error('Error initializing users:', error);
    }
  };

// app.post('/login', login)
// app.use('/api/*', middleware)
app.use(
  '*',
  cors({
    origin: 'http://localhost:4000',  // autoriser uniquement cette origine
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // les méthodes HTTP autorisées
    allowHeaders: ['Content-Type', 'Authorization'] // les en-têtes autorisés
  })
)
app.route('/api', userRoutes)
app.route('/api', slotsRoutes)
app.route('/api', galleryRoutes)
app.route('/api', fakerRoutes)

// Démarrer le serveur sur le port 3000
// const port = 3000
// serve({
//   fetch: app.fetch,
//   port
// })
serve(app)