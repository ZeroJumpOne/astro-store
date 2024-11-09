import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_NAME,
    api_key: import.meta.env.CLOUDINARY_APIKEY,
    api_secret: import.meta.env.CLOUDINARY_APISEC
});

export class ImageUpload {

    static async upload(file: File) {

        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const imageType = file.type.split('/')[1]; // image/png

        const uploadResult = await cloudinary.uploader
            .upload(
                `data:image/${ imageType };base64,${base64Image}`, {
                    // asset_folder: 'astro-store',
                    public_id: file.name,
            }
            )
            .catch((error) => {
                console.log(error);
            });

        // console.log(uploadResult);

        return uploadResult?.secure_url;
    }

    static async delete( img: string) {

        try {
            const imageName = img.split('/').pop() ?? '';
            // console.log(imageName);
    
            const imageId = imageName.split('.')[0];
            // console.log(imageId);
    
            const resp = await cloudinary.uploader.destroy(imageId);
            // console.log(resp);
    
            return true;            
        } catch (error) {
            console.log(error);     
            return false;       
        }

    }

}