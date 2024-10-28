import { Context } from "hono";
import { GalleryModel } from "../models/galleryModel";
import { Hono } from "hono";
import { MongoClient } from "mongodb";
import { faker } from "@faker-js/faker";
import { UserModel } from "../models/userModel";
import { SlotModel } from "../models/slotsModel";
import mongoose, { Document, Schema } from 'mongoose';
// Liste de villes en France
const cities = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
];

// Helper functions for generating random data

function createRatings() {
  const ratings = [];
  const numRatings = faker.number.int({ min: 5, max: 10 });

  for (let i = 0; i < numRatings; i++) {
    ratings.push(faker.number.int({ min: 1, max: 5 }));
  }

  return ratings;
}

// Fonction pour générer des tags aléatoires à partir d'une liste prédéfinie
function createTags() {
  const possibleTags = ["mariage", "anniversaire", "enterrement"];
  const numTags = faker.number.int({ min: 1, max: 3 });
  const tags: string[] = [];

  for (let i = 0; i < numTags; i++) {
    const randomTag =
      possibleTags[faker.number.int({ min: 0, max: possibleTags.length - 1 })];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }

  return tags;
}

// Fonction pour générer un ensemble aléatoire de matériel de photographe
function createStuff() {
  const possibleStuff = [
    "caméra DSLR",
    "objectif 50mm",
    "trépied",
    "éclairage studio",
    "fond vert",
  ];
  const numStuff = faker.number.int({ min: 1, max: 5 });
  const stuff: string[] = [];

  for (let i = 0; i < numStuff; i++) {
    const randomStuff =
      possibleStuff[
        faker.number.int({ min: 0, max: possibleStuff.length - 1 })
      ];
    if (!stuff.includes(randomStuff)) {
      stuff.push(randomStuff);
    }
  }

  return stuff;
}

// Fonction pour créer des slots
function createSlots(photographerId: mongoose.Types.ObjectId) { // Utiliser ObjectId ici
    const slots = [];
    const startDate = faker.date.recent(); // Date de départ pour le créneau
  
    for (let i = 0; i < 4; i++) { // Crée 5 créneaux par photographe
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Intervalle d'une heure
  
      const slot = new SlotModel({
        start_date: startDate,
        end_date: endDate,
        location: cities[faker.number.int({ min: 0, max: cities.length - 1 })],
        photographId: photographerId, // Utilisez ObjectId ici
      });
  
      slots.push(slot);
    }
  
    return slots;
  }
  function createGallerys(photographerId: mongoose.Types.ObjectId) {
    const fakergallery = [];
    const numgallery = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < numgallery; i++) {
        fakergallery.push(faker.image.avatar());
    }
    console.log(fakergallery)
    const gallerys = new GalleryModel({
      urls: fakergallery,
      photographId: photographerId,
    });
    console.log(gallerys)


    return gallerys; 
  }
  export const getFaker = async (c: Context) => {
    try {
      const users = [];
      for (let i = 0; i < 4; i++) {
        // const fakerisPhotograph = faker.datatype.boolean();
        const fakerisPhotograph = true;
        const fakerRating = fakerisPhotograph ? createRatings() : [];
        const fakerTags = fakerisPhotograph ? createTags() : [];
        const fakerStuff = fakerisPhotograph ? createStuff() : [];
        const newUser = new UserModel({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          description: faker.lorem.sentence(),
          isPhotograph: fakerisPhotograph,
          rating: fakerRating,
          tags: fakerTags,
          stuff: fakerStuff,
        });
  
        users.push(newUser);
      }
  
      const insertedUsers = await UserModel.insertMany(users);
  
      const slots = [];
      const gallerys = [];
      for (const user of insertedUsers) {
        if (user.isPhotograph) {
          const userSlots = createSlots(user._id.toString());
          slots.push(...userSlots);
  
          const userGallery = createGallerys(user._id.toString());
          gallerys.push(userGallery); // Push the single gallery object into the array
        }
      }
  
      await SlotModel.insertMany(slots);
      await GalleryModel.insertMany(gallerys); // Insert the gallery array
      return c.json({ message: 'Data generated successfully', users: insertedUsers, slots,gallerys });
    } catch (error) {
      console.error("Error generating data:", error);
      return c.json({ error: "Failed to generate data" }, 500);
    }
  };