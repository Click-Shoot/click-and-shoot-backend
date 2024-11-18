import { SwaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";

const swaggerRoutes = new Hono();

// Définition des routes
swaggerRoutes.get("/ui", (c) => {
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
        ${SwaggerUI({ url: "/api/doc" })}
      </html>
    `);
});

swaggerRoutes.get("/doc", (c) => {
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
                    example: "Michelmartin69",
                  },
                },
                required: ["email", "password"],
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
      "/api/tags": {
        get: {
          summary: "Retrieve all tags",
          tags: ["Tags"],
          security: [{ Bearer: [] }],
          responses: {
            200: {
              description: "A list of tags",
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    label: { type: "string" },
                    images : { type: "string" },
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
      "/api/tags/{id}": {
        get: {
          summary: "Retrieve tags by ID",
          tags: ["Tags"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the tags",
              type: "string",
            },
          ],
          responses: {
            200: {
              description: "tags details",
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
              description: "tags not found",
            },
          },
        },
        post: {
          summary: "Create a new tags",
          tags: ["Tags"],
          security: [{ Bearer: [] }],
          parameters: [
            {
              name: "tags",
              in: "body",
              required: true,
              description: "tag data to create",
              schema: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  image: { type: "string" },
                },
                required: ["label", "image"],
              },
            },
          ],
          responses: {
            201: {
              description: "tag created successfully",
            },
            400: {
              description: "Invalid input",
            },
          },
        },
        put: {
          summary: "Update tags by ID",
          tags: ["Tags"],
          security: [{ Bearer: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the Tags",
              type: "string",
            },
            {
              name: "gallery",
              in: "body",
              required: true,
              description: "Tags data to update",
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
              description: "Tags updated successfully",
            },
            404: {
              description: "Tags not found",
            },
          },
        },
        delete: {
          summary: "Tags gallery by ID",
          tags: ["Tags"],
          security: [{ Bearer: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "The ID of the Tags",
              type: "string",
            },
          ],
          responses: {
            204: {
              description: "Tags deleted successfully",
            },
            404: {
              description: "Tags not found",
            },
          },
        },
      },
    },
  });
});

export default swaggerRoutes;
