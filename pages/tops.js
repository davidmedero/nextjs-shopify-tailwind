import { getProductsInTops } from "../lib/shopify"
import ProductList from "../components/ProductList"


export default function Tops({ products }) {
  return (
    <div>
        <div>Tops</div>
        <ProductList products={products} />
        </div>
  )
}

export async function getStaticProps() {
    const products = await getProductsInTops()
  
    return {
      props: { products },
    }
  }