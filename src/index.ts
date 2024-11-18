import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoutes from "./routes/userRoutes";
import slotsRoutes from "./routes/slotsRoutes";
import galleryRoutes from "./routes/galleryRoutes";
import swaggerRoutes from "./routes/swagger";
import { connectDB } from "./db";
import { UserModel } from "./models/userModel";
import { GalleryModel } from "./models/galleryModel";
import fakerRoutes from "./routes/fakerRoutes";
import { SwaggerUI } from "@hono/swagger-ui";

import {
  getUsers,
  getUserById,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getSlotsBookedByUser,
  getSlotsByUserId,
  getPhotographers,
} from "./controller/userController";
import { login, middleware } from "./controller/authController";
import { jwtAuthMiddleware } from "./middleware/middlewareAuth";
import { cors } from 'hono/cors'
import bcrypt from "bcrypt";

// Créer l'application Hono
const app = new Hono();

// Connexion à la base de données MongoDB
connectDB();

// Routes
app.route("/api", userRoutes);
app.route("/api", slotsRoutes);
app.route("/api", galleryRoutes);
app.route("/api", fakerRoutes);
app.route("/api", swaggerRoutes);

     


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
serve(app);
