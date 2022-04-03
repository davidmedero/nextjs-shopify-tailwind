import { useRef, Fragment, useState } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'
import { XIcon } from '@heroicons/react/outline'


export default function MobileMenuModal({ show, onClose }) {
  const cancelButtonRef = useRef()

  const handlers = useSwipeable({
    onSwipedLeft: () => onClose(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })


    return (
      <Transition.Root show={show} as={Fragment} {...handlers}>
        <Dialog 
        {...handlers}
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-50 inset-0 overflow-hidden" 
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
                <Dialog.Overlay {...handlers} className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div {...handlers} className="fixed inset-y-0 right-0 sm:pl-10 max-w-full flex">
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
                <div {...handlers} className="w-screen max-w-full sm:max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Menu</Dialog.Title>
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
                        <div className="flow-root">
                            Category
                            </div>
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