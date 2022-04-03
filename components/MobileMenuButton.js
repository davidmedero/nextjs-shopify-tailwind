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
            <div class="space-y-2">
                <span className="block w-8 h-1 bg-black rounded-sm"></span>
                <span className="block w-8 h-1 bg-black rounded-sm"></span>
                <span className="block w-8 h-1 bg-black rounded-sm"></span>
            </div>
        </button>
       <MobileMenuModal show={showModal} onClose={() => setShowModal(false)}>
      </MobileMenuModal>
    </div>
  )
}