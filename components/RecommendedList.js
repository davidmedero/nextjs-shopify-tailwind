import ProductCard from './ProductCard'

const RecommendedList = ({ products, current }) => {
    return (
      <div className="bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
           <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {
                  products.map((product, i) => (
                      product.node.id === current ? null : i < 5 ? <ProductCard key={product.node.id} product={product} /> : null
                  ))
              }
           </div>
          </div>
          </div>
    )
  }
  
  export default RecommendedList