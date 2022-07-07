import { useRouter } from "next/router"
import ProductCard from "../components/ProductCard"
import { getAllProducts } from "../lib/shopify"
import { useEffect, useState } from "react"
import colors from '../colors.js'


export default function search({ products }) {

const router = useRouter()

const query = router.query.query

const colorVals = (colors.map(color => {
    return Object.values(color)
  }).flat()).flat()

const filteredProducts = products.filter(product => {
    if (query === '') {
        return product
    } else if (product.node.tags.some(tag => tag.includes(query?.toLowerCase())) && query?.toLowerCase().split(' ').length < 2) {
        return product
    } else if (product.node.title.toLowerCase().split(' ').some(el => query?.toLowerCase().split(' ').includes(el))) {
        return product
    } else if (product.node.tags.some(tag => query?.toLowerCase().split(' ').includes(tag)) && query?.toLowerCase().split(' ').some(el => product.node.title.toLowerCase().includes(el))) {
        return product
    } else if (query?.toLowerCase().split(' ').some(el => product.node.title.toLowerCase().includes(el))) {
        return product
    }
})

const [filteredColorPic, setFilteredColorPic] = useState([])

const [filteredShade, setFilteredShade] = useState([])

useEffect(() => {
    products.map(product => {
        product.node.tags.some(tag => {
            if (query?.toLowerCase().split(' ').includes(tag)) {
                setFilteredColorPic([tag])
            }
        })
    })

    colorVals.some(color => {
        if (query?.toLowerCase().split(' ').filter(el => el !== '').includes(color)) {
            setFilteredShade([color])
        }
    })

}, [query])

console.log(filteredShade, "SPACE", query?.toLowerCase().split(' ').filter(el => el !== ''))

const [showSortOptions, setShowSortOptions] = useState(false)

const [sortOption, setSortOption] = useState('Best Sellers')

function sortByBestSellers() {
    setSortOption('Best Sellers')
}

function sortByNewest() {
    setSortOption('Newest')
}

function sortByHighestPrice() {
    setSortOption('Highest Price')
}

function sortByLowestPrice() {
    setSortOption('Lowest Price')
}


    return (
        <div className="pt-3 bg-[#0a0a0a] text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-row items-center w-full flex-wrap">
                    <span className="my-5">
                        <span className="text-2xl pl-1">
                        {
                        `WE FOUND ${filteredProducts.length}`
                        }
                        </span>
                        { ' ' }
                        <span className="text-2xl pl-1">{filteredProducts.length > 1 || filteredProducts.length === 0 ? 'RESULTS' : 'RESULT'}</span>
                        { ' ' }
                        <span className="text-2xl pl-1">MATCHING</span>
                        { ' ' }
                        <span className="text-fuchsia-500 text-2xl pl-1 pr-6">{query?.toUpperCase()}</span>
                    </span>
                    <div className="ml-auto">
                    <div>
                    <div 
                    onMouseOver={() => setShowSortOptions(true)}
                    onMouseLeave={() => setShowSortOptions(false)}>
                    <span className="border-2 p-1 pl-3 flex w-[200px] items-center justify-between">
                        <span className="select-none">SORT</span>
                        <span><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 float-right" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        </span>
                    </span>
                    {
                        showSortOptions && (
                            <div className='absolute z-50 whitespace-nowrap bg-white'>
                                <div 
                                onClick={() => {
                                sortByBestSellers();
                                setShowSortOptions(false)
                                }}
                                className='w-[200px] p-3 hover:bg-pink-100 cursor-pointer'>Best Sellers</div>
                                <div 
                                onClick={() => {
                                sortByNewest();
                                setShowSortOptions(false)
                                }}
                                className='w-[200px] p-3 hover:bg-pink-100 cursor-pointer'>Newest</div>
                                <div 
                                onClick={() => {
                                sortByHighestPrice();
                                setShowSortOptions(false)
                                }}
                                className='w-[200px] p-3 hover:bg-pink-100 cursor-pointer'>Highest Price</div>
                                <div 
                                onClick={() => {
                                sortByLowestPrice();
                                setShowSortOptions(false)
                                }}
                                className='w-[200px] p-3 hover:bg-pink-100 cursor-pointer'>Lowest Price</div>
                            </div>
                        )
                    }
                    </div>
                    </div>
                    </div>
                </div>
                    <div className="pt-7 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {
                            (sortOption === 'Best Sellers') ? (
                            filteredProducts.map(product => (
                                <ProductCard key={product.node.id} product={product} filteredColorPic={filteredColorPic} filteredShade={filteredShade} />
                            ))
                            ) : (sortOption === 'Newest') ? (
                            filteredProducts.sort((a, b) => (
                                (a.node.createdAt < b.node.createdAt) ? 1 : ((a.node.createdAt > b.node.createdAt) ? -1 : 0)
                              )).map(product => (
                                <ProductCard key={product.node.id} product={product} filteredColorPic={filteredColorPic} filteredShade={filteredShade} />
                            ))
                            ) : (sortOption === 'Highest Price') ? (
                            filteredProducts.sort((a, b) => (
                                (a.node.priceRange.minVariantPrice.amount < b.node.priceRange.minVariantPrice.amount) ? 1 : ((a.node.priceRange.minVariantPrice.amount > b.node.priceRange.minVariantPrice.amount) ? -1 : 0)
                              )).map(product => (
                                  <ProductCard key={product.node.id} product={product} filteredColorPic={filteredColorPic} filteredShade={filteredShade} />
                              )) 
                            ) : (sortOption === 'Lowest Price') ? (
                            filteredProducts.sort((a, b) => (
                                (a.node.priceRange.minVariantPrice.amount < b.node.priceRange.minVariantPrice.amount) ? -1 : ((a.node.priceRange.minVariantPrice.amount > b.node.priceRange.minVariantPrice.amount) ? 1 : 0)
                              )).map(product => (
                                <ProductCard key={product.node.id} product={product} filteredColorPic={filteredColorPic} filteredShade={filteredShade} />
                            )) 
                          ) : null
                        }
                    </div>
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const products = await getAllProducts()
  
    return {
      props: { products }
    }
  }