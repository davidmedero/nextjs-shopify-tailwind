import { useEffect, useState } from "react"
import SignInModal from './SignInModal'
import Link from 'next/link'
import { useSession } from "next-auth/react"
import useSWR from "swr"
import axios from "axios"


const fetcher = url => axios.get(url).then(res => res.data)


export default function SignInButton() {

  const { data: session } = useSession()
  const email = session?.user.email

  const [showModal, setShowModal] = useState(false)

  const [added, setAdded] = useState(false)

  const { data, error } = useSWR('/api/wishlist-endpoint', fetcher)

  const savedItems = data && data.map(el => {
    if (el.email === email) {
      return el.saved_items
    }
  }).filter(el => el != undefined)

  useEffect(() => {
    if (savedItems) {
      if (savedItems[0]) {
        if (savedItems[0].length > 0) {
          setAdded(true)
        } else {
          setAdded(false)
        }
      }
    }
  }, [savedItems])

  return (
    <div>
      {!session && (
        <>
        <button onClick={() => setShowModal(true)} className='top-[2px] xxs:px-0 xmini:px-[3px] search:!px-[6px] relative lg:hover:scale-[1.3] transition-all duration-200 ease-in-out' type="button" data-modal-toggle="authentication-modal">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
        </>
      )}
      {session && (
        <>
      <Link href="/wishlist" passHref>
      <a className='cursor-pointer'>
      <button className='top-[2px] xxs:px-0 xmini:px-[3px] search:!px-[6px] relative lg:hover:scale-[1.3] transition-all duration-200 ease-in-out' type="button">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={added ? "#ff00a7" : "white"} stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      </a>
      </Link>
      </>
      )}
       <SignInModal show={showModal} onClose={() => setShowModal(false)}>
      </SignInModal>
    </div>
  )
}
