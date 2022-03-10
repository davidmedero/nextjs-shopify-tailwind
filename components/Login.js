import { signIn } from "next-auth/react"


export default function Login() {

      return (
        <div>
          <form class="px-6 space-y-6 lg:px-8 pb-8">
      <h3 class="pb-7 pt-3 text-xl font-bold text-gray-900 dark:text-white text-center">Logo</h3>
      <div>
          <input 
          type="email" 
          name="email" 
          placeholder="Email"
          id="username" class="h-[45px] bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:!border-pink-500 focus:!outline-pink-500 focus:!bg-pink-100 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
      </div>
      <button onClick={() => signIn('google')} type="button" class="h-[45px] transition-all ease-in-out duration-600 w-full text-white bg-pink-400 hover:bg-pink-500 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">Sign in with Google</button>
  </form>
        </div>
  )
}