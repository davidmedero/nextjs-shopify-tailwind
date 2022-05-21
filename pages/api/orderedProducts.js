import { getAllProducts, getProduct } from "../../lib/shopify"


export async function orderedProducts() {
    const products = await getAllProducts()
  
    const paths = products.map(item => {
    const product = String(item.node.handle)
  
        return {
            params: { product }
        }
    })
  
    const handles = paths.map(item => item.params.product)
  
    const product = await getProduct(...handles)

    return product
  }