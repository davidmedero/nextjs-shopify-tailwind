import { useRef, Fragment } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'
import SignIn from './SignIn'


export default function SignInModal({ show, onClose }) {
  const cancelButtonRef = useRef()

  const handlers = useSwipeable({
    onSwipedUp: () => onClose(),
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
        <div {...handlers} className="mx-auto sm:mt-[90px] max-w-full flex justify-center">
          <Transition.Child
          {...handlers}
            as={Fragment}
            enter="transform transition ease-in-out duration-[550ms]"
            enterFrom="-translate-y-[500px]"
            enterTo="translate-y-0"
            leave="transform transition ease-in-out duration-[800ms]"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-[800px]"
          >
      <div>
      <div id="authentication-modal" aria-hidden="true" class="w-screen sm:w-[450px]">
      <div class="relative sm:px-4 h-full sm:h-3/4">
      <div class="relative bg-white sm:rounded-lg shadow dark:bg-gray-700">
          <div class="flex justify-end p-2">
              <button ref={cancelButtonRef} onClick={onClose} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                  <svg class="w-5 h-5 highlight-removal" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
              </button>
          </div>
              <SignIn onClose={onClose} />
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