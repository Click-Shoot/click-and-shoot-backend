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

export async function createGalleryForPhotographers() {
  try {
      // Récupérer tous les utilisateurs qui sont photographes
      const photographers = await UserModel.find({ isPhotograph: true });
      
      // Boucle à travers chaque photographe pour créer une galerie
      const galleryPromises = photographers.map(async (photographer) => {
          const photoCount = faker.number.int({ min: 1, max: 5 }); // Nombre d'images à créer
          const galleryItems = []; // Tableau pour stocker les images à créer

          for (let i = 0; i < photoCount; i++) {
              // Créer un nouvel élément de galerie
              const newGalleryItem = new GalleryModel({
                  url: faker.image.avatar(), // Remplacer par une image de votre choix
                  photographId: photographer._id // ID du photographe
              });

              // Ajouter l'élément au tableau
              galleryItems.push(newGalleryItem);
          }

          // Enregistrer tous les éléments de galerie dans la base de données
          return GalleryModel.insertMany(galleryItems);
      });

      // Attendre que toutes les promesses soient résolues
      const createdGalleries = await Promise.all(galleryPromises);
      console.log(`Successfully created galleries for ${createdGalleries.length} photographers.`);
      
      return createdGalleries; // Retourner les galeries créées
  } catch (error) {
      console.error('Error creating galleries for photographers:', error);
      throw error; // Propager l'erreur pour gérer plus tard si besoin
  }
}

// Fonction pour créer des slots
function createSlots(photographerId: mongoose.Types.ObjectId) { // Utiliser ObjectId ici
    const slots = [];
    const startDate = faker.date.recent(); // Date de départ pour le créneau
  
    for (let i = 0; i < 1; i++) { // Crée 5 créneaux par photographe
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
export const getFaker = async (c: Context) => {
  try {
    const users = [];
    for (let i = 0; i < 1; i++) {
      const fakerisPhotograph = faker.datatype.boolean();
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

    // Création des slots pour chaque photographe inséré
    const slots = [];    
    const gallery = [];
    for (const user of insertedUsers) {
        if(user.isPhotograph== true){
            const userSlots = createSlots(user._id.toString()); 
            const userGallery = createGallery(user._id.toString()); 
            slots.push(...userSlots);
            gallery.push(...userGallery);
        }
    }
    await SlotModel.insertMany(slots); 
    await GalleryModel.insertMany(gallery); 

    return c.json({ message: 'Data generated successfully', users: insertedUsers, slots });
  } catch (error) {
    console.error("Error generating data:", error);
    return c.json({ error: "Failed to generate data" }, 500);
  }
};
