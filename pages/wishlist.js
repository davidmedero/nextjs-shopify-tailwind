import { signOut, useSession } from "next-auth/react"
// import { getSession } from "next-auth/react"
// import Image from 'next/image'
// import { formatter } from "../utils/helpers"
// import Shopify from '@shopify/shopify-api'
// import Link from 'next/link'


export default function wishlist() {

  const { data: session } = useSession()

  return (
    <div className="flex flex-col w-[1000px] max-w-full mx-auto xxs:px-6 xs:!px-8">
        <div className="mb-[100px] mt-[50px] mx-auto flex flex-wrap xxs:flex-col md:!flex-row justify-center items-center">
          <span>Signed in as<span className="font-semibold">
          { ' ' + ' ' }{session?.user.email}</span></span>
          <button onClick={() => signOut()} className="xxs:mt-6 md:!mt-0 md:ml-24 border rounded-md p-2 w-28">Sign Out</button>
          </div>
        <div className="text-3xl font-bold mb-20">Your Wishlist</div>
    </div>
  )
}