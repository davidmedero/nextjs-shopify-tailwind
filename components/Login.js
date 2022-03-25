import { signIn } from "next-auth/react"
import { useState } from 'react'
import { getCsrfToken } from "next-auth/react"
import Link from 'next/link'


export default function Login({ csrfToken, onClose }) {

  const [value, setValue] = useState("")


      return (
        <div>
          <form class="px-6 space-y-6 lg:px-8 pb-8">
      <h3 class="pb-7 pt-3 text-xl font-bold text-gray-900 dark:text-white text-center">Logo</h3>

      <form method="post" action="/api/auth/signin/email">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <input value={value} onChange={(e) => setValue(e.target.value)}className="focus:border-pink-300 hover:border-pink-300 h-[45px] border pl-2 mt-3 mb-6 w-full font-medium rounded-lg py-2.5" id="email" type="text" name="email" placeholder="email@example.com" />
      <Link href="/verify-request" passHref>
      <a>
      <button onClick={() => { onClose(); signIn("email", { email: value, redirect: false }) }} type="submit" className="h-[45px] transition-all ease-in-out duration-600 w-full text-white bg-pink-400 hover:bg-pink-500 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">Sign in with Email</button>
      </a>
      </Link>
      
      </form>


      <div className="divider">Or</div>
        
      <button onClick={() => signIn('google')} type="button" className="h-[45px] transition-all ease-in-out duration-600 w-full text-white bg-pink-400 hover:bg-pink-500 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">Sign in with Google</button>
  </form>
  
        </div>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    }
  }
}

