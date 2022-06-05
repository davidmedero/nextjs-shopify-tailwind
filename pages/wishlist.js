import { signOut, useSession } from "next-auth/react"
// import { getSession } from "next-auth/react"
// import Image from 'next/image'
// import { formatter } from "../utils/helpers"
// import Shopify from '@shopify/shopify-api'
// import Link from 'next/link'


export default function wishlist() {

  const { data: session } = useSession()

  return (
    <div className="flex flex-col w-[1000px] max-w-full mx-auto xxs:px-6 xs:!px-8 text-white">
        <div className="text-3xl font-bold mt-6 mb-20">Your Wishlist</div>
    </div>
  )
}