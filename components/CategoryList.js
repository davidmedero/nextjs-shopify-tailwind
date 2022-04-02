import ProductCard from "./ProductCard"

const CategoryList = ({ productsByCollection }) => {
  return (
    <div className="bg-white">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
         <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {
                productsByCollection.map(product => (
                    <ProductCard key={product.node.id} product={product}/>
                ))
            }
         </div>
        </div>
        </div>
  )
}

export default CategoryList