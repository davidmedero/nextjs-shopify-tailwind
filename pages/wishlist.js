import { signOut, useSession } from "next-auth/react"
import fetch from 'isomorphic-unfetch'
import { getAllProducts } from '../lib/shopify'
import WishlistProductCard from "../components/WishlistProductCard"


export default function wishlist({ data, products }) {

  return (
    <div className="flex flex-col w-[1000px] max-w-full mx-auto xxs:px-6 xs:!px-8 text-white">
        <div className="text-3xl font-bold mt-6 mb-20">Your Wishlist</div>
        <div className="xxs:-mx-4 sm:mx-0 grid grid-cols-2 gap-y-10 gap-x-[22px] sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 cursor-pointer">
          {
            products.map(product => (
              data.map(item => {
                console.log(item.saved_items.join(''), product.node.handle)
                if (item.saved_items.includes(product.node.handle)) {
                  return <WishlistProductCard key={product.node.id} product={product} />
                }
              })
            ))
          }
        </div>
    </div>
  )
}

export async function getStaticProps() {
  const products = await getAllProducts()
  const res = await fetch("http://localhost:3000/api/wishlist-endpoint")
  const json = await res.json()
  return {
    props: {
      data: json,
      products
    },
  };
}