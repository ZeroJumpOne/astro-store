import { itemsInCart } from "@/cart"
import { CartCookiesClient } from "@/utils";
import { useStore } from '@nanostores/react';
import { useEffect } from "react";


export const CartCounter = () => {

    const $itemsInCart = useStore(itemsInCart);

    useEffect(() => {

        const cart = CartCookiesClient.getCart();

        itemsInCart.set(cart.length);

    });

    return (
        <a href="/cart" className="relative inline-block">

            {
                $itemsInCart > 0 && (
                    <span className="absolute -top-2 -right-2 flex justify-center items-center bg-blue-600 text-white text-xs rounded-full w-5 h-5">
                        {$itemsInCart}
                    </span>
                )
            }

            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512"><path fill="currentColor" d="m25.45 63.043l-4.364 17.463l8.73 2.18l60.624 15.16l29.402 44.1l62.44 187.32l-36.845 73.693h17.827a31.6 31.6 0 0 0-3.264 14c0 17.567 14.433 32 32 32s32-14.433 32-32c0-5.01-1.178-9.762-3.264-14h102.528a31.6 31.6 0 0 0-3.264 14c0 17.567 14.433 32 32 32s32-14.433 32-32c0-5.01-1.178-9.762-3.264-14H393v-18H174.562l23-46h192.924l70-210h-327.67L101.56 82.07L34.183 65.227zm115.038 83.914H231v46h-75.178zm108.512 0h78v46h-78zm96 0h90.512l-15.334 46H345zm-183.18 64H231v46h-53.846zm87.18 0h78v46h-78zm96 0h69.18l-15.334 46H345zm-161.846 64H231v46h-32.514zm65.846 0h78v46h-78zm96 0h47.846l-15.332 46H345zm-153 128c7.84 0 14 6.16 14 14s-6.16 14-14 14s-14-6.16-14-14s6.16-14 14-14m160 0c7.84 0 14 6.16 14 14s-6.16 14-14 14s-14-6.16-14-14s6.16-14 14-14"></path></svg>
        </a>
    )
}