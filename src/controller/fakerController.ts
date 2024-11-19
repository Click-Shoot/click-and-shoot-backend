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
    { label: "Mariage", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308194631409733785/mariage.jpg?ex=673d0eb1&is=673bbd31&hm=2c114a34d1537f506e4e8b57c85a6ec40b778066aa72953d3524f790f5c6a18b&" },
    { label: "Tinder & Réseaux Sociaux", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308195065235243038/tinder.jpg?ex=673d0f18&is=673bbd98&hm=d8a70a2acd65ac1fa8588bc37d02dc6773ef15d7909d4a2db7a4f432f762f620&" },
    { label: "Portrait Artistique", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308194632374554685/artistique.jpg?ex=673d0eb1&is=673bbd31&hm=442aa1d88b9c838431ac0320e20057712809d27e995c4376218e4fc63d875de9&" },
    { label: "Grossesse & Naissance", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308194631200149594/grossesse.jpg?ex=673d0eb1&is=673bbd31&hm=fe0847428ec70f84b8b494145c85c6bc6319c922e8b9f90706cd787ce54ba4ca&" },
    { label: "Shooting de Famille", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308194630466015292/famille.jpg?ex=673d0eb0&is=673bbd30&hm=83c8d174e8e6791a8b9e4a45ca660661064cffab79f91ee29357566419874013&" },
    { label: "Événements", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308194633385250898/evenement.png?ex=673d0eb1&is=673bbd31&hm=7fce7b73c0a0281ff019d7f3b77654f12b4250d2d1f3423a1ce01177bc176b54&" },
    { label: "Mode & Lookbook", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308194632051589120/shooting.jpg?ex=673d0eb1&is=673bbd31&hm=f0b929f7f4bc4737fc451fd25cd9aa76663c99127e4ef2180b87827608e90219&" },
    { label: "Corporate & Professionnel", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308194631695204442/pro.jpg?ex=673d0eb1&is=673bbd31&hm=233c4b62ee2f716c79c76e3ae500c309204cd974a3b2cd2614f980402ae5b0bb&" },
    { label: "Culinaire & Restauration", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308194633070673980/culinaire.jpg?ex=673d0eb1&is=673bbd31&hm=4b6fe05f3f9e2742bbbceed6c3dfd1dafde8b67ec84ec6bfdb166845756f6568&" },
    { label: "Couple & Romance", image: "https://cdn.discordapp.com/attachments/797953746357059584/1308194632760299640/couple.jpg?ex=673d0eb1&is=673bbd31&hm=5cebda78c79cf31370d60fc5a2ec74c320bbe5132578d27251e166ee8f9d6b9f&" },
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
  customersId?: mongoose.Types.ObjectId
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

    for (let i = 0; i < 2; i++) {
      // Crée 5 créneaux par photographe
      const startDate = faker.date.future() 
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 

      const slot = new SlotModel({
        start_date: startDate,
        end_date: endDate,
        location: cities[faker.number.int({ min: 0, max: cities.length - 1 })],
        photographId: photographerId,
        customersId: null,
        isReserved: false
      });

      slots.push(slot);
    }

    return slots;
  
}
function createGallerys(photographerId: mongoose.Types.ObjectId) {
  const fakergallery = [];
  const imagePossible = [
    'https://cdn.discordapp.com/attachments/797953746357059584/1307765971850629200/512-500x500.jpg?ex=673cd0f8&is=673b7f78&hm=f2a9e2f341284f737271bd2ef8c7831edcaf58c908876b8adff4d8420a3d1425&',
    'https://cdn.discordapp.com/attachments/797953746357059584/1307765972077379686/227-500x500.jpg?ex=673cd0f8&is=673b7f78&hm=676f0271265b0dc228916e96e22916a82015acfa7df77a7edb8d51fff980970e&',
    'https://cdn.discordapp.com/attachments/797953746357059584/1307765972303745104/798-500x500.jpg?ex=673cd0f8&is=673b7f78&hm=1f1f38fc3a22567fc42ee3689e98dcd4cee66e13cf47d6b1e20a4c5509dd94c8&',
    'https://cdn.discordapp.com/attachments/797953746357059584/1307765972525912156/198-500x500.jpg?ex=673cd0f8&is=673b7f78&hm=02d123d1108c4c861fe693b8752d04d36a7b31f700b3f70489903ef9d86dc245&',
    'https://cdn.discordapp.com/attachments/797953746357059584/1307765972748206220/121-500x500.jpg?ex=673cd0f9&is=673b7f79&hm=69d88c71d7bf1e281f88d0ddf3ef982c3d80fe16980c6f80930b89270c0a5473&',
    'https://cdn.discordapp.com/attachments/797953746357059584/1307765973020971018/983-500x500.jpg?ex=673cd0f9&is=673b7f79&hm=62640424ee2beb16396672863f5bec248d6fcec54363b5652a496dc6e0bf8b54&'
  ];
  const numgallery = faker.number.int({ min: 1, max: 5 });
  for (let i = 0; i < numgallery; i++) {
    fakergallery.push(imagePossible[faker.number.int({ min: 0, max: imagePossible.length - 1 })]);
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
      const possibleAvatar = ['Alexander', 'Sara', 'Nolan', 'Sophia', 'Andrea', 'Caleb', 'Mason', 'Oliver', 'Kimberly', 'Christopher', 'Jack', 'Liam', 'Leah', 'Valentina', 'Destiny']
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
        price: fakerisPhotograph ? faker.number.float({ min: 10, max: 100 }) : 0,
        avatar: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=' + possibleAvatar[faker.number.int({ min: 0, max: possibleAvatar.length - 1 })],
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
          user._id as mongoose.Types.ObjectId,
          randomUser ? randomUser._id as mongoose.Types.ObjectId : undefined
        );
        slots.push(...userSlots);
        const userGallery = createGallerys(user._id as mongoose.Types.ObjectId);
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
