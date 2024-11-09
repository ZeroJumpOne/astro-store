import type { CartItem } from "@/interfaces";
import Cookies from "js-cookie";


export class CartCookiesClient {

    static getCart(): CartItem[] {

        const cart = JSON.parse( Cookies.get('cart') ?? '[]' );

        return cart;
    }

    static addItem(cartItem: CartItem ): CartItem[] {

        const cart = CartCookiesClient.getCart();

        const isThereItemInCart = cart.find( (item) => item.product === cartItem.product && item.size === cartItem.size);

        if (isThereItemInCart) {
            isThereItemInCart.quantity += cartItem.quantity;
        } else {
            cart.push(cartItem);
        }

        Cookies.set('cart', JSON.stringify(cart));

        return cart;
    }

    static removeItem(cartItem: CartItem): CartItem[] {

        const cart = CartCookiesClient.getCart();
        const { product, size } = cartItem;


        console.log({ product, size } );


        const newCart = cart.filter( item => !(item.product === cartItem.product && item.size === cartItem.size) );

        Cookies.set('cart', JSON.stringify(newCart));

        return newCart;
    }
}