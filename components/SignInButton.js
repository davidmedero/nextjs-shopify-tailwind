import { useState } from 'react'
import SignInModal from './SignInModal'
import Link from 'next/link'
import { useSession } from "next-auth/react"


export default function SignInButton() {
  const { data: session } = useSession()

  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      {!session && (
        <>
        <button onClick={() => setShowModal(true)} className='highlight-removal flex items-center mr-5 hover:scale-[1.3] transition-all duration-200 ease-in-out' type="button" data-modal-toggle="authentication-modal">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24" stroke="white">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        </button>
        </>
      )}
      {session && (
        <>
      <Link href="/yourOrders" passHref>
      <a className='cursor-pointer'>
      <button className='highlight-removal flex items-center mr-5 hover:scale-[1.3] transition-all duration-200 ease-in-out' type="button">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24" stroke="white">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

