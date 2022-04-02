import Link from "next/link"
import Nav from '../components/Nav'
import { getAllProducts, getProduct, getAllCollections, getProductsbyCollection } from "../lib/shopify"
import ProductPageContent from "../components/ProductPageContent"
import CategoryList from "../components/CategoryList"
import SubcategoryList from "../components/SubcategoryList"
import { useRouter } from 'next/router'
import collections from '../categories'


export default function Slug({ product, category, productsByCollection, productsBySubcollection }) {

  const router = useRouter()
  
  const { asPath } = router

  return (
  <>
    <main>
      <div className="md:min-h-screen md:py-12 md:pt-20">
        {
          product.length != 0 ?
            <ProductPageContent product={product} /> :
          null
        }
        {
          asPath === '/' + category[0] ? 
          <CategoryList productsByCollection={productsByCollection} /> :
          null
        }
        {
          asPath === '/' + category[0] + '/' + category[1] ? 
          <SubcategoryList productsBySubcollection={productsBySubcollection} /> :
          null
        }      
      </div>
    </main>
  </>
  )
}

export async function getStaticPaths() {
  const categories = collections
  const categoryPaths = categories.map(category => {
    return {
      params: { slug: [category.handle] }
    }
  })
  const subcategoryPathsForClothing = categories[0].subcollections.map(subcategory => {
    return {
      params: { slug: [categories[0].handle, subcategory.handle] }
    }
  })
  const subcategoryPathsForShoes = categories[1].subcollections.map(subcategory => {
    return {
      params: { slug: [categories[1].handle, subcategory.handle] }
    }
  })
  const subcategoryPathsForAccessories = categories[2].subcollections.map(subcategory => {
    return {
      params: { slug: [categories[2].handle, subcategory.handle] }
    }
  })
  const subcategoryPathsForBeauty = categories[3].subcollections.map(subcategory => {
    return {
      params: { slug: [categories[3].handle, subcategory.handle] }
    }
  })

  const products = await getAllProducts()
  const productPaths = products.map(item => {
    const product = String(item.node.handle)

    return {
      params: { slug: [product] }
    }
  })
  
    return {
      paths: [
        ...categoryPaths,
        ...subcategoryPathsForClothing,
        ...subcategoryPathsForShoes,
        ...subcategoryPathsForAccessories,
        ...subcategoryPathsForBeauty,
        ...productPaths
      ],
      fallback: false
    }
}

export async function getStaticProps({ params }) {
  const product = await getProduct(params.slug)
  const productsByCollection = await getProductsbyCollection(params.slug[0])
  const productsBySubcollection = await getProductsbyCollection(params.slug[1])
    return {
        props: {
          category: params.slug || null,
          product,
          productsByCollection,
          productsBySubcollection
        }
      }
}