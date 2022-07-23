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
                  <div className="p-6 w-screen sm:max-w-md bg-black overflow-y-scroll">
                    <div className="flex justify-between items-center relative bottom-1">
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                        onClick={() => {
                            onClose();
                            setTimeout(() => setShowSub_Subcategories(false), 600)
                            }}>

                        <span className="sr-only">Close panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <Dialog.Title className="text-xl font-semibold mx-auto text-white select-none tracking-wide">{categoryTitle.toUpperCase()}</Dialog.Title>
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
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
                  <div {...handlers} className="mt-[28px] text-white">
                    {
                      subcategories.map(subcategory => (
                        <div key={subcategory.id}>
                          <div
                          onClick={() => toggleSub_Subcategories(subcategory.id)}
                          className="border-b pl-3 hover:bg-gray-900 hover:text-[#ff00a7] cursor-pointer select-none">
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
                                        className="w-full h-[75px] flex items-center hover:font-semibold">
                                            {subcategory.title.toUpperCase()}
                                            </div>
                                      </a>
                                    </Link>
                                  ) : (
                                  <div className="flex justify-between items-center">
                                    <span className="w-full h-[75px] flex items-center hover:font-semibold">{subcategory.title.toUpperCase()}</span>
                                    <span className={showSub_Subcategories[subcategory.id] ? "rotate-180 transition-all ease-in-out duration-200" : "rotate-360 transition-all ease-in-out duration-200"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                                  <div className="my-4 text-white">
                                    {
                                      subcategory.sub_subcollections?.map(sub_subcategory => (
                                        <div 
                                        key={sub_subcategory.id}
                                        onClick={() => {
                                            closeMenu();
                                            onClose();
                                            setShowSub_Subcategories(false)
                                            }}>
                                            <Link href={'/' + categoryHandle + '/' + subcategory.handle + '/' + sub_subcategory.handle}>
                                                <div className="relative">
                                                    <a className='flex py-1 px-6 cursor-pointer hover:bg-gray-900 hover:text-[#ff00a7] select-none hover:font-semibold'>
                                                        {sub_subcategory.title.toUpperCase()}
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