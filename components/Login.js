import { useRef, Fragment } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable';


export default function Login({ show, onClose }) {
    const cancelButtonRef = useRef()

    const handlers = useSwipeable({
        onSwipedUp: () => onClose(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
      });


      return (
        <Transition.Root show={show} as={Fragment} {...handlers}>
      <Dialog 
      {...handlers}
      initialFocus={cancelButtonRef}
      as="div" 
      className="fixed z-50 inset-0 overflow-hidden" 
      onClose={onClose}>
        <div className="absolute inset-0 overflow-hidden">
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
              enter="transform transition ease-in-out duration-500 sm:duration-600"
              enterFrom="-translate-y-[500px]"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-500 sm:duration-600"
              leaveFrom="translate-y-0"
              leaveTo="-translate-y-[550px]"
            >
        <div>
        <div id="authentication-modal" aria-hidden="true" class="w-screen sm:w-[450px]">
        <div class="relative sm:px-4 h-full sm:h-3/4">
        <div class="relative bg-white sm:rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                <button ref={cancelButtonRef} onClick={onClose} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                    <svg class="w-5 h-5 highlight-removal" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
                </button>
            </div >
            <form class="px-6 space-y-6 lg:px-8 pb-8" action="#">
                <h3 class="pb-7 pt-3 text-xl font-bold text-gray-900 dark:text-white text-center">Logo</h3>
                <div>
                    <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:!border-pink-500 focus:!outline-pink-500 focus:!bg-pink-100 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Email" required/>
                </div>
                <div>
                    <input type="password" name="password" id="password" placeholder="Password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:!border-pink-500 focus:!outline-pink-500 focus:!bg-pink-100 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                </div>
                <div class="flex justify-between">
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 accent-pink-500" />
                        </div>
                        <div class="ml-3 text-sm">
                        <label for="remember" class="font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                        </div>
                    </div>
                    <a href="#" class="no-underline text-sm text-pink-500 hover:text-pink-800">Lost Password?</a>
                </div>
                <button type="submit" class="transition-all ease-in-out duration-600 w-full text-white bg-pink-400 hover:bg-pink-500 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">Log In</button>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                Don't have an account? <a href="#" class="text-pink-500 hover:text-pink-800">Sign Up</a>
                </div>
            </form>
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