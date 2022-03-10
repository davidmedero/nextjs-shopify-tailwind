import { useState } from 'react'
import Modal from './Modal'
import Link from 'next/link'
import { useSession } from "next-auth/react"


export default function LoginButton() {
  const { data: session } = useSession()

  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      {!session && (
        <>
        <button onClick={() => setShowModal(true)} class='highlight-removal flex items-center mr-5' type="button" data-modal-toggle="authentication-modal">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="black" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        </button>
        </>
      )}
      {session && (
        <>
      <Link href="/signedIn" passHref>
      <a className='cursor-pointer'>
      <button class='highlight-removal flex items-center mr-5' type="button">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="black" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      </button>
      </a>
      </Link>
      </>
      )}
       <Modal show={showModal} onClose={() => setShowModal(false)}>
      </Modal>
    </div>
  )
}

