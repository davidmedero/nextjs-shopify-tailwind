import { getProductsInCollection } from "../lib/shopify"
import ProductList from "../components/ProductList"
import Hero from '../components/Hero'
import Head from 'next/head'


export default function Home({ products }) {
  
  return (
    <div className="text-3xl">
      <Head>
        <title>Modern eCommerce Template</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=ISO-8859-1" />
        <meta name="description" content="Modern eCommerce store template focusing on Shopify, Next.js, TailwindCSS and GraphQL. Additional topics include Storefront API, Static Site Generation, getStaticPaths, getStaticProps and more." />
        <meta property="og:title" content="Modern eCommerce Template" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content="" />
        <meta property="og:image" content="" /> */}
        <meta property="og:description" content="Modern eCommerce store template focusing on Shopify, Next.js, TailwindCSS, GraphQL. Additional topics include Storefront API, Static Site Generation, getStaticPaths, getStaticProps and more." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Modern eCommerce Template" />
      </Head>
      <Hero />
      <ProductList products={products} />
    </div>
  )
}

export async function getStaticProps() {
  const products = await getProductsInCollection()

  return {
    props: { products },
  }
}