import { useState } from 'react'
import Login from './Login';

export default function LoginModal() {

  const [showModal, setShowModal] = useState(false);

  return (
    <div>
        <button onClick={() => setShowModal(true)} class='highlight-removal flex items-center mr-5' type="button" data-modal-toggle="authentication-modal">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="black" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        </button>
        <Login show={showModal} onClose={() => setShowModal(false)}>
        </Login>
    </div>
  )
}

