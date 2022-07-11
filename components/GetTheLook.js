import ProductCard from './ProductCard'

const GetTheLook = ({ current, product, allProducts }) => {

    const productsByType = allProducts.map((prod, i) => {
        if ((prod.node.productType === product.productType) && (prod.node.id !== current)) {
            return prod
        }
    }).filter(el => el !== undefined)

    return (
      <div className="bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
           <h2 className="text-2xl font-extrabold text-white mb-6">
               GET THE LOOK
           </h2>
           <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {
                  productsByType.map((prod, i) => (
                      i < 5 && <ProductCard key={prod.id} product={prod} />
                  ))
              }
           </div>
          </div>
          </div>
    )
  }
  
  export default GetTheLook