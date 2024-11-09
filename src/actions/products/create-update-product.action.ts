import { ImageUpload } from "@/utils/image-upload";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { db, eq, Product, ProductImage } from "astro:db";
import { getSession } from "auth-astro/server";
import { error } from "node_modules/astro/dist/core/logger/core";
import { v4 as UUID } from "uuid";

const MAX_FILE_SIZE = 5_000_000; //5 MB
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
]


export const createUpdateProduct = defineAction({
    accept: 'form',
    input: z.object({
        id: z.string().optional(),
        description: z.string(),
        gender: z.string(),
        price: z.number(),
        sizes: z.string(),
        slug: z.string(),
        stock: z.number(),
        tags: z.string(),
        title: z.string(),
        type: z.string(),

        imageFiles: z.array(
            z.instanceof(File)
                .refine( (file) => file.size <= MAX_FILE_SIZE, 'Max image size 5MB')
                .refine( (file) => {
                    return ACCEPTED_IMAGE_TYPES.includes(file.type);
                }, `Only supported image file valid, ${ ACCEPTED_IMAGE_TYPES.join(',') }`)
        ).optional(),
    }),
    handler: async (formulario, context) => {
        const { request } = context;

        const session = await getSession(request);
        const user = session?.user;
        // console.log('usuario!!!',user);

        if (!user) {
            throw new Error('Unauthorized');
        }
        
        const { id = UUID(), imageFiles, ...rest} = formulario;

        rest.slug = rest.slug.toLocaleLowerCase().replaceAll(' ', '-').trim();

        const product = {
            id: id,
            user: user.id,
            ...rest
        }
        // console.log(product);


        const queries: any = [];

        if (!formulario.id) {
            queries.push(
                db.insert(Product).values(product)
            )
        } else {
            queries.push(
                db.update(Product).set(product).where( eq(Product.id, id) )
            )
        }

        // Imagenes
        // console.log( {imageFiles} );
        const secureUrls: string[] = [];
        if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {

            const urls = await Promise.all(
                imageFiles.map( (imgFile) => ImageUpload.upload(imgFile) )
            );

            if (urls.length > 0) {
                secureUrls.push(...urls);
            }
        }

        secureUrls.forEach( (imgUrl) => {

            const imgObj = {
                id: UUID(),
                image: imgUrl,
                product: product.id,
            }

            queries.push(db.insert(ProductImage).values( imgObj ));
        });



        // imageFiles?.forEach( async (imgFile) => {

        //     if( imgFile.size <= 0) return;

        //     const url = await ImageUpload.upload(imgFile);
        // });

        await db.batch(queries);

        return product;
    }

})