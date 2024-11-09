import { ImageUpload } from "@/utils/image-upload";
import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { db, eq, ProductImage } from "astro:db";
import { getSession } from "auth-astro/server";


export const deleteProductImg = defineAction({
    accept: 'json',
    input: z.string(),
    handler: async (imageId, context) => {

        const { request } = context;

        const session = await getSession(request);
        const user = session?.user; 
        
        if (!user) {
            throw new Error('Unauthorized');
        }

        const [productImage] = await db
            .select()
            .from(ProductImage)
            .where(eq(ProductImage.id, imageId));

        if (!productImage) {
            throw new Error(`image width id ${ imageId } not found`);
        }

        const deleted = await db.delete(ProductImage)
            .where( eq(ProductImage.id, imageId));

        if (productImage.image.includes('http')) {
            await ImageUpload.delete(`${productImage.image}`);
        }

        return {ok: true};
    }
});