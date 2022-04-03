import { useRef, Fragment, useState } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'
import { XIcon } from '@heroicons/react/outline'
import collections from '../categories'
import Link from 'next/link'


export default function MobileMenuSubcategories({ show, onClose }) {
  const cancelButtonRef = useRef()

  const handlers = useSwipeable({
    onSwipedLeft: () => onClose(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  const [showModal, setShowModal] = useState(false)


    return (
      <Transition.Root show={show} as={Fragment} {...handlers}>
        <Dialog 
        {...handlers}
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-[60] inset-0 overflow-hidden" 
        onClose={onClose}>
          <div {...handlers} className="absolute inset-0 overflow-hidden">
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
                <Dialog.Overlay {...handlers} className="absolute inset-0" />
            </Transition.Child>
            <div {...handlers} className="fixed inset-y-0 left-0 max-w-full flex overflow-hidden">
                <Transition.Child
                {...handlers}
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
                >
                  <div className="mt-7 ml-6 bg-white">
                    <div className="flex justify-between items-center relative bottom-1">
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                        >
                        <span className="sr-only">Close panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <Dialog.Title className="text-xl font-semibold mx-auto text-gray-900">Category</Dialog.Title>
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-mx-2 -my-[10px] p-2 text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                        >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  <div {...handlers} className="mt-[28px] w-[385px]">
                    {
                        collections.map(collection => (
                        <div className="flex border-b flow-row justify-between py-6 hover:bg-pink-100 pl-3 cursor-pointer">
                            <span>{collection.title}</span>
                            <span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            </span>
                        </div>
                        ))
                    }
                  </div>
                  </div>
                </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
}