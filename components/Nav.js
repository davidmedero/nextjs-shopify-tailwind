import Link from 'next/link'
import { useContext, useState } from 'react'
import { CartContext } from '../context/shopContext'
import MiniCart from './MiniCart'
import LoginButton from './LoginButton'
import collections from '../categories'


export default function Nav() {

    const { cart, cartOpen, setCartOpen } = useContext(CartContext)

    let cartQuantity = 0
    cart.map(item => {
        return (cartQuantity += item?.variantQuantity)
    })

    const [subcategoryIndex, setSubcategoryIndex] = useState(false)
    const [categoryHandle, setCategoryHandle] = useState('')

    const subcategories = collections.map(category => {
        return category.subcollections
    })

    const findSubcategory = (e) => {
        setSubcategoryIndex(collections.findIndex(el => el.id === JSON.parse(e.target.dataset.info).id))
    }

    const getCategoryHandle = (e) => {
        setCategoryHandle(collections.find(el => el.handle === JSON.parse(e.target.dataset.info).handle).handle)
    }
    
    const [showSubMenu, setShowSubMenu] = useState(false)


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
            <div className="relative">
            {
                collections.map(collection => (
                    <Link href={'/' + collection.handle} >
                        <a className="p-6 hover:bg-pink-100"
                        data-info={JSON.stringify(collection)}
                        onMouseEnter={(e) => {
                            setShowSubMenu(true);
                            findSubcategory(e);
                            getCategoryHandle(e)
                            }}
                            onMouseLeave={() => setShowSubMenu(false)}>
                            {collection.title}
                        </a>
                    </Link>
                ))
            }
            </div>
            <div className='flex items-center justify-end'>
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
        {
          showSubMenu && (
            <div
            onMouseEnter={() => setShowSubMenu(true)}
            onMouseLeave={() => setShowSubMenu(false)}
            className="absolute w-full flex justify-center shadow-md border-b h-[73px] bg-white">
              <div className="flex justify-center bg-white">
                {subcategories[subcategoryIndex].map(subcategory => (                   
                    <Link href={'/' + categoryHandle + '/' + subcategory.handle}>
                        <div className="relative right-5">
                            <a className='flex p-6 cursor-pointer hover:bg-pink-100'>
                                {subcategory.title}
                            </a>
                        </div>
                    </Link>
                ))}
              </div>
            </div>
          )
        }
    </header>
  )
}
