import ProductCard from "./ProductCard"

const CategoryList = ({ productsByCollection, category, product }) => {
  return (
    <div className="bg-white">
        <div className="max-w-7xl mx-auto py-3 px-4">
          <div className="text-2xl pb-7 pl-1">{
            category !== product.handle ?
            category.toString().charAt(0).toUpperCase() + category.toString().slice(1)
            : null
          }</div>
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