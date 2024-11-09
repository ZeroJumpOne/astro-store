import type { ProductWithImages } from "@/interfaces";
import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { count, db, eq, Product, ProductImage, sql } from "astro:db";


export const getProductsByPage = defineAction({
    accept: 'json',
    input: z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(12),
    }),
    handler: async ({ page, limit }) => {

        page = page <= 0 ? 1 : page;

        const [totalrecords] = await db.select({ count: count() }).from(Product);
        const totalPages = Math.ceil(totalrecords.count / limit);

        if (page > totalPages) {
            page = totalPages;
        }

        // const products = await db.select().from(Product).limit(limit).offset((page - 1) * 12);

        const productsQuery = sql`
            select a.*,
                (select GROUP_CONCAT(image,',') from
                ( select * from ${ProductImage} where product = a.id limit 2 ) ) as images
            from ${Product} a
            LIMIT ${limit} OFFSET ${(page - 1) * limit};
        `;

        const { rows } = await db.run( productsQuery );
        // console.log(rows);

        const products = rows.map( (product) => {
            return {
                ...product,
                images: product.images ? product.images : 'no-image.png',
            } as unknown as ProductWithImages[];
        });

        console.log({products});


        return {
            // products: rows as unknown as ProductWithImages[],
            products: products,
            totalPages: totalPages,
        }
    }

});