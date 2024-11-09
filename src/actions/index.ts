import { loginUser, logout, registerUser } from './auth';
import { getProductsByPage } from './products/get-products-by-page.action';
import { getProductBySlug } from './products/get-product-by-slug.action';
import { loadProducts } from './cart/load-products.action';
import { createUpdateProduct } from './products/create-update-product.action';
import { deleteProductImg } from './products/delete-product-img.action';

export const server = {
    // actions

    // Auth
    loginUser,
    logout,
    registerUser,

    // Products
    getProductsByPage,
    getProductBySlug,
    
    // Cart
    loadProducts,
    
    // Admin Product
    createUpdateProduct,
    deleteProductImg
};
