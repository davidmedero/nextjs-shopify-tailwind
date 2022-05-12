import ProductCard from "./ProductCard"
import Link from "next/link"
import { useState } from "react"


const CategoryList = ({ productsByCollection, category, product }) => {

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
        <div className="mx-auto py-3 xxs:px-4 sm:px-12">
        <div className="flex flex-wrap flex-row items-center text-sm pt-2 w-full">
          <div className="text-2xl font-semibold xxs:mb-2">{
            category !== product.handle ?
            category.toString().charAt(0).toUpperCase() + category.toString().slice(1)
            : null
          }</div>
          <div className="md:ml-auto md:flex md:flex-row xxs:hidden">
            <div>
            <div 
            onMouseOver={() => setShowSortOptions(true)}
            onMouseLeave={() => setShowSortOptions(false)}>
                <span className="border-2 border-black p-1 pl-3 flex w-[200px] items-center justify-between">
                    <span className="select-none font-semibold">SORT</span>
                    <span><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 float-right" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    </span>
                </span>
                {
                    showSortOptions && (
                        <div className='w-[200px] absolute z-50 whitespace-nowrap bg-white border-2'>
                            <div 
                            onClick={() => {
                              sortByBestSellers();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Best Sellers' ? 'w-[197px] p-3 hover:bg-pink-100 cursor-pointer border-b font-semibold' : 'w-[197px] p-3 hover:bg-pink-100 cursor-pointer border-b'}>Best Sellers</div>
                            <div 
                            onClick={() => {
                              sortByNewest();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Newest' ? 'w-[197px] p-3 hover:bg-pink-100 cursor-pointer border-b font-semibold' : 'w-[197px] p-3 hover:bg-pink-100 cursor-pointer border-b'}>Newest</div>
                            <div 
                            onClick={() => {
                              sortByHighestPrice();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Highest Price' ? 'w-[197px] p-3 hover:bg-pink-100 cursor-pointer border-b font-semibold' : 'w-[197px] p-3 hover:bg-pink-100 cursor-pointer border-b'}>Highest Price</div>
                            <div 
                            onClick={() => {
                              sortByLowestPrice();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Lowest Price' ? 'w-[197px] p-3 hover:bg-pink-100 cursor-pointer border-b font-semibold' : 'w-[197px] p-3 hover:bg-pink-100 cursor-pointer border-b'}>Lowest Price</div>
                        </div>
                    )
                }
            </div>
            </div>
              <span className="border-2 border-black ml-5 p-1 pl-3 flex w-[200px] items-center justify-between">
                <span className="select-none font-semibold">FILTER</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </span>
          </div>
          </div>
          <div className="flex flex-row items-center text-sm xxs:mb-6 w-full">
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
          <div className="font-semibold text-[#f1018a]">
                {category.toString().charAt(0).toUpperCase() + category.toString().slice(1)}
          </div>
          </div>
          <div className="flex flex-row justify-between mb-6 md:hidden">
            <div>
            <div 
            onMouseOver={() => setShowSortOptions(true)}
            onMouseLeave={() => setShowSortOptions(false)}>
                <span className="border-2 border-black p-1 pl-3 flex xxs:w-[calc(50.6vw-35%)] sm:w-[calc(46vw-35%)] items-center justify-between">
                    <span className="select-none font-semibold">SORT</span>
                    <span><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    </span>
                </span>
                {
                    showSortOptions && (
                      <div className="xxs:absolute">
                        <div className='xxs:w-[calc(-35%+53vw)] sm:w-[calc(-35%+48vw)] relative z-50 whitespace-nowrap bg-white border-2'>
                            <div 
                            onClick={() => {
                              sortByBestSellers();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Best Sellers' ? 'p-3 hover:bg-pink-100 cursor-pointer border-b font-semibold' : 'p-3 hover:bg-pink-100 cursor-pointer border-b'}>Best Sellers</div>
                            <div 
                            onClick={() => {
                              sortByNewest();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Newest' ? 'p-3 hover:bg-pink-100 cursor-pointer border-b font-semibold' : 'p-3 hover:bg-pink-100 cursor-pointer border-b'}>Newest</div>
                            <div 
                            onClick={() => {
                              sortByHighestPrice();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Highest Price' ? 'p-3 hover:bg-pink-100 cursor-pointer border-b font-semibold' : 'p-3 hover:bg-pink-100 cursor-pointer border-b'}>Highest Price</div>
                            <div 
                            onClick={() => {
                              sortByLowestPrice();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Lowest Price' ? 'p-3 hover:bg-pink-100 cursor-pointer border-b font-semibold' : 'p-3 hover:bg-pink-100 cursor-pointer border-b'}>Lowest Price</div>
                        </div>
                      </div>
                    )
                }
            </div>
            </div>
              <span className="border-2 border-black p-1 pl-3 flex xxs:w-[calc(100%-49.5vw)] sm:w-[calc(100%-45vw)] items-center justify-between">
                <span className="select-none font-semibold">FILTER</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </span>
          </div>
            <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {
                (sortOption === 'Best Sellers') ? (
                  productsByCollection.map(product => (
                    <ProductCard key={product.node.id} product={product} />
                ))
                ) : (sortOption === 'Newest') ? (
                  [...productsByCollection].sort((a, b) => (
                    (a.node.createdAt < b.node.createdAt) ? 1 : ((a.node.createdAt > b.node.createdAt) ? -1 : 0)
                  )).map(product => (
                      <ProductCard key={product.node.id} product={product} />
                  ))
                ) : (sortOption === 'Highest Price') ? (
                  [...productsByCollection].sort((a, b) => (
                    (a.node.priceRange.minVariantPrice.amount < b.node.priceRange.minVariantPrice.amount) ? 1 : ((a.node.priceRange.minVariantPrice.amount > b.node.priceRange.minVariantPrice.amount) ? -1 : 0)
                  )).map(product => (
                      <ProductCard key={product.node.id} product={product} />
                  )) 
                ) : (sortOption === 'Lowest Price') ? (
                  [...productsByCollection].sort((a, b) => (
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

export default CategoryList