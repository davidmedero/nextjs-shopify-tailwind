import Register from './Register'
import { useState } from 'react'

export default function Login() {

  const [show, setShow] = useState(true)

      return (
        <div>
        {
          show ? 
          <form class="px-6 space-y-6 lg:px-8 pb-8">
      <h3 class="pb-7 pt-3 text-xl font-bold text-gray-900 dark:text-white text-center">Logo</h3>
      <div>
          <input 
          type="email" 
          name="email" 
          placeholder="Email"
          id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:!border-pink-500 focus:!outline-pink-500 focus:!bg-pink-100 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
      </div>
      <div>
          <input 
          type="password" 
          name="password" 
          placeholder="Password"
          id="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:!border-pink-500 focus:!outline-pink-500 focus:!bg-pink-100 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
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
          <a class="no-underline text-sm text-pink-500 hover:text-pink-800">Lost Password?</a>
      </div>
      <button type="button" class="transition-all ease-in-out duration-600 w-full text-white bg-pink-400 hover:bg-pink-500 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">Log In</button>
      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
      Don't have an account? <a onClick={() => setShow(false)} class="text-pink-500 hover:text-pink-800">Register</a>
      </div>
  </form>
  : <Register />
        }
        </div>
      
  )
}