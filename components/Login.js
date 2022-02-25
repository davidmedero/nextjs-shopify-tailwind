import { useState, useEffect, useRef, useCallback } from "react"
import ReactDOM from "react-dom"
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'


export default function Login({ show, onClose }) {

    const [isBrowser, setIsBrowser] = useState(false)

    useEffect(() => {
        setIsBrowser(true)
    }, [])

    const handleClose = (e) => {
        e.preventDefault()
        onClose()
    }

    const ref = useRef()

    const handleKey = useCallback(
      (e) => {
        if (e.key === 'Escape') {
          return onClose()
        }
      },
      [onClose]
    )

    useEffect(() => {
        const modal = ref.current
    
        if (modal) {
          disableBodyScroll(modal, { reserveScrollBarGap: true })
          window.addEventListener('keydown', handleKey)
        }
        return () => {
          clearAllBodyScrollLocks()
          window.removeEventListener('keydown', handleKey)
        }
      }, [handleKey])

    const modalContent = show ? (
        <div ref={ref} onClick={() => onClose()}>
        <div id="authentication-modal" aria-hidden="true" class="flex overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-0 z-50 justify-center items-center h-full bg-black bg-opacity-50">
        <div onClick={e => e.stopPropagation()} class="relative sm:px-4 w-full sm:max-w-md h-full sm:h-3/4">
        <div class="relative bg-white sm:rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                <button onClick={handleClose} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
                </button>
            </div >
            <form class="px-6 space-y-6 lg:px-8 pb-8" action="#">
                <h3 class="pb-7 pt-3 text-xl font-bold text-gray-900 dark:text-white text-center">Logo</h3>
                <div>
                    <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:!border-green-500 focus:!outline-green-500 focus:!bg-green-100 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Email" required/>
                </div>
                <div>
                    <input type="password" name="password" id="password" placeholder="Password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:!border-green-500 focus:!outline-green-500 focus:!bg-green-100 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                </div>
                <div class="flex justify-between">
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 accent-green-500" />
                        </div>
                        <div class="ml-3 text-sm">
                        <label for="remember" class="font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                        </div>
                    </div>
                    <a href="#" class="no-underline text-sm text-green-500 hover:text-green-700">Lost Password?</a>
                </div>
                <button type="submit" class="transition-all ease-in-out duration-600 w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Log In</button>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                Don't have an account? <a href="#" class="text-green-500 hover:text-green-700">Sign Up</a>
                </div>
            </form>
           </div>
          </div>
         </div>
        </div>
    ) : null
    if (isBrowser) {
        return ReactDOM.createPortal(
            modalContent,
            //This Id can be found in _document.js
            document.getElementById('modal-root')
        )
    } else {
        return null
    }
}