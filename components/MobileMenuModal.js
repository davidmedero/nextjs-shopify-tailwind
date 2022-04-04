import { useRef, Fragment, useState } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'
import { XIcon } from '@heroicons/react/outline'
import collections from '../categories'
import Link from 'next/link'
import MobileMenuSubcategories from './MobileMenuSubcategories'


export default function MobileMenuModal({ show, onClose }) {
  const cancelButtonRef = useRef()

  const handlers = useSwipeable({
    onSwipedLeft: () => onClose(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  const [showModal, setShowModal] = useState(false)

  const [categoryTitle, setCategoryTitle] = useState('')
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
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="-translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="-translate-x-0"
                leaveTo="-translate-x-full"
                >
                    <div {...handlers} className="p-6 flex flex-col w-screen sm:max-w-md bg-white shadow-xl">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-xl font-semibold mx-auto text-gray-900">Menu</Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                onClick={onClose}
                                >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
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
                                        setSubcategories(collection.subcollections)
                                    }}
                                    className="flex border-b justify-between py-6 hover:bg-pink-100 pl-3 cursor-pointer">
                                        <span>{collection.title}</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                  ))
                                }
                                <MobileMenuSubcategories
                                categoryTitle={categoryTitle}
                                subcategories={subcategories}
                                show={showModal}
                                onClose={() => setShowModal(false)} />
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