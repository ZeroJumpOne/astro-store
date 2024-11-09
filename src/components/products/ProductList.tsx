import type { ProductWithImages } from "@/interfaces"
// import { ProductCard } from "./ProductCard";
import { ProductCard } from "@/components";

interface Props {
    products: ProductWithImages[];
}



export const ProductList = ({ products }: Props) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 place-items-center">
            {
                products.map((item) => (
                    <ProductCard key={item.id} product={item}></ProductCard>
                ))
            }
        </div>
    )
}