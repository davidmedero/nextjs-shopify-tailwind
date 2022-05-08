import { useState, useEffect, useRef } from "react"
import ProductCard from "./ProductCard"
import { getAllProducts } from "../lib/shopify"


export default function FilteredProducts({ query }) {
console.log(query)

const [products, setProducts] = useState([])

useEffect(async () => {
    const response = await getAllProducts()
    setProducts(response)
}, [query])

    return (
        <div>
            {
                query.length > 2 && (
                    products.filter(product => {
                        if (query === '') {
                            return product
                        } else if (product.node.title.toLowerCase().includes(query.toLowerCase())) {
                            return product
                        }
                    }).map(product => (
                        <ProductCard key={product.node.id} product={product} />
                    ))
                )
            }
        </div>
    )
}