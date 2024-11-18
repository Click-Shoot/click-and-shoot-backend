import { generateUsers } from './user';
import { generateGallery } from './gallery';
import { UserModel } from '../models/userModel';
import { GalleryModel } from '../models/galleryModel';

async function generateFixtures() {
    try {
        const userCount = await UserModel.countDocuments();
        if (userCount === 0) {
            await generateUsers();
        }

        const galleryCount = await GalleryModel.countDocuments();
        if (galleryCount === 0) {
            await generateGallery();
        }

        console.log("Tous les fixtures nécessaires ont été générés.");
    } catch (error) {
        console.error("Erreur lors de la génération des fixtures :", error);
    }
}

export default generateFixtures;
