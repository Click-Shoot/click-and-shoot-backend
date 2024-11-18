import { GalleryModel } from "../models/galleryModel";
import { UserModel } from "../models/userModel";

export const generateGallery = async () => {
    try {
        const photographers = await UserModel.find({ isPhotograph: true });
        const galleries = await GalleryModel.find();

        if (galleries.length === 0) {
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
        } else {
        }
    } catch (error) {
    }
};
