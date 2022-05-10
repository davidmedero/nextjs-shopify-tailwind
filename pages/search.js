import { useRouter } from "next/router"
import { useState, useEffect, useRef } from "react"
import ProductCard from "../components/ProductCard"
import { getAllProducts } from "../lib/shopify"


export default function search() {

const router = useRouter()

const query = router.query.query

const [products, setProducts] = useState([])

useEffect(async () => {
    const response = await getAllProducts()
    setProducts(response)
}, [])

const filteredProducts = products.filter(product => {
    if (query === '') {
        return product
    } else if (product.node.title.toLowerCase().includes(query.toLowerCase())) {
        return product
    }
}).map(product => (
    product.node.id
))


    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-3 px-4">
                <div className="flex flex-row items-center text-2xl pb-7 pl-1 w-full">
                {
                `WE FOUND ${filteredProducts.length} ${filteredProducts.length > 1 || filteredProducts.length === 0 ? 'RESULTS' : 'RESULT'
                } MATCHING`}
                &nbsp;
                <span className="text-fuchsia-500">{query?.toUpperCase()}</span>
                </div>
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {
                            products.filter(product => {
                                if (query === '') {
                                    return product
                                } else if (product.node.title.toLowerCase().includes(query.toLowerCase())) {
                                    return product
                                }
                            }).map(product => (
                                <ProductCard key={product.node.id} product={product} />
                            ))
                        }
                    </div>
            </div>
        </div>
    )
}