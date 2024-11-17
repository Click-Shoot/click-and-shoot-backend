import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoutes from "./routes/userRoutes";
import slotsRoutes from "./routes/slotsRoutes";
import galleryRoutes from "./routes/galleryRoutes";
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
          firstName: "Jane",
          lastName: "Smith",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Freelance photographer in London",
          rating: [4, 5],
          tags: ["event", "wedding"],
          stuff: ["tripod", "lights"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "mFBtz",
          lastName: "oEyzD",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Studio photographer in Berlin",
          rating: [4, 5],
          tags: ["product", "wedding"],
          stuff: ["camera", "lights"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "hbJKh",
          lastName: "JcBqJ",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Wedding photographer in Rome",
          rating: [5],
          tags: ["event", "portrait", "wedding"],
          stuff: ["lights", "tripod", "reflector"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "XcFVB",
          lastName: "PLpQC",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Travel photographer",
          rating: [1, 2],
          tags: ["portrait", "wedding"],
          stuff: ["tripod", "drones"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "eSmys",
          lastName: "IUDzV",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Travel photographer",
          rating: [3],
          tags: ["landscape", "product"],
          stuff: ["tripod", "reflector"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "zxvOU",
          lastName: "tkGJd",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Freelance photographer in Paris",
          rating: [5, 2],
          tags: ["product", "landscape"],
          stuff: ["lights", "camera", "drones"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "KLmPt",
          lastName: "vBHSe",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Event specialist",
          rating: [2, 4],
          tags: ["event", "sports"],
          stuff: ["lights", "tripod"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "lRtxO",
          lastName: "rMNUQ",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Portrait artist",
          rating: [3, 4],
          tags: ["portrait"],
          stuff: ["reflector"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "ObLiQ",
          lastName: "qUbHT",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Freelance photographer in Paris",
          rating: [1],
          tags: ["wedding", "event"],
          stuff: ["camera", "drones"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "xIoPK",
          lastName: "oSnkl",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Studio photographer in Berlin",
          rating: [4],
          tags: ["product", "portrait"],
          stuff: ["tripod", "lights"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "gCmOW",
          lastName: "JcBqM",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Wedding photographer in Rome",
          rating: [5, 2],
          tags: ["wedding"],
          stuff: ["camera", "reflector"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "BlRoN",
          lastName: "ImOUt",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Travel photographer",
          rating: [2],
          tags: ["landscape"],
          stuff: ["drones", "tripod"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "yTuMo",
          lastName: "WbHLk",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Event specialist",
          rating: [4],
          tags: ["event", "sports"],
          stuff: ["lights", "reflector"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "mNzJh",
          lastName: "HpKUc",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Portrait artist",
          rating: [3, 5],
          tags: ["portrait", "event"],
          stuff: ["camera"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "CnHlP",
          lastName: "KrMtO",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Studio photographer in Berlin",
          rating: [1, 3],
          tags: ["wedding", "landscape"],
          stuff: ["drones", "reflector"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "wFsML",
          lastName: "qPlOK",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Travel photographer",
          rating: [2, 5],
          tags: ["portrait"],
          stuff: ["lights", "tripod"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "RxvUK",
          lastName: "xWrPQ",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Event specialist",
          rating: [5],
          tags: ["event", "product"],
          stuff: ["tripod", "camera"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "kTlIM",
          lastName: "PoRUk",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Wedding photographer in Rome",
          rating: [3, 4],
          tags: ["wedding", "portrait"],
          stuff: ["camera", "lights"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "mOlqV",
          lastName: "YpOsZ",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Freelance photographer in Paris",
          rating: [4, 5],
          tags: ["event", "sports"],
          stuff: ["drones", "tripod"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "qErLO",
          lastName: "LpUnZ",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Travel photographer",
          rating: [1],
          tags: ["portrait"],
          stuff: ["lights"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "bJsMl",
          lastName: "QkPlU",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Studio photographer in Berlin",
          rating: [2, 3],
          tags: ["wedding"],
          stuff: ["camera", "tripod"],
          slotsBooked: [],
          isPhotograph: true,
        },
        {
          firstName: "rKlOm",
          lastName: "dPlIk",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Studio photographer in Berlin",
          rating: [4],
          tags: ["product"],
          stuff: ["reflector"],
          slotsBooked: [],
          isPhotograph: false,
        },
        {
          firstName: "yXlWu",
          lastName: "vPkLo",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Wedding photographer in Rome",
          rating: [3, 5],
          tags: ["portrait", "sports"],
          stuff: ["lights"],
          slotsBooked: [],
          isPhotograph: false,
        },
        {
          firstName: "xPuSl",
          lastName: "uPzOn",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Event specialist",
          rating: [5, 2],
          tags: ["event"],
          stuff: ["tripod"],
          slotsBooked: [],
          isPhotograph: false,
        },
        {
          firstName: "gCmSo",
          lastName: "XrLlN",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Freelance photographer in Paris",
          rating: [4],
          tags: ["landscape"],
          stuff: ["drones"],
          slotsBooked: [],
          isPhotograph: false,
        },
        {
          firstName: "uTzMo",
          lastName: "IrWpP",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Portrait artist",
          rating: [2],
          tags: ["portrait", "wedding"],
          stuff: ["reflector", "camera"],
          slotsBooked: [],
          isPhotograph: false,
        },
        {
          firstName: "dXmUl",
          lastName: "PoLmJ",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Travel photographer",
          rating: [3, 4],
          tags: ["sports", "event"],
          stuff: ["camera"],
          slotsBooked: [],
          isPhotograph: false,
        },
        {
          firstName: "eHkRn",
          lastName: "PlOtL",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Studio photographer in Berlin",
          rating: [1, 5],
          tags: ["wedding"],
          stuff: ["tripod"],
          slotsBooked: [],
          isPhotograph: false,
        },
        {
          firstName: "fXoMq",
          lastName: "uLpBr",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Event specialist",
          rating: [5, 2],
          tags: ["landscape", "portrait"],
          stuff: ["lights", "reflector"],
          slotsBooked: [],
          isPhotograph: false,
        },
        {
          firstName: "lRlPm",
          lastName: "oPrTj",
          email: "jj@test.com",
          password: hashedPassword,
          description: "Wedding photographer in Rome",
          rating: [2, 4],
          tags: ["portrait"],
          stuff: ["camera", "drones"],
          slotsBooked: [],
          isPhotograph: false,
        }
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

async function generateFixtures() {
  try {
    const photographers = await UserModel.find({ isPhotograph: true });

    const galleryPromises = photographers.map(async (photographer) => {
      const imageUrls = [
        'https://cdn.discordapp.com/attachments/797953746357059584/1307765971850629200/512-500x500.jpg?ex=673b7f78&is=673a2df8&hm=eaeed70ef7eb41da8c4f1158e00a0f55b85b0a7c0c9f043e0d4d557bedad233d&',
        'https://cdn.discordapp.com/attachments/797953746357059584/1307765972077379686/227-500x500.jpg?ex=673b7f78&is=673a2df8&hm=861039ae347a7560bb3cf1fa84968245a01a2593b6278b7b040ef03a86e03297&',
        'https://cdn.discordapp.com/attachments/797953746357059584/1307765972303745104/798-500x500.jpg?ex=673b7f78&is=673a2df8&hm=7fdf2c5bd9536b4455ec04e464c3e0d046149ceea4726a02d80b7c592f5d2142&',
        'https://cdn.discordapp.com/attachments/797953746357059584/1307765972525912156/198-500x500.jpg?ex=673b7f78&is=673a2df8&hm=fa01327534409f4fa92ce1a8113e1cfe20ea75aed6bc0869fb00b7a797857573&',
        'https://cdn.discordapp.com/attachments/797953746357059584/1307765972748206220/121-500x500.jpg?ex=673b7f79&is=673a2df9&hm=adbb5317e00c15965ff23106a093cce8479229f949ff6de1e8dcbe3154621e5e&',
        'https://cdn.discordapp.com/attachments/797953746357059584/1307765973020971018/983-500x500.jpg?ex=673b7f79&is=673a2df9&hm=d87481cdf586057de180d371fc1c3a8cbe83d15a991c16bd9a04b05ad369ded7&'
      ];

      const gallery = new GalleryModel({
        photographId: photographer._id,
        urls: imageUrls,
      });

      return gallery.save();
    });

    await Promise.all(galleryPromises);

    console.log('Fixtures avec galeries générées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la génération des fixtures :', error);
  }
}

async function checkAndGenerateFixtures() {
  const galleryCount = await GalleryModel.countDocuments();

  if (galleryCount === 0) {
    await generateFixtures();
  } else {
    console.log('Les galeries existent déjà, pas besoin de générer les fixtures.');
  }
}

checkAndGenerateFixtures();

// Routes
app.route("/api", userRoutes);
app.route("/api", slotsRoutes);
app.route("/api", galleryRoutes);
app.route("/api", fakerRoutes);

// Documentation Swagger
app.get("/ui", (c) => {
  return c.html(`
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Custom Swagger" />
        <title>Custom Swagger</title>
        <script>
          // custom script
        </script>
        <style>
          /* custom style */
        </style>
      </head>
      ${SwaggerUI({ url: "/doc" })}
    </html>
  `);
});

app.get("/doc", (c) => {
  return c.json({
    swagger: "2.0",
    info: {
      title: "Click and Shoot Api Doc",
      version: "1.0.0",
      description: "c'est la doc ",
    },
    schemes: ["http", "https"],
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description: 'Entrez le token JWT en tant que "Bearer {token}"',
        bearerFormat: "JWT",
      },
    },
    security: [{ Bearer: [] }],
    paths: {
      "/api/login": {
        post: {
          summary: "User login",
          tags: ["Auth"],
          parameters: [
            {
              name: "credentials",
              in: "body",
              required: true,
              description: "User login credentials",
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    description: "The email of the user",
                    example: "michel.martin@gmail.com",
                  },
                  password: {
                    type: "string",
                    description: "The password of the user",
                    example: "Michelmartin69", // Example value for better understanding
                  },
                },
                required: ["email", "password"], // Indicate which fields are required
              },
            },
          ],
          responses: {
            200: {
              description: "Login successful",
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    description: "JWT token for authenticated requests",
                  },
                },
              },
            },
            401: {
              description: "Invalid credentials",
            },
          },
        },
      },
      "/api/users": {
        get: {
          summary: "Retrieve all users",
          tags: ["Users"],
          responses: {
            200: {
              description: "A list of users",
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
      "/api/users/{id}": {
        get: {
          summary: "Retrieve user by ID",
          tags: ["Users"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the user",
              type: "string",
            },
          ],
          responses: {
            200: {
              description: "User details",
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
            404: {
              description: "User not found",
            },
          },
        },
        put: {
          summary: "Update user by ID",
          tags: ["Users"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the user",
              type: "string",
            },
            {
              name: "user",
              in: "body",
              required: true,
              description: "User data to update",
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          ],
          responses: {
            200: {
              description: "User updated successfully",
            },
            404: {
              description: "User not found",
            },
          },
        },
        delete: {
          summary: "Delete user by ID",
          tags: ["Users"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the user",
              type: "string",
            },
          ],
          responses: {
            204: {
              description: "User deleted successfully",
            },
            404: {
              description: "User not found",
            },
          },
        },
      },
      "/api/users/{id}/slots": {
        get: {
          summary: "Retrieve slots by user ID",
          tags: ["Users"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the user to retrieve slots for",
              type: "string",
            },
          ],
          responses: {
            200: {
              description: "A list of slots for the user",
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    slotId: { type: "string" },
                    time: { type: "string", format: "date-time" },
                    status: { type: "string" },
                  },
                },
              },
            },
            404: {
              description: "User not found",
            },
          },
        },
      },
      "/api/users/{id}/slotsBooked": {
        get: {
          summary: "Retrieve booked slots by user ID",
          tags: ["Users"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the user to retrieve booked slots for",
              type: "string",
            },
          ],
          responses: {
            200: {
              description: "A list of booked slots for the user",
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    slotId: { type: "string" },
                    time: { type: "string", format: "date-time" },
                  },
                },
              },
            },
            404: {
              description: "User not found",
            },
          },
        },
      },
      "/api/photographers": {
        get: {
          summary: "Retrieve all photographers",
          tags: ["Users"],
          responses: {
            200: {
              description: "A list of photographers",
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      "/api/slots": {
        get: {
          summary: "Retrieve all slots",
          tags: ["Slots"],
          responses: {
            200: {
              description: "A list of all slots",
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    slotId: { type: "string" },
                    time: { type: "string", format: "date-time" },
                    status: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      "/api/slots/{id}": {
        get: {
          summary: "Retrieve a slot by ID",
          tags: ["Slots"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the slot to retrieve",
              type: "string",
            },
          ],
          responses: {
            200: {
              description: "A slot object",
              schema: {
                type: "object",
                properties: {
                  slotId: { type: "string" },
                  time: { type: "string", format: "date-time" },
                  status: { type: "string" },
                },
              },
            },
            404: {
              description: "Slot not found",
            },
          },
        },
        put: {
          summary: "Update a slot by ID",
          tags: ["Slots"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the slot to update",
              type: "string",
            },
            {
              name: "slot",
              in: "body",
              required: true,
              description: "Updated slot object",
              schema: {
                type: "object",
                properties: {
                  time: { type: "string", format: "date-time" },
                  status: { type: "string" },
                },
              },
            },
          ],
          responses: {
            200: {
              description: "Slot updated successfully",
            },
            404: {
              description: "Slot not found",
            },
          },
        },
        delete: {
          summary: "Delete a slot by ID",
          tags: ["Slots"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the slot to delete",
              type: "string",
            },
          ],
          responses: {
            204: {
              description: "Slot deleted successfully",
            },
            404: {
              description: "Slot not found",
            },
          },
        },
      },
      
      "/api/gallery": {
        get: {
          summary: "Retrieve all galleries",
          tags: ["Galleries"],
          security: [{ Bearer: [] }],
          responses: {
            200: {
              description: "A list of galleries",
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    userId: { type: "string" },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
            },
          },
        },
        post: {
          summary: "Create a new gallery",
          tags: ["Galleries"],
          security: [{ Bearer: [] }],
          parameters: [
            {
              name: "gallery",
              in: "body",
              required: true,
              description: "Gallery data to create",
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  userId: { type: "string" },
                },
                required: ["title", "userId"],
              },
            },
          ],
          responses: {
            201: {
              description: "Gallery created successfully",
            },
            400: {
              description: "Invalid input",
            },
          },
        },
      },
      "/api/gallery/{id}": {
        get: {
          summary: "Retrieve gallery by ID",
          tags: ["Galleries"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the gallery",
              type: "string",
            },
          ],
          responses: {
            200: {
              description: "Gallery details",
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  userId: { type: "string" },
                },
              },
            },
            404: {
              description: "Gallery not found",
            },
          },
        },
        put: {
          summary: "Update gallery by ID",
          tags: ["Galleries"],
          security: [{ Bearer: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the gallery",
              type: "string",
            },
            {
              name: "gallery",
              in: "body",
              required: true,
              description: "Gallery data to update",
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          ],
          responses: {
            200: {
              description: "Gallery updated successfully",
            },
            404: {
              description: "Gallery not found",
            },
          },
        },
        delete: {
          summary: "Delete gallery by ID",
          tags: ["Galleries"],
          security: [{ Bearer: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the gallery",
              type: "string",
            },
          ],
          responses: {
            204: {
              description: "Gallery deleted successfully",
            },
            404: {
              description: "Gallery not found",
            },
          },
        },
      },
      "/api/gallery/user/{id}": {
        get: {
          summary: "Retrieve galleries by user ID",
          tags: ["Galleries"],
          security: [{ Bearer: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the user to retrieve galleries for",
              type: "string",
            },
          ],
          responses: {
            200: {
              description: "A list of galleries for the user",
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
            404: {
              description: "User not found",
            },
          },
        },
      },
    },
  });
})


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
