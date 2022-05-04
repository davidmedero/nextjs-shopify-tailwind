import ProductCard from "./ProductCard"
import Link from 'next/link'
import { useState } from "react"


const SubcategoryList = ({ productsBySubcollection, category, subcategory, product }) => {

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
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-3 px-4 lg:max-w-7xl">
        <div className="text-2xl pb-3 pl-1">{
          subcategory !== product.handle ?
          subcategory.toString().charAt(0).toUpperCase() + subcategory.toString().slice(1)
          : null
        }</div>
        <div className="flex flow-row text-sm pb-7 pl-1">
        <div>
            <Link href={'/'}>
              <a className="hover:underline text-[#8d8d8d] font-semibold">
                Home
              </a>
            </Link>
          </div>
          &nbsp;
            {
              ' ' + '/' + ' '
            }
          &nbsp;
          <div>
            <Link href={`/${category}`}>
              <a className="hover:underline text-[#8d8d8d] font-semibold">
                {category.toString().charAt(0).toUpperCase() + category.toString().slice(1)}
              </a>
            </Link>
          </div>
          &nbsp;
            {
              ' ' + '/' + ' '
            }
          &nbsp;
          <div className="font-semibold">
                {subcategory.toString().charAt(0).toUpperCase() + subcategory.toString().slice(1)}
          </div>
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
         <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
         {
                (sortOption === 'Best Sellers') ? (
                  productsBySubcollection.map(product => (
                    <ProductCard key={product.node.id} product={product} />
                ))
                ) : (sortOption === 'Newest') ? (
                  [...productsBySubcollection].sort((a, b) => (
                    (a.node.createdAt < b.node.createdAt) ? 1 : ((a.node.createdAt > b.node.createdAt) ? -1 : 0)
                  )).map(product => (
                      <ProductCard key={product.node.id} product={product} />
                  ))
                ) : (sortOption === 'Highest Price') ? (
                  [...productsBySubcollection].sort((a, b) => (
                    (a.node.priceRange.minVariantPrice.amount < b.node.priceRange.minVariantPrice.amount) ? 1 : ((a.node.priceRange.minVariantPrice.amount > b.node.priceRange.minVariantPrice.amount) ? -1 : 0)
                  )).map(product => (
                      <ProductCard key={product.node.id} product={product} />
                  )) 
                ) : (sortOption === 'Lowest Price') ? (
                  [...productsBySubcollection].sort((a, b) => (
                      (a.node.priceRange.minVariantPrice.amount < b.node.priceRange.minVariantPrice.amount) ? -1 : ((a.node.priceRange.minVariantPrice.amount > b.node.priceRange.minVariantPrice.amount) ? 1 : 0)
                    )).map(product => (
                        <ProductCard key={product.node.id} product={product} />
                    ))
                ) : null
              }
         </div>
        </div>
        </div>
  )
}

export default SubcategoryList