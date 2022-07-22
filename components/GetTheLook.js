import ProductCard from './ProductCard'

const GetTheLook = ({ product, allProducts }) => {

    const gtlProducts = allProducts.map((prod, i) => {
        if (((JSON.parse(product.metafield.value)).getTheLook).some(el => el === prod.node.handle)) {
            return prod
        }
    }).filter(el => el !== undefined)

    return (
      <div className="bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
           <div className="grid grid-cols-1 gap-y-10 gap-x-3 sm:grid-cols-3 md:grid-cols-4">
              {
                 gtlProducts && gtlProducts.map((prod, i) => (
                      i < 5 && <ProductCard key={prod.node.id} product={prod} />
                  ))
              }
           </div>
          </div>
          </div>
    )
  }
  
  export default GetTheLook