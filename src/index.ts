import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoutes from "./routes/userRoutes";
import slotsRoutes from "./routes/slotsRoutes";
import galleryRoutes from "./routes/galleryRoutes";
import swaggerRoutes from "./routes/swagger";
import { connectDB } from "./db";
import { UserModel } from "./models/userModel";
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
import bcrypt from "bcrypt";
// Créer l'application Hono
const app = new Hono();

// Connexion à la base de données MongoDB
connectDB();

export const initializeUsers = async () => {
  try {
    const users = await UserModel.find();

  
    const hashedPassword = await bcrypt.hash('password', 10)

    if (users.length === 0) {
      const defaultUsers = [
        {
          firstName: "John",
          lastName: "Doe",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Photographer based in New York",
          rating: [5, 4],
          tags: ["portrait", "landscape"],
          stuff: ["camera", "lens"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "John",
          lastName: "Doe",
          email: "jjj@test.com",
          password: hashedPassword,
          description: "Photographer based in New York",
          rating: [5, 4],
          tags: ["portrait", "landscape"],
          stuff: ["camera", "lens"],
          slotsBooked: [],
          isPhotograph: true,
        },
      ];

      await UserModel.insertMany(defaultUsers);
      console.log("Default users created!");
    } else {
      console.log("Users already exist in the database.");
    }
  } catch (error) {
    console.error("Error initializing users:", error);
  }
};

// Routes
app.route("/api", userRoutes);
app.route("/api", slotsRoutes);
app.route("/api", galleryRoutes);
app.route("/api", fakerRoutes);
app.route("/api", swaggerRoutes);

// Démarrer le serveur sur le port 3000
serve(app);
