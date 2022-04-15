import { useRef, Fragment, useState } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'
import { XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'


export default function MobileMenuSubcategories({ show, onClose, closeMenu, categoryTitle, categoryHandle, subcategories }) {
  const cancelButtonRef = useRef()

  const handlers = useSwipeable({
    onSwipedLeft: () => onClose(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  const [showSub_Subcategories, setShowSub_Subcategories] = useState({})

  const toggleSub_Subcategories = id => {
    setShowSub_Subcategories(prevShown => ({
      ...prevShown,
      [id]: !prevShown[id]
    }))
  }

    return (
      <Transition.Root show={show} as={Fragment} {...handlers}>
        <Dialog 
        {...handlers}
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-[60] inset-0 overflow-hidden" 
        onClose={() => {
            closeMenu();
            onClose();
            setShowSub_Subcategories(false)
        }}>
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
                enter="transform transition ease-in-out duration-500 sm:duration-600"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-600"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
                >
                  <div className="mt-1 p-6 w-screen sm:max-w-md bg-white overflow-y-scroll">
                    <div className="flex justify-between items-center relative bottom-1">
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={() => {
                            onClose();
                            setShowSub_Subcategories(false)
                            }}>

                        <span className="sr-only">Close panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <Dialog.Title className="text-xl font-semibold mx-auto text-gray-900">{categoryTitle}</Dialog.Title>
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-mx-2 -my-[10px] p-2 text-gray-400 hover:text-gray-500"
                        onClick={() => {
                            closeMenu();
                            onClose();
                            setShowSub_Subcategories(false)
                        }}
                        >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  <div {...handlers} className="mt-[28px]">
                    {
                      subcategories.map(subcategory => (
                        <div key={subcategory.id}>
                          <div
                          onClick={() => toggleSub_Subcategories(subcategory.id)}
                          className="border-b pl-3 hover:bg-pink-100 cursor-pointer">
                              {
                                  !subcategory.sub_subcollections && subcategory.handle !== "" ? 
                                  (
                                    <Link href={'/' + categoryHandle + '/' + subcategory.handle}>
                                      <a className="">
                                        <div
                                        onClick={() => {
                                          closeMenu();
                                          onClose();
                                          setShowSub_Subcategories(false)
                                        }}
                                        className="w-full h-[75px] flex items-center">
                                            {subcategory.title}
                                            </div>
                                      </a>
                                    </Link>
                                  ) : (
                                  <div className="flex justify-between items-center">
                                    <span className="w-full h-[75px] flex items-center">{subcategory.title}</span>
                                    <span className={showSub_Subcategories[subcategory.id] ? "rotate-180 transition-all ease-in-out duration-200" : "rotate-360 transition-all ease-in-out duration-200"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                  </div>
                                  )
                              }
                            </div>
                            <SlideDown className={'my-dropdown-slidedown'}>
                              {
                                showSub_Subcategories[subcategory.id] ?
                                (
                                  <div className="my-4">
                                    {
                                      subcategory.sub_subcollections?.map(sub_subcategory => (
                                        <div 
                                        onClick={() => {
                                            closeMenu();
                                            onClose();
                                            setShowSub_Subcategories(false)
                                            }}>
                                            <Link href={'/' + categoryHandle + '/' + subcategory.handle + '/' + sub_subcategory.handle}>
                                                <div className="relative">
                                                    <a className='flex py-1 px-6 cursor-pointer hover:bg-pink-100'>
                                                        {sub_subcategory.title}
                                                    </a>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                    }
                                  </div>
                                )
                                : null
                              }
                              </SlideDown>
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