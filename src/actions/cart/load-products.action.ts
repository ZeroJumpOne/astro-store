import type { CartItem } from "@/interfaces";
import { defineAction } from "astro:actions";
import { db, eq, inArray, Product, ProductImage } from "astro:db";
import { z } from "astro/zod";


export const loadProducts = defineAction({
    accept: 'json',
    input: z.string(),
    handler: async (galleta) => {
        // console.log({galleta});

        const cart = JSON.parse(galleta) as CartItem[];
        // console.log(galleta);

        if (cart.length === 0) return [];

        // load products
        const productIds = cart.map((item) => item.product);
        // console.log(productIds);

        const dbProducts = await db
            .select()
            .from(Product)
            .innerJoin(ProductImage, eq(ProductImage.product, Product.id))
            .where(inArray(Product.id, productIds));
        console.log(dbProducts);

        return cart.map((item) => {

            const dbProduct = dbProducts.find((p) => p.Product.id === item.product);

            if (!dbProduct) {
                throw new Error(`Product with id ${item.product} not found`);
            }

            const { title, price, slug } = dbProduct.Product;
            const image = dbProduct.ProductImage.image;

            return {
                product: item.product,
                title: title,
                size: item.size,
                quantity: item.quantity,
                image: image.startsWith('http') ? image : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
                price: price,
                slug: slug,
            }

        });

    },

});