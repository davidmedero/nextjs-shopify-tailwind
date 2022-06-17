import { useRef, Fragment, useState } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'
import { XIcon } from '@heroicons/react/outline'
import collections from '../categories'
import MobileMenuSubcategories from './MobileMenuSubcategories'
import SignInButton from "./SignInButton"
import CurrencyConversion from "./CurrencyConversion"
import { useSession } from "next-auth/react"
import SignInModal from "./SignInModal"
import Link from "next/link"


export default function MobileMenuModal({ show, onClose }) {

  const { data: session } = useSession()

  const cancelButtonRef = useRef()

  const handlers = useSwipeable({
    onSwipedLeft: () => onClose(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  const [showModal, setShowModal] = useState(false)
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)

  const [categoryTitle, setCategoryTitle] = useState('')
  const [categoryHandle, setCategoryHandle] = useState('')
  const [subcategories, setSubcategories] = useState([])


    return (
      <Transition.Root show={show} as={Fragment} {...handlers}>
        <Dialog 
        {...handlers}
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-50 inset-0 overflow-hidden" 
        onClose={onClose}>
            <div {...handlers} className="absolute inset-0">
            <Transition.Child
            {...handlers}
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog.Overlay {...handlers} className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div {...handlers} className="fixed inset-y-0 left-0 max-w-full flex">
                <Transition.Child
                {...handlers}
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-600"
                enterFrom="-translate-x-full"
                enterTo="-translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-600"
                leaveFrom="-translate-x-0"
                leaveTo="-translate-x-full"
                >
                    <div {...handlers} className="p-6 flex flex-col w-screen sm:max-w-md bg-black text-white shadow-xl overflow-y-scroll">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-xl font-semibold mx-auto">Menu</Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="-m-2 p-2 text-white hover:text-gray-500"
                                onClick={onClose}
                                >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6 relative z-50" aria-hidden="true" />
                                </button>
                          </div>
                        </div>
                        <div {...handlers} className="mt-8">
                        <div>
                            <div className="flex flex-col">
                                {
                                  collections.map(collection => (
                                    <div 
                                    onClick={() => {
                                        setShowModal(true);
                                        setCategoryTitle(collection.title);
                                        setCategoryHandle(collection.handle);
                                        setSubcategories(collection.subcollections)
                                    }}
                                    className="flex border-b justify-between items-center hover:text-[#ff00a7] pl-3 cursor-pointer">
                                        <span className="w-full h-[75px] flex items-center">{collection.title.toUpperCase()}</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                  ))
                                }
                                <div>
                                {!session && (
                                  <>
                                  <div onClick={() => setShowSignInModal(true)} className="xxs:block xs:!hidden flex flex-col hover:text-[#ff00a7]">
                                  <div className="flex flex-row items-center justify-between pl-3 py-6 border-b">
                                    <div className="flex flex-row">SIGN IN <span className="ml-2"><SignInButton /></span></div>
                                    <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                  </div>
                                  </div>
                                  </>
                                )}
                                {session && (
                                  <>
                                <Link href="/account-dashboard" passHref>
                                <a className='cursor-pointer'>
                                <div 
                                onClick={() => onClose()}
                                className="xxs:block xs:!hidden flex flex-col hover:text-[#ff00a7]">
                                  <div className="flex flex-row items-center justify-between pl-3 py-6 border-b">
                                    <div className="flex flex-row">MY ACCOUNT <span className="ml-2"><SignInButton /></span></div>
                                    <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                  </div>
                                  </div>
                                </a>
                                </Link>
                                </>
                                )}
                                <SignInModal show={showSignInModal} onClose={() => setShowSignInModal(false)}>
                                </SignInModal>
                                  <div 
                                  onClick={() => {
                                    setShowCurrencyModal(true);
                                }}
                                  className="flex flex-row items-center justify-between border-b pl-3 py-6 xs:hidden hover:text-[#ff00a7]">
                                  <div className="flex flex-row items-center">CHANGE CURRENCY<span className="ml-2">
                                    <CurrencyConversion 
                                      show={showCurrencyModal}
                                      onClose={() => setShowCurrencyModal(false)}
                                      closeMenu={onClose} />
                                      </span>
                                  </div>
                                  <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                  </div>
                                </div>
                                <MobileMenuSubcategories
                                  categoryTitle={categoryTitle}
                                  categoryHandle={categoryHandle}
                                  subcategories={subcategories}
                                  show={showModal}
                                  onClose={() => setShowModal(false)}
                                  closeMenu={onClose} />
                            </div>
                        </div>
                      </div>
                    </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
}