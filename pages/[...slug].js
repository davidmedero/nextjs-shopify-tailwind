import Link from "next/link"
import Nav from '../components/Nav'
import { getAllProducts, getProduct, getAllCollections, getProductsbyCollection } from "../lib/shopify"
import ProductPageContent from "../components/ProductPageContent"
import CategoryList from "../components/CategoryList"
import SubcategoryList from "../components/SubcategoryList"
import Sub_SubcategoryList from "../components/Sub_SubcategoryList"
import { useRouter } from 'next/router'
import collections from '../categories'


export default function Slug({ product, category, productsByCollection, productsBySubcollection, productsBySub_Subcollection }) {

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
        {
          asPath === '/' + category[0] + '/' + category[1] + '/' + category[2] ? 
          <Sub_SubcategoryList productsBySub_Subcollection={productsBySub_Subcollection} /> :
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
  const subcategoryPaths = []
  for (let category of categories) {
    for (let subcategory of category.subcollections) {
      subcategoryPaths.push({
        params: {
          slug: [category.handle, subcategory.handle]
        }
      })
    }
  }
  const sub_SubcategoryPaths = []
  for (let category of categories) {
    for (let subcategory of category.subcollections) {
      if (subcategory.sub_subcollections) {
        for (let sub_subcategory of subcategory.sub_subcollections) {
          sub_SubcategoryPaths.push({
            params: {
              slug: [category.handle, subcategory.handle, sub_subcategory.handle]
            }
          })
        }
      }
    }
  }
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
        ...subcategoryPaths,
        ...sub_SubcategoryPaths,
        ...productPaths
      ],
      fallback: false
    }
}

export async function getStaticProps({ params }) {
  const product = await getProduct(params.slug)
  const productsByCollection = await getProductsbyCollection(params.slug[0])
  const productsBySubcollection = await getProductsbyCollection(params.slug[1])
  const productsBySub_Subcollection = await getProductsbyCollection(params.slug[2])
    return {
        props: {
          category: params.slug || null,
          product,
          productsByCollection,
          productsBySubcollection,
          productsBySub_Subcollection
        }
      }
}