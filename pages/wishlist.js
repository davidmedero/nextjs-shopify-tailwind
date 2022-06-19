import { getSession, useSession } from "next-auth/react"
import fetch from 'isomorphic-unfetch'
import { getAllProducts } from '../lib/shopify'
import WishlistProductCard from "../components/WishlistProductCard"
import { useEffect, useState } from "react"


export default function wishlist({ data, products }) {

  const { data: session } = useSession()
  const email = session?.user.email

  const user = data.map(el => (
    (el.email === email) && el
  )).filter(el => el !== false)

  const savedItems = user.map(item => item.saved_items)

  let wishlistArray = []
  
  products.map(product => (
    user.map(item => (
      (item.saved_items.includes(product.node.handle)) 
        ? wishlistArray.push(product)
        : null
    ))
  ))
  

  return (
    <div className="flex flex-col w-[1000px] max-w-full mx-auto xxs:px-6 xs:!px-8 text-white">
        <div className="text-3xl font-bold mt-6 mb-20">Your Wishlist</div>
        <div className="xxs:-mx-4 sm:mx-0 grid grid-cols-2 gap-y-10 gap-x-[22px] sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 cursor-pointer">
          {
            wishlistArray.map(product => (
              <WishlistProductCard key={product.node.id} product={product} />
            ))
          }
        </div>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const products = await getAllProducts()
  const res = await fetch("https://nextjs-shopify-tailwind-wine.vercel.app/api/wishlist-endpoint")
  const json = await res.json()
  return {
    props: {
      data: json,
      products
    },
  };
}