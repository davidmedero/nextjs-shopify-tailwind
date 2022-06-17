import { useState } from 'react'
import MobileMenuModal from './MobileMenuModal'


export default function MobileMenuButton() {

  const [showModal, setShowModal] = useState(false)

  return (
    <div className='relative xxs:right-1 mini:right-[unset]'>
        <button
        onClick={() => setShowModal(true)}
        type="button"
        className="flex items-center">
            <div className="space-y-1">
                <span className="block w-7 h-[3px] bg-white"></span>
                <span className="block w-7 h-[3px] bg-white"></span>
                <span className="block w-7 h-[3px] bg-white"></span>
            </div>
        </button>
       <MobileMenuModal show={showModal} onClose={() => setShowModal(false)}>
      </MobileMenuModal>
    </div>
  )
}