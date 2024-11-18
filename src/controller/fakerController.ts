import { Context } from "hono";
import { GalleryModel } from "../models/galleryModel";
import { Hono } from "hono";
import { MongoClient } from "mongodb";
import { faker } from "@faker-js/faker";

import { UserModel } from "../models/userModel";
import { SlotModel } from "../models/slotsModel";
import { TagModel } from "../models/tagModel";

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
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
async function createTags() {
  const possibleTags = [
    { label: "Mariage", image: "url" },
    { label: "Tinder & Réseaux Sociaux", image: "url" },
    { label: "Portrait Artistique", image: "url" },
    { label: "Grossesse & Naissance", image: "url" },
    { label: "Shooting de Famille", image: "url" },
    { label: "Événements", image: "url" },
    { label: "Mode & Lookbook", image: "url" },
    { label: "Corporate & Professionnel", image: "url" },
    { label: "Culinaire & Restauration", image: "url" },
    { label: "Couple & Romance", image: "url" },
  ];

  if ((await TagModel.countDocuments()) > 0) {
    return;
  }
  // Insertion des tags dans la BDD
  await TagModel.insertMany(possibleTags);
}

async function getRandomTags() {
  const allTags = await TagModel.find();
  const numTags = faker.number.int({ min: 1, max: 3 });
  const selectedTagIds = new Set();

  while (selectedTagIds.size < numTags && allTags.length > 0) {
    const randomIndex = faker.number.int({ min: 0, max: allTags.length - 1 });
    selectedTagIds.add(allTags[randomIndex]._id);
  }

  return Array.from(selectedTagIds);
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
function createSlots(
  photographerId: mongoose.Types.ObjectId,
  customersId: mongoose.Types.ObjectId
) {
   
    const slots = [];
   // Date de départ pour le créneau

    for (let i = 0; i < 4; i++) {
      // Crée 5 créneaux par photographe
      const startDate = faker.date.future() 
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Intervalle d'une heure

      const slot = new SlotModel({
        start_date: startDate,
        end_date: endDate,
        location: cities[faker.number.int({ min: 0, max: cities.length - 1 })],
        photographId: photographerId,
        customersId: customersId,
        isReserved: true
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
  console.log(fakergallery);
  const gallerys = new GalleryModel({
    urls: fakergallery,
    photographId: photographerId,
  });
  console.log(gallerys);

  return gallerys;
}
export const getFaker = async (c: Context) => {
  try {
    const users = [];
    const notPhotographs = [];
    const hashedPassword = await bcrypt.hash("password", 10);
    await createTags();
    for (let i = 0; i < 30; i++) {
      const fakerisPhotograph = faker.datatype.boolean();
      const fakerRating = fakerisPhotograph ? createRatings() : [];
      const fakerTags = fakerisPhotograph ? await getRandomTags() : [];
      const fakerStuff = fakerisPhotograph ? createStuff() : [];
      const fakerfirstName = faker.person.firstName();
      const fakerlastName = faker.person.firstName();
      const newUser = new UserModel({
        firstName: fakerfirstName,
        lastName: fakerlastName,
        email: fakerfirstName + "." + fakerlastName + "@clickandshoot.fr",
        password: hashedPassword,
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
      if (user.isPhotograph == false) {
        notPhotographs.push(user);
      }
    }

    for (const user of insertedUsers) {
      let randomUser;
      if (notPhotographs.length > 0) {
        const randomIndex = Math.floor(Math.random() * notPhotographs.length);
        randomUser = notPhotographs[randomIndex];
      }
      if (user.isPhotograph) {
        const userSlots = createSlots(
          user._id.toString(),
          randomUser._id.toString()
        );
        slots.push(...userSlots);
        const userGallery = createGallerys(user._id.toString());
        gallerys.push(userGallery);
      }
    }

    await SlotModel.insertMany(slots);
    await GalleryModel.insertMany(gallerys); // Insert the gallery array
    return c.json({
      message: "Data generated successfully",
      users: insertedUsers,
      slots,
      gallerys,
    });
  } catch (error) {
    console.error("Error generating data:", error);
    return c.json({ error: "Failed to generate data" }, 500);
  }
};
