import { signOut, useSession } from "next-auth/react"
// import { getSession } from "next-auth/react"
// import Image from 'next/image'
// import { formatter } from "../utils/helpers"
// import Shopify from '@shopify/shopify-api'
import Link from 'next/link'


export default function wishlist() {

  const { data: session } = useSession()

  return (
    <div className="flex flex-col w-[1000px] max-w-full mx-auto xxs:px-6 xs:!px-8 text-white">
        <div className="text-3xl font-bold mt-6">Account Dashboard</div>
        <div className="mb-[100px] mt-8 mx-auto flex flex-wrap xxs:flex-col md:!flex-row justify-center items-center">
          <span>Signed in as<span className="font-semibold">
          { ' ' + ' ' }{session?.user.email}</span></span>
          <button onClick={() => signOut()} className="xxs:mt-6 md:!mt-0 md:ml-24 border rounded-md p-2 w-28">Sign Out</button>
          </div>
          <div className="flex justify-center">
        <div className="flex flex-row justify-between items-center w-[500px] mb-[100px] text-xl">
            <Link href="/wishlist">
              <a>
                <button className="px-4 py-2 border border-white rounded-md">Wishlist</button>
              </a>
            </Link>
            <Link href="/order-history">
              <a>
                <button className="px-4 py-2 border border-white rounded-md">Order History</button>
              </a>
            </Link>
        </div>
        </div>
    </div>
  )
}