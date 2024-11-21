import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoutes from "./routes/userRoutes";
import slotsRoutes from "./routes/slotsRoutes";
import galleryRoutes from "./routes/galleryRoutes";
import swaggerRoutes from "./routes/swagger";
import { connectDB } from "./db";
import fakerRoutes from "./routes/fakerRoutes";
import generateFixtures from './fixtures/generateFixtures';
import { cors } from 'hono/cors'
import tagRoutes from "./routes/tagRoutes";

const app = new Hono();

connectDB();

app.route("/api", userRoutes);
app.route("/api", slotsRoutes);
app.route("/api", galleryRoutes);
app.route("/api", fakerRoutes);
app.route("/api", swaggerRoutes);
app.route("/api", tagRoutes);

app.use(
  '*',
  cors({
    origin: 'http://localhost:4000',  
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowHeaders: ['Content-Type', 'Authorization']
  })
)
app.route('/api', userRoutes)
app.route('/api', slotsRoutes)
app.route('/api', galleryRoutes)
app.route('/api', fakerRoutes)

serve(app);
