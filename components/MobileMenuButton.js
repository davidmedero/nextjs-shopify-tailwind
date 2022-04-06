import { useState } from 'react'
import MobileMenuModal from './MobileMenuModal'


export default function MobileMenuButton() {

  const [showModal, setShowModal] = useState(false)

  return (
    <div>
        <button
        onClick={() => setShowModal(true)}
        type="button"
        className="flex items-center">
            <div class="space-y-1">
                <span className="block w-7 h-[3px] bg-black"></span>
                <span className="block w-7 h-[3px] bg-black"></span>
                <span className="block w-7 h-[3px] bg-black"></span>
            </div>
        </button>
       <MobileMenuModal show={showModal} onClose={() => setShowModal(false)}>
      </MobileMenuModal>
    </div>
  )
}