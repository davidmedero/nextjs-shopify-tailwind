import Link from 'next/link'
import { useContext } from 'react'
import { CartContext } from '../context/shopContext'
import MiniCart from './MiniCart'
import LoginButton from './LoginButton'


export default function Nav() {
    const { cart, cartOpen, setCartOpen } = useContext(CartContext)

    let cartQuantity = 0
    cart.map(item => {
        return (cartQuantity += item?.variantQuantity)
    })

  return (
    <header className='border-b sticky top-0 z-20 bg-white shadow-md'>
        <div className='flex items-center justify-between max-w-6xl py-4 px-8 mx-auto lg:max-w-screen-xl'>
            <Link href="/" passHref>
                <a className='cursor-pointer'>
                    <span className='text-lg pt-1 font-bold'>
                        Logo
                    </span>
                </a>
            </Link>
            <div className='flex items-center w-30 justify-end'>
            <LoginButton />
            <a 
            className='text-lg font-bold cursor-pointer'
            onClick={() => setCartOpen(!cartOpen)}
            >
                Cart {cartQuantity > 0 ? '(' + cartQuantity + ')' : ''}
            </a>
            <MiniCart cart={cart} />
            </div>
        </div>
    </header>
  )
}
