import { getAllProducts, getProduct, getProductsbyCollection, getAllCollections } from "../lib/shopify"
import ProductPageContent from "../components/ProductPageContent"
import CategoryList from "../components/CategoryList"
import SubcategoryList from "../components/SubcategoryList"
import Sub_SubcategoryList from "../components/Sub_SubcategoryList"
import TypeList from '../components/TypeList'
import BrandList from "../components/BrandList"
import { useRouter } from 'next/router'
import collections from '../categories'
import brands from '../brands'


export default function Slug({ product, category, productsByCollection, productsBySubcollection, productsBySub_Subcollection, productsByBrand, productsByType, allCollections, allProducts }) {

  const router = useRouter()
  
  const { asPath } = router

  return (
  <>
    <main>
      <div className="md:min-h-screen md:py-12 md:pt-0">
        {
          product.length != 0 ?
          <ProductPageContent product={product} allProducts={allProducts} /> :
          null
        }
        {
          asPath === '/' + category[0] && 
          asPath !== '/' + product.handle ? 
          <CategoryList productsByCollection={productsByCollection} product={product} category={category[0]} subcategory={category[1]} sub_subcategory={category[2]} allCollections={allCollections} allProducts={allProducts} /> :
          null
        }
        {
          asPath === '/' + category[0] + '/' + category[1] &&
          asPath !== '/shop/' + category[1] ? 
          <SubcategoryList productsBySubcollection={productsBySubcollection} product={product} category={category[0]} subcategory={category[1]} sub_subcategory={category[2]} /> :
          null
        }
        {
          asPath === '/' + category[0] + '/' + category[1] + '/' + category[2] ? 
          <Sub_SubcategoryList productsBySub_Subcollection={productsBySub_Subcollection} product={product} category={category[0]} subcategory={category[1]} sub_subcategory={category[2]} type={category[3]} /> :
          null
        }
        {
          asPath === '/' + category[0] + '/' + category[1] + '/' + category[2] + '/' + category[3] ? 
          <TypeList productsByType={productsByType} product={product} category={category[0]} subcategory={category[1]} sub_subcategory={category[2]} type={category[3]} /> :
          null
        }
        {
          asPath === '/shop/' + category[1] ? 
          <BrandList productsByBrand={productsByBrand} product={product} brand={category[1]} /> :
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
          if (subcategory.handle !== "") {
            sub_SubcategoryPaths.push({
              params: {
                slug: [category.handle, subcategory.handle, sub_subcategory.handle]
              }
            })
          }
        }
      }
    }
  }
  const types = []
  for (let category of categories) {
    for (let subcategory of category.subcollections) {
      if (subcategory.sub_subcollections) {
        for (let sub_subcategory of subcategory.sub_subcollections) {
          if (sub_subcategory.types && subcategory.handle !== "") {
            for (let type of sub_subcategory.types) {
              if (type.handle !== "") {
                types.push({
                  params: {
                    slug: [category.handle, subcategory.handle, sub_subcategory.handle, type.handle]
                  }
                })
              }
            }
          }
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
  const brandPaths = []
  for (let shop of brands) {
    for (let brand of shop.subcollections) {
      brandPaths.push({
        params: {
          slug: [shop.handle, brand.handle]
        }
      })
    }
  }

    return {
      paths: [
        ...categoryPaths,
        ...subcategoryPaths,
        ...sub_SubcategoryPaths,
        ...productPaths,
        ...brandPaths,
        ...types
      ],
      fallback: false
    }
}

export async function getStaticProps({ params }) {
  const product = await getProduct(params.slug)
  const productsByCollection = await getProductsbyCollection(params.slug[0])
  const productsBySubcollection = await getProductsbyCollection(params.slug[1])
  const productsBySub_Subcollection = await getProductsbyCollection(params.slug[2])
  const productsByBrand = await getProductsbyCollection(params.slug[1])
  const productsByType = await getProductsbyCollection(params.slug[3])
  const allCollections = await getAllCollections()
  const allProducts = await getAllProducts()

    return {
        props: {
          category: params.slug || null,
          product,
          productsByCollection,
          productsBySubcollection,
          productsBySub_Subcollection,
          productsByBrand,
          productsByType,
          allCollections,
          allProducts
        }
      }
}
